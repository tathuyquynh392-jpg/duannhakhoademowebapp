import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.models import Appointment, Patient, Doctor, DentalChair, Service, User
from app.schemas.schemas import (
    AppointmentOut, AppointmentCreate, AppointmentReschedule,
    AppointmentCancel, AppointmentUpdateStatus
)
from app.auth.jwt import get_current_user, require_admin, check_patient_access

router = APIRouter(prefix="/api/appointments", tags=["Appointments"])

@router.get("", response_model=List[AppointmentOut])
def get_appointments(
    patient_id: Optional[int] = None,
    doctor_id: Optional[int] = None,
    status_filter: Optional[str] = None,
    date: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Appointment)

    if current_user.role == "PATIENT":
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if not patient:
            return []
        query = query.filter(Appointment.patient_id == patient.id)
    else:
        if patient_id:
            query = query.filter(Appointment.patient_id == patient_id)

    if doctor_id:
        query = query.filter(Appointment.doctor_id == doctor_id)
    if status_filter:
        query = query.filter(Appointment.status == status_filter)
    if date:
        query = query.filter(Appointment.date == date)

    return query.order_by(Appointment.date.desc(), Appointment.time_slot.asc()).all()

@router.get("/{appointment_id}", response_model=AppointmentOut)
def get_appointment(appointment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Không tìm thấy lịch khám")
    check_patient_access(current_user, appt.patient_id, db)
    return appt

@router.post("", response_model=AppointmentOut)
def create_appointment(
    req: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Determine target patient_id
    if current_user.role == "PATIENT":
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if not patient:
            raise HTTPException(status_code=400, detail="Tài khoản chưa liên kết hồ sơ bệnh nhân")
        target_patient_id = patient.id
    else:
        if not req.patient_id:
            raise HTTPException(status_code=400, detail="Vui lòng chọn bệnh nhân")
        target_patient_id = req.patient_id

    # Check for doctor/chair time slot collision if specified
    if req.doctor_id:
        conflict_doctor = db.query(Appointment).filter(
            Appointment.doctor_id == req.doctor_id,
            Appointment.date == req.date,
            Appointment.time_slot == req.time_slot,
            Appointment.status.in_(["Chờ xác nhận", "Đã xác nhận"])
        ).first()
        if conflict_doctor:
            raise HTTPException(status_code=400, detail="Bác sĩ đã có lịch hẹn trùng khung giờ này")

    if req.chair_id:
        conflict_chair = db.query(Appointment).filter(
            Appointment.chair_id == req.chair_id,
            Appointment.date == req.date,
            Appointment.time_slot == req.time_slot,
            Appointment.status.in_(["Chờ xác nhận", "Đã xác nhận"])
        ).first()
        if conflict_chair:
            raise HTTPException(status_code=400, detail="Ghế khám đã được xếp trùng khung giờ này")

    count = db.query(Appointment).count()
    appointment_code = f"LK{count + 1:04d}"

    appt = Appointment(
        appointment_code=appointment_code,
        patient_id=target_patient_id,
        doctor_id=req.doctor_id,
        chair_id=req.chair_id,
        service_id=req.service_id,
        date=req.date,
        time_slot=req.time_slot,
        status="Chờ xác nhận",
        notes=req.notes
    )
    db.add(appt)
    db.commit()
    db.refresh(appt)
    return appt

@router.put("/{appointment_id}/reschedule", response_model=AppointmentOut)
def reschedule_appointment(
    appointment_id: int,
    req: AppointmentReschedule,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Không tìm thấy lịch khám")

    check_patient_access(current_user, appt.patient_id, db)

    if appt.status in ["Đã hủy", "Đã khám"]:
        raise HTTPException(status_code=400, detail="Không thể đổi lịch khám đã hủy hoặc đã khám")

    doc_id = req.doctor_id or appt.doctor_id
    if doc_id:
        conflict = db.query(Appointment).filter(
            Appointment.id != appt.id,
            Appointment.doctor_id == doc_id,
            Appointment.date == req.date,
            Appointment.time_slot == req.time_slot,
            Appointment.status.in_(["Chờ xác nhận", "Đã xác nhận"])
        ).first()
        if conflict:
            raise HTTPException(status_code=400, detail="Khung giờ mới của bác sĩ đã bị trùng")

    appt.date = req.date
    appt.time_slot = req.time_slot
    if req.doctor_id is not None: appt.doctor_id = req.doctor_id
    if req.chair_id is not None: appt.chair_id = req.chair_id
    appt.status = "Chờ xác nhận"  # Re-confirm upon reschedule

    db.commit()
    db.refresh(appt)
    return appt

@router.put("/{appointment_id}/cancel", response_model=AppointmentOut)
def cancel_appointment(
    appointment_id: int,
    req: AppointmentCancel,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Không tìm thấy lịch khám")

    check_patient_access(current_user, appt.patient_id, db)

    if appt.status == "Đã khám":
        raise HTTPException(status_code=400, detail="Lịch khám đã hoàn thành, không thể hủy")

    appt.status = "Đã hủy"
    appt.cancel_reason = req.cancel_reason

    db.commit()
    db.refresh(appt)
    return appt

@router.put("/{appointment_id}/status", response_model=AppointmentOut)
def update_appointment_status(
    appointment_id: int,
    req: AppointmentUpdateStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Không tìm thấy lịch khám")

    appt.status = req.status
    if req.doctor_id: appt.doctor_id = req.doctor_id
    if req.chair_id: appt.chair_id = req.chair_id

    db.commit()
    db.refresh(appt)
    return appt
