import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.models import Patient, User
from app.schemas.schemas import PatientOut, PatientCreate, PatientUpdate
from app.auth.jwt import get_current_user, require_admin, check_patient_access
from app.auth.security import get_password_hash

router = APIRouter(prefix="/api/patients", tags=["Patients"])

@router.get("", response_model=List[PatientOut])
def get_patients(
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Patient)

    # If Patient user, force restriction to their own record only
    if current_user.role == "PATIENT":
        query = query.filter(Patient.user_id == current_user.id)
    else:
        # Admin can search and filter
        if search:
            search_fmt = f"%{search}%"
            query = query.filter(
                (Patient.full_name.ilike(search_fmt)) |
                (Patient.phone.ilike(search_fmt)) |
                (Patient.patient_code.ilike(search_fmt)) |
                (Patient.email.ilike(search_fmt))
            )
        if status_filter:
            query = query.filter(Patient.status == status_filter)

    patients = query.offset(skip).limit(limit).all()
    return patients

@router.get("/{patient_id}", response_model=PatientOut)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_patient_access(current_user, patient_id, db)
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Không tìm thấy hồ sơ bệnh nhân")
    return patient

@router.post("", response_model=PatientOut)
def create_patient(
    req: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    # Generate unique patient code
    count = db.query(Patient).count()
    patient_code = f"BN{count + 1:04d}"
    
    # Check phone unique
    existing_phone = db.query(Patient).filter(Patient.phone == req.phone).first()
    if existing_phone:
        raise HTTPException(status_code=400, detail="Số điện thoại đã được đăng ký cho bệnh nhân khác")

    user_id = None
    if req.create_account and req.username and req.password:
        existing_user = db.query(User).filter(User.username == req.username).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Tên đăng nhập tài khoản đã tồn tại")
        
        user = User(
            username=req.username,
            email=req.email or f"{req.username}@luckydental.vn",
            hashed_password=get_password_hash(req.password),
            role="PATIENT",
            full_name=req.full_name
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        user_id = user.id

    patient = Patient(
        user_id=user_id,
        patient_code=patient_code,
        full_name=req.full_name,
        dob=req.dob,
        gender=req.gender,
        phone=req.phone,
        email=req.email,
        address=req.address,
        registration_date=datetime.date.today().strftime("%Y-%m-%d"),
        notes=req.notes,
        status=req.status or "Hoạt động"
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient

@router.put("/{patient_id}", response_model=PatientOut)
def update_patient(
    patient_id: int,
    req: PatientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_patient_access(current_user, patient_id, db)
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh nhân")

    # If Patient, restrict editable fields (cannot change status or medical notes)
    if current_user.role == "PATIENT":
        if req.full_name is not None: patient.full_name = req.full_name
        if req.dob is not None: patient.dob = req.dob
        if req.gender is not None: patient.gender = req.gender
        if req.phone is not None: patient.phone = req.phone
        if req.email is not None: patient.email = req.email
        if req.address is not None: patient.address = req.address
    else:
        # Admin can update all
        for key, value in req.dict(exclude_unset=True).items():
            setattr(patient, key, value)

    db.commit()
    db.refresh(patient)
    return patient

@router.delete("/{patient_id}")
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh nhân")
    
    db.delete(patient)
    db.commit()
    return {"message": "Xóa bệnh nhân thành công"}
