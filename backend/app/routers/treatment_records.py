from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.models import TreatmentRecord, Patient, User
from app.schemas.schemas import TreatmentRecordOut, TreatmentRecordCreate, TreatmentRecordUpdate
from app.auth.jwt import get_current_user, require_admin, check_patient_access

router = APIRouter(prefix="/api/treatment-records", tags=["Treatment Records"])

@router.get("", response_model=List[TreatmentRecordOut])
def get_treatment_records(
    patient_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(TreatmentRecord)

    if current_user.role == "PATIENT":
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if not patient:
            return []
        query = query.filter(TreatmentRecord.patient_id == patient.id)
    else:
        if patient_id:
            query = query.filter(TreatmentRecord.patient_id == patient_id)

    return query.order_by(TreatmentRecord.date.desc()).all()

@router.post("", response_model=TreatmentRecordOut)
def create_treatment_record(
    req: TreatmentRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    rec = TreatmentRecord(
        patient_id=req.patient_id,
        doctor_id=req.doctor_id,
        treatment_plan_id=req.treatment_plan_id,
        service_id=req.service_id,
        date=req.date,
        content=req.content,
        pre_condition=req.pre_condition,
        post_result=req.post_result,
        notes=req.notes,
        next_plan=req.next_plan
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec

@router.put("/{record_id}", response_model=TreatmentRecordOut)
def update_treatment_record(
    record_id: int,
    req: TreatmentRecordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    rec = db.query(TreatmentRecord).filter(TreatmentRecord.id == record_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Không tìm thấy hồ sơ điều trị")
    for k, v in req.dict(exclude_unset=True).items():
        setattr(rec, k, v)
    db.commit()
    db.refresh(rec)
    return rec

@router.delete("/{record_id}")
def delete_treatment_record(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    rec = db.query(TreatmentRecord).filter(TreatmentRecord.id == record_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Không tìm thấy hồ sơ điều trị")
    db.delete(rec)
    db.commit()
    return {"message": "Xóa hồ sơ điều trị thành công"}
