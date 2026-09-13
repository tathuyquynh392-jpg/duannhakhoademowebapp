from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.models import TreatmentImage, Patient, User
from app.schemas.schemas import TreatmentImageOut, TreatmentImageCreate
from app.auth.jwt import get_current_user, require_admin, check_patient_access

router = APIRouter(prefix="/api/treatment-images", tags=["Treatment Images"])

@router.get("", response_model=List[TreatmentImageOut])
def get_treatment_images(
    patient_id: Optional[int] = None,
    stage: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(TreatmentImage)

    if current_user.role == "PATIENT":
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if not patient:
            return []
        query = query.filter(TreatmentImage.patient_id == patient.id)
    else:
        if patient_id:
            query = query.filter(TreatmentImage.patient_id == patient_id)

    if stage:
        query = query.filter(TreatmentImage.stage == stage)

    return query.order_by(TreatmentImage.uploaded_at.desc()).all()

@router.post("", response_model=TreatmentImageOut)
def create_treatment_image(
    req: TreatmentImageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    img = TreatmentImage(
        patient_id=req.patient_id,
        treatment_record_id=req.treatment_record_id,
        image_url=req.image_url,
        title=req.title,
        stage=req.stage
    )
    db.add(img)
    db.commit()
    db.refresh(img)
    return img

@router.delete("/{image_id}")
def delete_treatment_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    img = db.query(TreatmentImage).filter(TreatmentImage.id == image_id).first()
    if not img:
        raise HTTPException(status_code=404, detail="Không tìm thấy hình ảnh")
    db.delete(img)
    db.commit()
    return {"message": "Xóa hình ảnh thành công"}
