from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.models import DentalChair, User
from app.schemas.schemas import DentalChairOut, DentalChairCreate, DentalChairUpdate
from app.auth.jwt import get_current_user, require_admin

router = APIRouter(prefix="/api/dental-chairs", tags=["Dental Chairs"])

@router.get("", response_model=List[DentalChairOut])
def get_chairs(
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(DentalChair)
    if search:
        s = f"%{search}%"
        query = query.filter((DentalChair.name.ilike(s)) | (DentalChair.room.ilike(s)) | (DentalChair.chair_code.ilike(s)))
    if status_filter:
        query = query.filter(DentalChair.status == status_filter)
    return query.all()

@router.post("", response_model=DentalChairOut)
def create_chair(req: DentalChairCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    count = db.query(DentalChair).count()
    chair_code = f"GC{count + 1:02d}"
    chair = DentalChair(
        chair_code=chair_code,
        name=req.name,
        room=req.room,
        status=req.status or "Trống"
    )
    db.add(chair)
    db.commit()
    db.refresh(chair)
    return chair

@router.put("/{chair_id}", response_model=DentalChairOut)
def update_chair(chair_id: int, req: DentalChairUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    chair = db.query(DentalChair).filter(DentalChair.id == chair_id).first()
    if not chair:
        raise HTTPException(status_code=404, detail="Không tìm thấy ghế khám")
    for k, v in req.dict(exclude_unset=True).items():
        setattr(chair, k, v)
    db.commit()
    db.refresh(chair)
    return chair

@router.delete("/{chair_id}")
def delete_chair(chair_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    chair = db.query(DentalChair).filter(DentalChair.id == chair_id).first()
    if not chair:
        raise HTTPException(status_code=404, detail="Không tìm thấy ghế khám")
    db.delete(chair)
    db.commit()
    return {"message": "Xóa ghế khám thành công"}
