import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Date, Time, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="PATIENT")  # ADMIN, PATIENT
    full_name = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    patient = relationship("Patient", back_populates="user", uselist=False)

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=True)
    patient_code = Column(String(20), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    dob = Column(String(20), nullable=True)
    gender = Column(String(10), nullable=True)  # Nam, Nữ, Khác
    phone = Column(String(20), nullable=False)
    email = Column(String(100), nullable=True)
    address = Column(String(255), nullable=True)
    registration_date = Column(String(20), nullable=False)
    notes = Column(Text, nullable=True)
    status = Column(String(20), default="Hoạt động")  # Hoạt động, Tạm dừng

    user = relationship("User", back_populates="patient")
    appointments = relationship("Appointment", back_populates="patient", cascade="all, delete-orphan")
    treatment_plans = relationship("TreatmentPlan", back_populates="patient", cascade="all, delete-orphan")
    treatment_records = relationship("TreatmentRecord", back_populates="patient", cascade="all, delete-orphan")
    treatment_images = relationship("TreatmentImage", back_populates="patient", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="patient", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="patient", cascade="all, delete-orphan")
    follow_ups = relationship("FollowUpAppointment", back_populates="patient", cascade="all, delete-orphan")

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    doctor_code = Column(String(20), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    specialization = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(100), nullable=True)
    experience_years = Column(Integer, default=0)
    status = Column(String(30), default="Đang làm việc")  # Đang làm việc, Nghỉ phép, Không hoạt động

    schedules = relationship("DoctorSchedule", back_populates="doctor", cascade="all, delete-orphan")
    appointments = relationship("Appointment", back_populates="doctor")
    treatment_plans = relationship("TreatmentPlan", back_populates="doctor")
    treatment_records = relationship("TreatmentRecord", back_populates="doctor")
    follow_ups = relationship("FollowUpAppointment", back_populates="doctor")

class DentalChair(Base):
    __tablename__ = "dental_chairs"

    id = Column(Integer, primary_key=True, index=True)
    chair_code = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    room = Column(String(50), nullable=False)
    status = Column(String(30), default="Trống")  # Trống, Đang sử dụng, Bảo trì

    appointments = relationship("Appointment", back_populates="chair")

class DoctorSchedule(Base):
    __tablename__ = "doctor_schedules"

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    chair_id = Column(Integer, ForeignKey("dental_chairs.id"), nullable=True)
    date = Column(String(20), nullable=False)  # YYYY-MM-DD
    start_time = Column(String(10), nullable=False)  # HH:MM
    end_time = Column(String(10), nullable=False)    # HH:MM
    shift = Column(String(20), nullable=False)       # Sáng, Chiều, Tối
    status = Column(String(30), default="Đã xếp")    # Đã xếp, Đang làm việc, Chưa xếp, Nghỉ, Bảo trì
    notes = Column(Text, nullable=True)

    doctor = relationship("Doctor", back_populates="schedules")
    chair = relationship("DentalChair")


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    service_code = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=True, default="Nha khoa tổng quát")
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    status = Column(String(20), default="Hoạt động")  # Hoạt động, Ngừng cung cấp

    appointments = relationship("Appointment", back_populates="service")
    treatment_plans = relationship("TreatmentPlan", back_populates="service")
    treatment_records = relationship("TreatmentRecord", back_populates="service")


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    appointment_code = Column(String(20), unique=True, index=True, nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True)
    chair_id = Column(Integer, ForeignKey("dental_chairs.id"), nullable=True)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    date = Column(String(20), nullable=False)      # YYYY-MM-DD
    time_slot = Column(String(20), nullable=False)  # HH:MM
    status = Column(String(30), default="Chờ xác nhận") # Chờ xác nhận, Đã xác nhận, Đã khám, Đã hủy, Không đến
    notes = Column(Text, nullable=True)
    cancel_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")
    chair = relationship("DentalChair", back_populates="appointments")
    service = relationship("Service", back_populates="appointments")

class TreatmentPlan(Base):
    __tablename__ = "treatment_plans"

    id = Column(Integer, primary_key=True, index=True)
    plan_code = Column(String(20), unique=True, index=True, nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=True)
    plan_name = Column(String(150), nullable=False)
    start_date = Column(String(20), nullable=False)
    expected_end_date = Column(String(20), nullable=True)
    estimated_cost = Column(Float, default=0.0)
    progress_percent = Column(Integer, default=0)
    status = Column(String(30), default="Đang điều trị") # Chưa bắt đầu, Đang điều trị, Hoàn thành, Tạm dừng
    notes = Column(Text, nullable=True)

    patient = relationship("Patient", back_populates="treatment_plans")
    doctor = relationship("Doctor", back_populates="treatment_plans")
    service = relationship("Service", back_populates="treatment_plans")
    records = relationship("TreatmentRecord", back_populates="treatment_plan", cascade="all, delete-orphan")

class TreatmentRecord(Base):
    __tablename__ = "treatment_records"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    treatment_plan_id = Column(Integer, ForeignKey("treatment_plans.id"), nullable=True)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=True)
    date = Column(String(20), nullable=False)
    content = Column(Text, nullable=False)
    pre_condition = Column(Text, nullable=True)
    post_result = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    next_plan = Column(Text, nullable=True)

    patient = relationship("Patient", back_populates="treatment_records")
    doctor = relationship("Doctor", back_populates="treatment_records")
    treatment_plan = relationship("TreatmentPlan", back_populates="records")
    service = relationship("Service", back_populates="treatment_records")
    images = relationship("TreatmentImage", back_populates="treatment_record", cascade="all, delete-orphan")

class TreatmentImage(Base):
    __tablename__ = "treatment_images"

    id = Column(Integer, primary_key=True, index=True)
    treatment_record_id = Column(Integer, ForeignKey("treatment_records.id"), nullable=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    image_url = Column(String(255), nullable=False)
    title = Column(String(100), nullable=True)
    stage = Column(String(30), default="Trong điều trị") # Trước điều trị, Trong điều trị, Sau điều trị
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

    patient = relationship("Patient", back_populates="treatment_images")
    treatment_record = relationship("TreatmentRecord", back_populates="images")

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_code = Column(String(20), unique=True, index=True, nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    date = Column(String(20), nullable=False)
    subtotal = Column(Float, default=0.0)
    discount = Column(Float, default=0.0)
    total_amount = Column(Float, default=0.0)
    paid_amount = Column(Float, default=0.0)
    remaining_amount = Column(Float, default=0.0)
    status = Column(String(30), default="Chưa thanh toán") # Chưa thanh toán, Đã thanh toán một phần, Đã thanh toán, Quá hạn

    patient = relationship("Patient", back_populates="invoices")
    items = relationship("InvoiceItem", back_populates="invoice", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="invoice", cascade="all, delete-orphan")

class InvoiceItem(Base):
    __tablename__ = "invoice_items"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=True)
    service_name = Column(String(100), nullable=False)
    quantity = Column(Integer, default=1)
    unit_price = Column(Float, nullable=False)
    amount = Column(Float, nullable=False)

    invoice = relationship("Invoice", back_populates="items")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    payment_code = Column(String(20), unique=True, index=True, nullable=False)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    amount = Column(Float, nullable=False)
    payment_date = Column(String(20), nullable=False)
    payment_method = Column(String(30), default="Tiền mặt") # Tiền mặt, Chuyển khoản, Khác
    notes = Column(Text, nullable=True)

    invoice = relationship("Invoice", back_populates="payments")
    patient = relationship("Patient", back_populates="payments")

class FollowUpAppointment(Base):
    __tablename__ = "follow_up_appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    date = Column(String(20), nullable=False)
    time = Column(String(10), nullable=False)
    content = Column(Text, nullable=False)
    notes = Column(Text, nullable=True)
    status = Column(String(30), default="Tái khám sắp tới") # Tái khám hôm nay, Tái khám sắp tới, Tái khám quá hạn, Đã khám

    patient = relationship("Patient", back_populates="follow_ups")
    doctor = relationship("Doctor", back_populates="follow_ups")
