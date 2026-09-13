from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.models import Doctor, User
from app.schemas.schemas import DoctorOut, DoctorCreate, DoctorUpdate
from app.auth.jwt import get_current_user, require_admin

router = APIRouter(prefix="/api/doctors", tags=["Doctors"])

@router.get("", response_model=List[DoctorOut])
def get_doctors(
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Doctor)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (Doctor.full_name.ilike(s)) |
            (Doctor.specialization.ilike(s)) |
            (Doctor.doctor_code.ilike(s))
        )
    if status_filter:
        query = query.filter(Doctor.status == status_filter)
    return query.all()

@router.get("/{doctor_id}", response_model=DoctorOut)
def get_doctor(doctor_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Không tìm thấy bác sĩ")
    return doctor

@router.post("", response_model=DoctorOut)
def create_doctor(req: DoctorCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    count = db.query(Doctor).count()
    doctor_code = f"BS{count + 1:03d}"
    doctor = Doctor(
        doctor_code=doctor_code,
        full_name=req.full_name,
        specialization=req.specialization,
        phone=req.phone,
        email=req.email,
        experience_years=req.experience_years,
        status=req.status or "Đang làm việc"
    )
    db.add(doctor)
    db.commit()
    db.refresh(doctor)
    return doctor

@router.put("/{doctor_id}", response_model=DoctorOut)
def update_doctor(doctor_id: int, req: DoctorUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Không tìm thấy bác sĩ")
    for k, v in req.dict(exclude_unset=True).items():
        setattr(doctor, k, v)
    db.commit()
    db.refresh(doctor)
    return doctor

@router.delete("/{doctor_id}")
def delete_doctor(doctor_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Không tìm thấy bác sĩ")
    db.delete(doctor)
    db.commit()
    return {"message": "Xóa bác sĩ thành công"}
