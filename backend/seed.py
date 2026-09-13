import os
import datetime
from sqlalchemy.orm import Session
from app.database.session import engine, SessionLocal, Base
from app.models.models import (
    User, Patient, Doctor, DentalChair, DoctorSchedule, Service,
    Appointment, TreatmentPlan, TreatmentRecord, TreatmentImage,
    Invoice, InvoiceItem, Payment, FollowUpAppointment
)
from app.auth.security import get_password_hash

def seed_data():
    print("Dropping existing tables and recreating database schema...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()

    try:
        print("Creating Users...")
        admin_user = User(
            username="admin",
            email="admin@luckydental.vn",
            hashed_password=get_password_hash("admin123"),
            role="ADMIN",
            full_name="Quản trị viên Hệ thống"
        )
        patient_user1 = User(
            username="patient01",
            email="patient01@gmail.com",
            hashed_password=get_password_hash("patient123"),
            role="PATIENT",
            full_name="Nguyễn Văn An"
        )
        patient_user2 = User(
            username="patient02",
            email="patient02@gmail.com",
            hashed_password=get_password_hash("patient123"),
            role="PATIENT",
            full_name="Trần Thị Bích"
        )
        patient_user3 = User(
            username="patient03",
            email="patient03@gmail.com",
            hashed_password=get_password_hash("patient123"),
            role="PATIENT",
            full_name="Lê Hoàng Cường"
        )
        db.add_all([admin_user, patient_user1, patient_user2, patient_user3])
        db.commit()
        for u in [admin_user, patient_user1, patient_user2, patient_user3]:
            db.refresh(u)

        print("Creating Patients...")
        p1 = Patient(
            user_id=patient_user1.id,
            patient_code="BN0001",
            full_name="Nguyễn Văn An",
            dob="1990-05-15",
            gender="Nam",
            phone="0901234567",
            email="patient01@gmail.com",
            address="123 Nguyễn Trãi, Quận 1, TP.HCM",
            registration_date="2026-01-10",
            notes="Bệnh nhân nhạy cảm với thuốc tê nhẹ",
            status="Hoạt động"
        )
        p2 = Patient(
            user_id=patient_user2.id,
            patient_code="BN0002",
            full_name="Trần Thị Bích",
            dob="1995-08-20",
            gender="Nữ",
            phone="0912345678",
            email="patient02@gmail.com",
            address="456 Lê Lợi, Quận 3, TP.HCM",
            registration_date="2026-02-14",
            notes="Quan tâm đến dịch vụ niềng răng thẩm mỹ",
            status="Hoạt động"
        )
        p3 = Patient(
            user_id=patient_user3.id,
            patient_code="BN0003",
            full_name="Lê Hoàng Cường",
            dob="1985-12-05",
            gender="Nam",
            phone="0923456789",
            email="patient03@gmail.com",
            address="789 Điện Biên Phủ, Bình Thạnh, TP.HCM",
            registration_date="2026-03-01",
            notes="Tiền sử tiểu đường nhẹ, chú ý khi phẫu thuật Implant",
            status="Hoạt động"
        )
        db.add_all([p1, p2, p3])
        db.commit()
        for p in [p1, p2, p3]: db.refresh(p)

        print("Creating Doctors...")
        doc1 = Doctor(
            doctor_code="BS001",
            full_name="BS. CKI Phạm Minh Đức",
            specialization="Răng Hàm Mặt & Chỉnh nha",
            phone="0988111222",
            email="minhduc@luckydental.vn",
            experience_years=12,
            status="Đang làm việc"
        )
        doc2 = Doctor(
            doctor_code="BS002",
            full_name="ThS.BS Nguyễn Mai Anh",
            specialization="Phục hình Răng Sứ & Thẩm mỹ",
            phone="0988333444",
            email="maianh@luckydental.vn",
            experience_years=8,
            status="Đang làm việc"
        )
        doc3 = Doctor(
            doctor_code="BS003",
            full_name="BS. CKI Hoàng Quốc Việt",
            specialization="Cấy ghép Implant & Phẫu thuật miệng",
            phone="0988555666",
            email="quocviet@luckydental.vn",
            experience_years=15,
            status="Đang làm việc"
        )
        doc4 = Doctor(
            doctor_code="BS004",
            full_name="BS. Đỗ Thanh Hương",
            specialization="Nha khoa Tổng quát & Điều trị Tủy",
            phone="0988777888",
            email="thanhhuong@luckydental.vn",
            experience_years=6,
            status="Đang làm việc"
        )
        db.add_all([doc1, doc2, doc3, doc4])
        db.commit()
        for d in [doc1, doc2, doc3, doc4]: db.refresh(d)

        print("Creating Dental Chairs...")
        c1 = DentalChair(chair_code="GC01", name="Ghế khám 01", room="Phòng 101 - Tổng quát", status="Trống")
        c2 = DentalChair(chair_code="GC02", name="Ghế khám 02", room="Phòng 101 - Tổng quát", status="Đang sử dụng")
        c3 = DentalChair(chair_code="GC03", name="Ghế phẫu thuật 03", room="Phòng 102 - Phẫu thuật Implant", status="Trống")
        c4 = DentalChair(chair_code="GC04", name="Ghế Chỉnh nha VIP", room="Phòng 201 - Thẩm mỹ VIP", status="Trống")
        db.add_all([c1, c2, c3, c4])
        db.commit()
        for c in [c1, c2, c3, c4]: db.refresh(c)

        print("Creating Dental Services...")
        s1 = Service(service_code="DV001", name="Khám tổng quát & Tư vấn", category="Khám và tư vấn", description="Khám lâm sàng, kiểm tra khớp cắn và chụp X-quang toàn cảnh miễn phí.", price=100000.0, status="Hoạt động")
        s2 = Service(service_code="DV002", name="Lấy cao răng & Đánh bóng", category="Khám và tư vấn", description="Làm sạch mảng bám vi khuẩn bằng máy siêu âm không đau, đánh bóng men răng.", price=300000.0, status="Hoạt động")
        s3 = Service(service_code="DV003", name="Trám răng thẩm mỹ Composite", category="Răng tổng quát", description="Khôi phục hình dáng răng sâu, sứt mẻ với vật liệu Composite trùng màu răng thật.", price=500000.0, status="Hoạt động")
        s4 = Service(service_code="DV004", name="Nhổ răng khôn mọc lệch", category="Phẫu thuật miệng", description="Nhổ răng khôn tiểu phẫu siêu âm Piezotome giảm sưng đau, nhanh lành thương.", price=2000000.0, status="Hoạt động")
        s5 = Service(service_code="DV005", name="Điều trị tủy răng (Nội nha)", category="Nội nha", description="Làm sạch tủy viêm nhiễm, trám bịt ống tủy bằng Gutta Percha chuẩn y khoa.", price=1500000.0, status="Hoạt động")
        s6 = Service(service_code="DV006", name="Tẩy trắng răng Laser Whitening", category="Nha khoa thẩm mỹ", description="Tẩy trắng siêu tốc bật 3-5 tông màu chỉ sau 60 phút không ê buốt.", price=2500000.0, status="Hoạt động")
        s7 = Service(service_code="DV007", name="Niềng răng mắc cài Kim loại", category="Chỉnh nha", description="Chỉnh nha toàn diện với mắc cài kim loại cao cấp nhập khẩu từ Mỹ.", price=25000000.0, status="Hoạt động")
        s8 = Service(service_code="DV008", name="Cấy ghép Implant Straumann", category="Cấy ghép Implant", description="Trồng răng giả độc lập bằng trụ Implant Thụy Sĩ cao cấp nhất thế giới.", price=25000000.0, status="Hoạt động")
        s9 = Service(service_code="DV009", name="Bọc răng sứ Zirconia", category="Phục hình Răng Sứ & Thẩm mỹ", description="Phục hình răng sứ toàn diện độ bền 20 năm, màu sắc trong tự nhiên.", price=4000000.0, status="Hoạt động")
        db.add_all([s1, s2, s3, s4, s5, s6, s7, s8, s9])
        db.commit()
        for s in [s1, s2, s3, s4, s5, s6, s7, s8, s9]: db.refresh(s)


        print("Creating Schedules...")
        today_dt = datetime.date.today()
        # Find Monday of current week
        monday_dt = today_dt - datetime.timedelta(days=today_dt.weekday())

        mon_str = monday_dt.strftime("%Y-%m-%d")
        tue_str = (monday_dt + datetime.timedelta(days=1)).strftime("%Y-%m-%d")
        wed_str = (monday_dt + datetime.timedelta(days=2)).strftime("%Y-%m-%d")
        thu_str = (monday_dt + datetime.timedelta(days=3)).strftime("%Y-%m-%d")
        fri_str = (monday_dt + datetime.timedelta(days=4)).strftime("%Y-%m-%d")
        sat_str = (monday_dt + datetime.timedelta(days=5)).strftime("%Y-%m-%d")
        sun_str = (monday_dt + datetime.timedelta(days=6)).strftime("%Y-%m-%d")

        today = today_dt.strftime("%Y-%m-%d")
        tomorrow = (today_dt + datetime.timedelta(days=1)).strftime("%Y-%m-%d")

        schedules_list = [
            DoctorSchedule(doctor_id=doc1.id, chair_id=c1.id, date=mon_str, start_time="08:00", end_time="12:00", shift="Sáng", status="Đã xếp", notes="Khám tổng quát & Chỉnh nha"),
            DoctorSchedule(doctor_id=doc2.id, chair_id=c4.id, date=mon_str, start_time="13:30", end_time="17:30", shift="Chiều", status="Đang làm việc", notes="Phục hình Răng Sứ VIP"),
            DoctorSchedule(doctor_id=doc3.id, chair_id=c3.id, date=tue_str, start_time="08:00", end_time="12:00", shift="Sáng", status="Đã xếp", notes="Phẫu thuật Implant"),
            DoctorSchedule(doctor_id=doc4.id, chair_id=c1.id, date=tue_str, start_time="13:00", end_time="17:00", shift="Chiều", status="Đã xếp", notes="Điều trị Tủy răng"),
            DoctorSchedule(doctor_id=doc1.id, chair_id=c1.id, date=wed_str, start_time="13:30", end_time="17:30", shift="Chiều", status="Đã xếp", notes="Tư vấn niềng răng"),
            DoctorSchedule(doctor_id=doc2.id, chair_id=c4.id, date=wed_str, start_time="08:00", end_time="12:00", shift="Sáng", status="Đã xếp", notes="Tẩy trắng Laser"),
            DoctorSchedule(doctor_id=doc3.id, chair_id=c3.id, date=thu_str, start_time="13:00", end_time="17:00", shift="Chiều", status="Đang làm việc", notes="Cấy ghép Implant Straumann"),
            DoctorSchedule(doctor_id=doc4.id, chair_id=c2.id, date=thu_str, start_time="08:00", end_time="11:30", shift="Sáng", status="Đã xếp", notes="Lấy cao răng & Trám răng"),
            DoctorSchedule(doctor_id=doc1.id, chair_id=c1.id, date=fri_str, start_time="08:00", end_time="12:00", shift="Sáng", status="Đã xếp", notes="Chỉnh nha định kỳ"),
            DoctorSchedule(doctor_id=doc3.id, chair_id=c3.id, date=fri_str, start_time="08:00", end_time="12:00", shift="Sáng", status="Nghỉ", notes="Nghỉ phép tham gia hội thảo"),
            DoctorSchedule(doctor_id=doc2.id, chair_id=c4.id, date=sat_str, start_time="08:30", end_time="12:00", shift="Sáng", status="Đã xếp", notes="Dịch vụ thẩm mỹ cuối tuần"),
            DoctorSchedule(doctor_id=doc4.id, chair_id=c2.id, date=sat_str, start_time="13:30", end_time="17:30", shift="Chiều", status="Đã xếp", notes="Nha khoa tổng quát"),
            DoctorSchedule(doctor_id=doc1.id, chair_id=c1.id, date=sun_str, start_time="08:00", end_time="12:00", shift="Sáng", status="Đã xếp", notes="Ca trực Chủ nhật")
        ]

        db.add_all(schedules_list)
        db.commit()


        print("Creating Appointments...")
        app1 = Appointment(
            appointment_code="LK0001",
            patient_id=p1.id,
            doctor_id=doc1.id,
            chair_id=c1.id,
            service_id=s2.id,
            date=today,
            time_slot="09:00",
            status="Đã khám",
            notes="Bệnh nhân đến đúng giờ, đã lấy cao răng sạch sẽ."
        )
        app2 = Appointment(
            appointment_code="LK0002",
            patient_id=p2.id,
            doctor_id=doc2.id,
            chair_id=c4.id,
            service_id=s7.id,
            date=today,
            time_slot="14:00",
            status="Đã xác nhận",
            notes="Khám tư vấn niềng răng mắc cài"
        )
        app3 = Appointment(
            appointment_code="LK0003",
            patient_id=p3.id,
            doctor_id=doc3.id,
            chair_id=c3.id,
            service_id=s8.id,
            date=tomorrow,
            time_slot="09:30",
            status="Chờ xác nhận",
            notes="Đặt hẹn cấy ghép Implant"
        )
        db.add_all([app1, app2, app3])
        db.commit()

        print("Creating Treatment Plans...")
        tp1 = TreatmentPlan(
            plan_code="LT0001",
            patient_id=p2.id,
            doctor_id=doc1.id,
            service_id=s7.id,
            plan_name="Liệu trình Niềng răng mắc cài Kim loại 24 tháng",
            start_date="2026-02-15",
            expected_end_date="2028-02-15",
            estimated_cost=25000000.0,
            progress_percent=25,
            status="Đang điều trị",
            notes="Giai đoạn dàn đều răng hàng trên"
        )
        tp2 = TreatmentPlan(
            plan_code="LT0002",
            patient_id=p3.id,
            doctor_id=doc3.id,
            service_id=s8.id,
            plan_name="Phục hình cấy ghép 1 răng Implant Straumann",
            start_date="2026-03-05",
            expected_end_date="2026-06-05",
            estimated_cost=25000000.0,
            progress_percent=50,
            status="Đang điều trị",
            notes="Đã hoàn thành đặt trụ Implant, đợi tích hợp xương"
        )
        db.add_all([tp1, tp2])
        db.commit()

        print("Creating Treatment Records...")
        tr1 = TreatmentRecord(
            patient_id=p1.id,
            doctor_id=doc1.id,
            service_id=s2.id,
            date=today,
            content="Thực hiện lấy cao răng bằng sóng siêu âm 2 hàm, lấy sạch mảng bám nướu răng và đánh bóng.",
            pre_condition="Mảng bám cao răng cấp độ 2 ở mặt trong răng cửa hàm dưới.",
            post_result="Sạch cao răng hoàn toàn, nướu hồng khỏe mạnh, không chảy máu.",
            notes="Khuyên bệnh nhân sử dụng chỉ nha khoa sau bữa ăn.",
            next_plan="Tái khám lấy cao răng định kỳ sau 6 tháng."
        )
        tr2 = TreatmentRecord(
            patient_id=p2.id,
            doctor_id=doc1.id,
            treatment_plan_id=tp1.id,
            service_id=s7.id,
            date="2026-02-15",
            content="Gắn khí cụ mắc cài kim loại hàm trên, đi dây cung 014 NiTi.",
            pre_condition="Răng khấp khểnh hàm trên độ 1, lệch đường giữa 1mm.",
            post_result="Mắc cài cố định vững chắc, bệnh nhân được dặn dò kỹ cách ăn uống.",
            notes="Thay thun và siết răng mỗi tháng 1 lần.",
            next_plan="Tái khám siết răng và gắn mắc cài hàm dưới vào tháng sau."
        )
        db.add_all([tr1, tr2])
        db.commit()
        db.refresh(tr1); db.refresh(tr2)

        print("Creating Treatment Images...")
        img1 = TreatmentImage(
            patient_id=p1.id,
            treatment_record_id=tr1.id,
            image_url="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&auto=format&fit=crop",
            title="Ảnh nướu răng trước khi lấy cao răng",
            stage="Trước điều trị"
        )
        img2 = TreatmentImage(
            patient_id=p1.id,
            treatment_record_id=tr1.id,
            image_url="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&auto=format&fit=crop",
            title="Kết quả răng miệng sạch cao răng sau điều trị",
            stage="Sau điều trị"
        )
        db.add_all([img1, img2])
        db.commit()

        print("Creating Invoices and Payments...")
        inv1 = Invoice(
            invoice_code="HD0001",
            patient_id=p1.id,
            date=today,
            subtotal=300000.0,
            discount=0.0,
            total_amount=300000.0,
            paid_amount=300000.0,
            remaining_amount=0.0,
            status="Đã thanh toán"
        )
        inv2 = Invoice(
            invoice_code="HD0002",
            patient_id=p2.id,
            date="2026-02-15",
            subtotal=25000000.0,
            discount=1000000.0,
            total_amount=24000000.0,
            paid_amount=10000000.0,
            remaining_amount=14000000.0,
            status="Đã thanh toán một phần"
        )
        db.add_all([inv1, inv2])
        db.commit()
        db.refresh(inv1); db.refresh(inv2)

        item1 = InvoiceItem(invoice_id=inv1.id, service_id=s2.id, service_name="Lấy cao răng & Đánh bóng", quantity=1, unit_price=300000.0, amount=300000.0)
        item2 = InvoiceItem(invoice_id=inv2.id, service_id=s7.id, service_name="Niềng răng mắc cài Kim loại", quantity=1, unit_price=25000000.0, amount=25000000.0)
        db.add_all([item1, item2])

        pay1 = Payment(payment_code="TT0001", invoice_id=inv1.id, patient_id=p1.id, amount=300000.0, payment_date=today, payment_method="Tiền mặt", notes="Thanh toán lấy cao răng")
        pay2 = Payment(payment_code="TT0002", invoice_id=inv2.id, patient_id=p2.id, amount=10000000.0, payment_date="2026-02-15", payment_method="Chuyển khoản", notes="Thanh toán đợt 1 niềng răng")
        db.add_all([pay1, pay2])
        db.commit()

        print("Creating Follow-up Appointments...")
        fu1 = FollowUpAppointment(
            patient_id=p2.id,
            doctor_id=doc1.id,
            date=(datetime.date.today() + datetime.timedelta(days=7)).strftime("%Y-%m-%d"),
            time="09:00",
            content="Tái khám kiểm tra lực siết mắc cài niềng răng",
            notes="Nhắc bệnh nhân mang theo sổ theo dõi",
            status="Tái khám sắp tới"
        )
        fu2 = FollowUpAppointment(
            patient_id=p3.id,
            doctor_id=doc3.id,
            date=today,
            time="10:30",
            content="Kiểm tra mức độ tích hợp xương trụ Implant",
            notes="Chụp lại phim X-quang màng xương",
            status="Tái khám hôm nay"
        )
        db.add_all([fu1, fu2])
        db.commit()

        print("Database seeded successfully!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
