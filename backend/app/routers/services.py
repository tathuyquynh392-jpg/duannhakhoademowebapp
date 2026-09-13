from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.models import Service, Appointment, TreatmentPlan, TreatmentRecord, InvoiceItem, User
from app.schemas.schemas import ServiceOut, ServiceCreate, ServiceUpdate
from app.auth.jwt import get_current_user, require_admin

router = APIRouter(prefix="/api/services", tags=["Dental Services"])

@router.get("", response_model=List[ServiceOut])
def get_services(
    search: Optional[str] = None,
    category: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Service)
    if search:
        s = f"%{search}%"
        query = query.filter((Service.name.ilike(s)) | (Service.service_code.ilike(s)) | (Service.category.ilike(s)))
    if category:
        query = query.filter(Service.category == category)
    if status_filter:
        query = query.filter(Service.status == status_filter)
    return query.all()

@router.get("/{service_id}", response_model=ServiceOut)
def get_service(service_id: int, db: Session = Depends(get_db)):
    srv = db.query(Service).filter(Service.id == service_id).first()
    if not srv:
        raise HTTPException(status_code=404, detail="Không tìm thấy dịch vụ nha khoa")
    return srv

@router.post("", response_model=ServiceOut)
def create_service(req: ServiceCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    count = db.query(Service).count()
    service_code = f"DV{count + 1:03d}"
    srv = Service(
        service_code=service_code,
        name=req.name,
        category=req.category or "Nha khoa tổng quát",
        description=req.description,
        price=req.price,
        status=req.status or "Hoạt động"
    )
    db.add(srv)
    db.commit()
    db.refresh(srv)
    return srv

@router.put("/{service_id}", response_model=ServiceOut)
def update_service(service_id: int, req: ServiceUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    srv = db.query(Service).filter(Service.id == service_id).first()
    if not srv:
        raise HTTPException(status_code=404, detail="Không tìm thấy dịch vụ nha khoa")
    for k, v in req.dict(exclude_unset=True).items():
        setattr(srv, k, v)
    db.commit()
    db.refresh(srv)
    return srv

@router.delete("/{service_id}")
def delete_service(service_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    srv = db.query(Service).filter(Service.id == service_id).first()
    if not srv:
        raise HTTPException(status_code=404, detail="Không tìm thấy dịch vụ nha khoa")

    # Check references in other tables
    has_appointments = db.query(Appointment).filter(Appointment.service_id == service_id).first()
    has_plans = db.query(TreatmentPlan).filter(TreatmentPlan.service_id == service_id).first()
    has_records = db.query(TreatmentRecord).filter(TreatmentRecord.service_id == service_id).first()
    has_invoices = db.query(InvoiceItem).filter(InvoiceItem.service_id == service_id).first()

    if has_appointments or has_plans or has_records or has_invoices:
        raise HTTPException(
            status_code=400,
            detail="⚠️ Dịch vụ đang được sử dụng trong lịch khám / hóa đơn / hồ sơ điều trị. Không thể xóa trực tiếp. Vui lòng đổi trạng thái dịch vụ sang 'Ngừng cung cấp'."
        )

    try:
        db.delete(srv)
        db.commit()
        return {"message": "Xóa dịch vụ thành công"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Không thể xóa dịch vụ này")
