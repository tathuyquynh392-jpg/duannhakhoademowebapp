import os
import requests
from typing import Dict, Any, List
from app.ai.prompts import SYSTEM_DENTAL_ASSISTANT_PROMPT, MEDICAL_DISCLAIMER

class AIService:
    def __init__(self):
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        self.openai_key = os.getenv("OPENAI_API_KEY")

    def chat(self, user_message: str, user_role: str = "PATIENT") -> Dict[str, Any]:
        """
        Main chat interface for AI Dental Assistant.
        """
        # If Gemini key is set, call Gemini API
        if self.gemini_key:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_key}"
                payload = {
                    "contents": [{
                        "parts": [{"text": f"{SYSTEM_DENTAL_ASSISTANT_PROMPT}\n\nNgười dùng hỏi: {user_message}"}]
                    }]
                }
                res = requests.post(url, json=payload, timeout=10)
                if res.status_code == 200:
                    data = res.json()
                    text = data['candidates'][0]['content']['parts'][0]['text']
                    return {"response": text, "disclaimer": MEDICAL_DISCLAIMER}
            except Exception as e:
                print(f"[AI Service] Gemini error: {e}")

        # Intelligent Fallback Engine for Dental Queries
        msg = user_message.lower()
        if "niềng răng" in msg:
            reply = "Niềng răng (Chỉnh nha) là phương pháp dịch chuyển răng về vị trí thẩm mỹ mong muốn bằng hệ thống mắc cài hoặc khay trong suốt. Quá trình niềng giúp cải thiện khớp cắn, thẩm mỹ khuôn mặt và giúp việc vệ sinh răng miệng dễ dàng hơn. Tại Lucky Dental, bác sĩ sẽ chụp phim 3D và lập phác đồ cá nhân hóa cho bạn."
        elif "lấy cao răng" in msg or "cạo vôi răng" in msg:
            reply = "Lấy cao răng bằng sóng siêu âm tại Lucky Dental diễn ra rất nhẹ nhàng, không gây đau hay tổn thương nướu. Thao tác chỉ mất khoảng 15 - 30 phút, giúp loại bỏ vi khuẩn, mảng bám gây hôi miệng và viêm nướu."
        elif "tủy" in msg or "đau răng" in msg:
            reply = "Điều trị tủy được thực hiện khi tủy răng bị viêm hoặc nhiễm trùng do sâu răng nặng. Bác sĩ sẽ làm sạch phần tủy hỏng và trám kín. Quá trình này được gây tê cục bộ nên bạn sẽ không cảm thấy đau đớn trong lúc làm."
        elif "implant" in msg or "trồng răng" in msg:
            reply = "Cấy ghép Implant là giải pháp phục hình răng đã mất tối ưu nhất hiện nay. Trụ Titanium được cấy trực tiếp vào xương hàm thay thế chân răng thật, sau đó gắn mão răng sứ lên trên. Răng Implant có độ bền cao, ăn nhai chắc chắn như răng thật."
        elif "tẩy trắng" in msg:
            reply = "Tẩy trắng răng công nghệ Laser tại Lucky Dental kết hợp thuốc tẩy trắng chính hãng giúp bật từ 2-4 tông màu chỉ sau 45-60 phút mà không làm mòn men răng."
        elif "đặt lịch" in msg or "lịch khám" in msg:
            reply = "Bạn có thể dễ dàng đặt lịch khám thông qua mục 'Đặt lịch khám' trên ứng dụng Lucky Dental, chọn dịch vụ, bác sĩ và khung giờ phù hợp với bạn nhé!"
        elif "giá" in msg or "chi phí" in msg:
            reply = "Chi phí điều trị tại Lucky Dental được niêm yết công khai và minh bạch. Bạn có thể tham khảo bảng giá trong mục 'Dịch vụ' hoặc liên hệ hotline để được báo giá chi tiết từng liệu trình."
        else:
            reply = f"Cảm ơn bạn đã liên hệ Lucky Dental. Về câu hỏi '{user_message}', AI Dental Assistant khuyên bạn nên sắp xếp lịch hẹn trực tiếp với bác sĩ chuyên khoa để được khám tổng quát và chụp phim tư vấn chính xác nhất."

        return {
            "response": reply,
            "disclaimer": MEDICAL_DISCLAIMER
        }

    def summarize_treatment(self, patient_name: str, treatment_history: List[str], doctor_notes: str = None) -> Dict[str, Any]:
        """
        Summarizes a patient's treatment progress into clear natural language.
        """
        history_str = "; ".join(treatment_history) if treatment_history else "Chưa có ghi nhận điều trị"
        notes_str = f" Ghi chú bác sĩ: {doctor_notes}" if doctor_notes else ""
        
        summary = f"Tóm tắt quá trình điều trị của bệnh nhân {patient_name}:\n" \
                  f"Bệnh nhân đã thực hiện các hạng mục: {history_str}.{notes_str}\n" \
                  f"Đánh giá chung: Tiến trình điều trị diễn ra ổn định, kết quả phục hồi tốt. Bệnh nhân cần tiếp tục tuân thủ hướng dẫn vệ sinh răng miệng và tái khám đúng hẹn."
        return {"response": summary}

    def generate_reminder(self, patient_name: str, date: str, time: str, content: str) -> Dict[str, Any]:
        """
        Generates a friendly SMS/Zalo reminder message.
        """
        reminder = f"Chào {patient_name},\n" \
                   f"Phòng khám Lucky Dental xin nhắc bạn có lịch hẹn tái khám ({content}) vào lúc {time} ngày {date}.\n" \
                   f"Vui lòng sắp xếp thời gian đến đúng hẹn. Nếu cần hỗ trợ đổi lịch, hãy gọi 1900-LUCKY-DENTAL.\n" \
                   f"Trân trọng!"
        return {"response": reminder}

    def explain_service(self, service_name: str, user_question: str = None) -> Dict[str, Any]:
        """
        Explains a specific dental service in simple, friendly terms.
        """
        prompt = f"Giải thích dịch vụ {service_name}"
        if user_question:
            prompt += f": {user_question}"
        res = self.chat(prompt)
        return res

ai_service = AIService()
