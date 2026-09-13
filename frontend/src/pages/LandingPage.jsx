import React from 'react';
import { Link } from 'react-router-dom';
import { Smile, Calendar, ShieldCheck, Stethoscope, Sparkles, Phone, MapPin, Award, CheckCircle2, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const services = [
    { title: 'Lấy Cao Răng Siêu Âm', desc: 'Làm sạch mảng bám vi khuẩn bằng sóng siêu âm không đau, mang lại hơi thở thơm mát.', price: '300.000đ', icon: Sparkles },
    { title: 'Tẩy Trắng Răng Laser', desc: 'Bật từ 3-5 tông màu chỉ sau 60 phút công nghệ Laser Whitening độc quyền.', price: '2.500.000đ', icon: ShieldCheck },
    { title: 'Niềng Răng Thẩm Mỹ', desc: 'Chỉnh nha mắc cài kim loại & khay trong suốt giúp khuôn mặt cân đối, tự tin.', price: 'Từ 25.000.000đ', icon: Smile },
    { title: 'Cấy Ghép Implant Straumann', desc: 'Phục hình răng mất chuẩn y khoa Thụy Sĩ, độ bền trọn đời, ăn nhai chắc chắn.', price: 'Từ 25.000.000đ', icon: Stethoscope },
  ];

  const doctors = [
    { name: 'BS. CKI Phạm Minh Đức', title: 'Giám đốc Chuyên môn', exp: '12 năm kinh nghiệm', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop' },
    { name: 'ThS.BS Nguyễn Mai Anh', title: 'Chuyên gia Phục hình Sứ', exp: '8 năm kinh nghiệm', img: 'https://images.unsplash.com/photo-1594824813566-88855ce78347?w=400&auto=format&fit=crop' },
    { name: 'BS. CKI Hoàng Quốc Việt', title: 'Chuyên gia Cấy ghép Implant', exp: '15 năm kinh nghiệm', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-lg shadow-sky-600/30">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-sky-900">LUCKY DENTAL</span>
            <p className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">Nha Khoa Tích Hợp AI</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#about" className="hover:text-sky-600 transition-colors">Giới thiệu</a>
          <a href="#services" className="hover:text-sky-600 transition-colors">Dịch vụ</a>
          <a href="#doctors" className="hover:text-sky-600 transition-colors">Đội ngũ bác sĩ</a>
          <a href="#process" className="hover:text-sky-600 transition-colors">Quy trình khám</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-xl border border-sky-600 text-sky-700 hover:bg-sky-50 font-bold text-xs transition-all"
          >
            Đăng nhập Portal
          </Link>
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/30 transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Đặt Lịch Khám
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 font-bold text-xs mb-6">
            <Sparkles className="w-4 h-4 text-sky-600" />
            Phòng Khám Nha Khoa Thông Minh Hàng Đầu
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
            Nụ Cười Rạng Rỡ <br />
            <span className="text-sky-600">Tương Lai Tươi Sáng</span>
          </h1>
          <p className="text-slate-600 text-base leading-relaxed mb-8">
            Trải nghiệm dịch vụ chăm sóc răng miệng đẳng cấp 5 sao tại Lucky Dental. 
            Kết hợp trang thiết bị hiện đại, đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm 
            và trợ lý AI thông minh đồng hành cùng sức khỏe nụ cười của bạn.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/login"
              className="px-7 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-xl shadow-sky-600/30 transition-all flex items-center gap-2"
            >
              Đặt Lịch Khám Ngay <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#services"
              className="px-7 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all"
            >
              Xem Dịch Vụ
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="w-full h-96 md:h-[450px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop"
              alt="Lucky Dental Clinic"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-lg">15,000+</p>
              <p className="text-xs text-slate-500 font-medium">Bệnh nhân tin tưởng hài lòng</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Dịch Vụ Nha Khoa Nổi Bật</h2>
            <p className="text-slate-600 text-sm">Chúng tôi cung cấp giải pháp toàn diện chăm sóc và thẩm mỹ răng miệng cao cấp.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200/80 hover:border-sky-500/50 hover:shadow-xl transition-all group flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed mb-6">{item.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="font-extrabold text-sky-600 text-sm">{item.price}</span>
                    <Link to="/login" className="text-xs font-bold text-slate-700 group-hover:text-sky-600 flex items-center gap-1">
                      Chi tiết <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Doctors Team */}
      <section id="doctors" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Đội Ngũ Bác Sĩ Chuyên Khoa</h2>
          <p className="text-slate-600 text-sm">Tận tâm, tận lực và sở hữu nhiều năm kinh nghiệm lâm sàng xuất sắc.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {doctors.map((doc, idx) => (
            <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="h-64 overflow-hidden">
                <img src={doc.img} alt={doc.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-lg text-slate-900 mb-1">{doc.name}</h3>
                <p className="text-xs font-bold text-sky-600 mb-2">{doc.title}</p>
                <p className="text-xs text-slate-500">{doc.exp}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section id="process" className="py-20 bg-sky-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold mb-3">Quy Trình Khám Chuẩn Y Khoa</h2>
            <p className="text-sky-200 text-sm">4 bước đơn giản đảm bảo trải nghiệm an toàn và chuẩn xác nhất.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Đặt Lịch Trực Tuyến', desc: 'Chọn bác sĩ, dịch vụ và khung giờ tiện lợi trên website.' },
              { step: '02', title: 'Khám & Chụp Phim', desc: 'Khám lâm sàng và chụp phim X-quang 3D chuẩn đoán.' },
              { step: '03', title: 'Tư Vấn Liệu Trình', desc: 'Bác sĩ tư vấn phác đồ điều trị minh bạch chi phí.' },
              { step: '04', title: 'Điều Trị & Theo Dõi', desc: 'Thực hiện nhẹ nhàng và nhắc lịch tái khám bằng AI.' },
            ].map((p, i) => (
              <div key={i} className="bg-sky-800/60 p-6 rounded-2xl border border-sky-700/50 relative">
                <span className="text-3xl font-black text-sky-300 opacity-60 mb-4 block">{p.step}</span>
                <h4 className="font-bold text-base mb-2">{p.title}</h4>
                <p className="text-xs text-sky-100 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-6 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base mb-4">
              <Smile className="w-5 h-5 text-sky-400" />
              <span>LUCKY DENTAL</span>
            </div>
            <p className="leading-relaxed">Hệ thống Quản lý Nha khoa Tích hợp Trợ lý AI Thông minh. Mang đến dịch vụ y tế hiện đại và tận tâm.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3">Liên Hệ Phòng Khám</h4>
            <p className="flex items-center gap-2 mb-2"><MapPin className="w-4 h-4 text-sky-400" /> 123 Đường 3/2, Quận 10, TP. Hồ Chí Minh</p>
            <p className="flex items-center gap-2 mb-2"><Phone className="w-4 h-4 text-sky-400" /> Hotline: 1900-LUCKY-DENTAL (0901.234.567)</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3">Thời Gian Làm Việc</h4>
            <p className="mb-1">Thứ 2 - Thứ 7: 08:00 - 20:00</p>
            <p className="mb-1">Chủ Nhật: 08:00 - 17:00</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-900 text-center text-slate-500">
          © 2026 Lucky Dental Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
