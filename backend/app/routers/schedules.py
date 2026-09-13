from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.models import DoctorSchedule, User
from app.schemas.schemas import DoctorScheduleOut, DoctorScheduleCreate, DoctorScheduleUpdate
from app.auth.jwt import get_current_user, require_admin

router = APIRouter(prefix="/api/schedules", tags=["Schedules"])

def time_to_minutes(time_str: str) -> int:
    try:
        parts = time_str.split(":")
        return int(parts[0]) * 60 + int(parts[1])
    except Exception:
        return 0

def check_schedule_overlap(db: Session, doctor_id: int, date: str, start_time: str, end_time: str, chair_id: Optional[int] = None, exclude_id: Optional[int] = None):
    s_new = time_to_minutes(start_time)
    e_new = time_to_minutes(end_time)

    if e_new <= s_new:
        raise HTTPException(status_code=400, detail="Thời gian kết thúc phải sau thời gian bắt đầu")

    # Fetch existing schedules on the same date
    query = db.query(DoctorSchedule).filter(DoctorSchedule.date == date)
    if exclude_id:
        query = query.filter(DoctorSchedule.id != exclude_id)
    
    existing_schedules = query.all()

    for s in existing_schedules:
        s_exist = time_to_minutes(s.start_time)
        e_exist = time_to_minutes(s.end_time)

        # Check for time overlap
        if max(s_new, s_exist) < min(e_new, e_exist):
            if s.doctor_id == doctor_id:
                raise HTTPException(
                    status_code=400,
                    detail=f"⚠️ Bác sĩ đã có lịch làm việc trong khoảng thời gian này ({s.start_time} - {s.end_time})."
                )
            if chair_id and s.chair_id == chair_id:
                raise HTTPException(
                    status_code=400,
                    detail=f"⚠️ Ghế khám này đã được sử dụng trong khoảng thời gian này ({s.start_time} - {s.end_time})."
                )

@router.get("", response_model=List[DoctorScheduleOut])
def get_schedules(
    doctor_id: Optional[int] = None,
    date: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(DoctorSchedule)
    if doctor_id:
        query = query.filter(DoctorSchedule.doctor_id == doctor_id)
    if date:
        query = query.filter(DoctorSchedule.date == date)
    if start_date and end_date:
        query = query.filter(DoctorSchedule.date >= start_date, DoctorSchedule.date <= end_date)
    return query.all()

@router.post("", response_model=DoctorScheduleOut)
def create_schedule(
    req: DoctorScheduleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    check_schedule_overlap(
        db,
        doctor_id=req.doctor_id,
        date=req.date,
        start_time=req.start_time,
        end_time=req.end_time,
        chair_id=req.chair_id
    )

    schedule = DoctorSchedule(
        doctor_id=req.doctor_id,
        chair_id=req.chair_id,
        date=req.date,
        start_time=req.start_time,
        end_time=req.end_time,
        shift=req.shift,
        status=req.status or "Đã xếp",
        notes=req.notes
    )
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return schedule

@router.put("/{schedule_id}", response_model=DoctorScheduleOut)
def update_schedule(
    schedule_id: int,
    req: DoctorScheduleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    sched = db.query(DoctorSchedule).filter(DoctorSchedule.id == schedule_id).first()
    if not sched:
        raise HTTPException(status_code=404, detail="Không tìm thấy lịch làm việc")

    target_doctor_id = req.doctor_id if req.doctor_id is not None else sched.doctor_id
    target_chair_id = req.chair_id if req.chair_id is not None else sched.chair_id
    target_date = req.date if req.date is not None else sched.date
    target_start = req.start_time if req.start_time is not None else sched.start_time
    target_end = req.end_time if req.end_time is not None else sched.end_time

    check_schedule_overlap(
        db,
        doctor_id=target_doctor_id,
        date=target_date,
        start_time=target_start,
        end_time=target_end,
        chair_id=target_chair_id,
        exclude_id=sched.id
    )

    for k, v in req.dict(exclude_unset=True).items():
        setattr(sched, k, v)

    db.commit()
    db.refresh(sched)
    return sched

@router.delete("/{schedule_id}")
def delete_schedule(schedule_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    sched = db.query(DoctorSchedule).filter(DoctorSchedule.id == schedule_id).first()
    if not sched:
        raise HTTPException(status_code=404, detail="Không tìm thấy lịch làm việc")
    db.delete(sched)
    db.commit()
    return {"message": "Xóa lịch làm việc thành công"}
