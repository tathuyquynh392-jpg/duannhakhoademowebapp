from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.models import FollowUpAppointment, Patient, User
from app.schemas.schemas import FollowUpOut, FollowUpCreate
from app.auth.jwt import get_current_user, require_admin, check_patient_access

router = APIRouter(prefix="/api/follow-ups", tags=["Follow-up Appointments"])

@router.get("", response_model=List[FollowUpOut])
def get_follow_ups(
    patient_id: Optional[int] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(FollowUpAppointment)

    if current_user.role == "PATIENT":
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if not patient:
            return []
        query = query.filter(FollowUpAppointment.patient_id == patient.id)
    else:
        if patient_id:
            query = query.filter(FollowUpAppointment.patient_id == patient_id)

    if status_filter:
        query = query.filter(FollowUpAppointment.status == status_filter)

    return query.order_by(FollowUpAppointment.date.asc()).all()

@router.post("", response_model=FollowUpOut)
def create_follow_up(
    req: FollowUpCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    fu = FollowUpAppointment(
        patient_id=req.patient_id,
        doctor_id=req.doctor_id,
        date=req.date,
        time=req.time,
        content=req.content,
        notes=req.notes,
        status=req.status or "Tái khám sắp tới"
    )
    db.add(fu)
    db.commit()
    db.refresh(fu)
    return fu

@router.put("/{follow_up_id}", response_model=FollowUpOut)
def update_follow_up(
    follow_up_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    fu = db.query(FollowUpAppointment).filter(FollowUpAppointment.id == follow_up_id).first()
    if not fu:
        raise HTTPException(status_code=404, detail="Không tìm thấy lịch tái khám")
    fu.status = status
    db.commit()
    db.refresh(fu)
    return fu
