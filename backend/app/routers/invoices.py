from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.models import Invoice, InvoiceItem, Patient, User
from app.schemas.schemas import InvoiceOut, InvoiceCreate
from app.auth.jwt import get_current_user, require_admin, check_patient_access

router = APIRouter(prefix="/api/invoices", tags=["Invoices"])

@router.get("", response_model=List[InvoiceOut])
def get_invoices(
    patient_id: Optional[int] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Invoice)

    if current_user.role == "PATIENT":
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if not patient:
            return []
        query = query.filter(Invoice.patient_id == patient.id)
    else:
        if patient_id:
            query = query.filter(Invoice.patient_id == patient_id)

    if status_filter:
        query = query.filter(Invoice.status == status_filter)

    return query.order_by(Invoice.id.desc()).all()

@router.get("/{invoice_id}", response_model=InvoiceOut)
def get_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    inv = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Không tìm thấy hóa đơn")
    check_patient_access(current_user, inv.patient_id, db)
    return inv

@router.post("", response_model=InvoiceOut)
def create_invoice(
    req: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    count = db.query(Invoice).count()
    invoice_code = f"HD{count + 1:04d}"

    subtotal = 0.0
    items_to_create = []
    for item in req.items:
        amt = item.quantity * item.unit_price
        subtotal += amt
        items_to_create.append({
            "service_id": item.service_id,
            "service_name": item.service_name,
            "quantity": item.quantity,
            "unit_price": item.unit_price,
            "amount": amt
        })

    discount = req.discount or 0.0
    total_amount = max(0.0, subtotal - discount)

    invoice = Invoice(
        invoice_code=invoice_code,
        patient_id=req.patient_id,
        date=req.date,
        subtotal=subtotal,
        discount=discount,
        total_amount=total_amount,
        paid_amount=0.0,
        remaining_amount=total_amount,
        status="Chưa thanh toán"
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    for item_data in items_to_create:
        inv_item = InvoiceItem(
            invoice_id=invoice.id,
            **item_data
        )
        db.add(inv_item)

    db.commit()
    db.refresh(invoice)
    return invoice
