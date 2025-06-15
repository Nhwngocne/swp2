import React, { useState } from 'react';
import '../assets/css/pages/Faq.css'; //
const faqList = [
  {
    question: 'Ai có thể tham gia hiến máu?',
    answer: `- Tất cả mọi người từ 18 - 60 tuổi, thực sự tình nguyện hiến máu của mình để cứu chữa người bệnh.
- Cân nặng ít nhất là 45kg đối với phụ nữ, nam giới. Lượng máu hiến mỗi lần không quá 9ml/kg cân nặng và không quá 500ml mỗi lần.
- Không bị nhiễm hoặc không có các hành vi lây nhiễm HIV và các bệnh lây nhiễm qua đường truyền máu khác.
- Thời gian giữa 2 lần hiến máu là 12 tuần đối với cả Nam và Nữ.
- Có giấy tờ tùy thân.`,
  },
  {
    question: 'Ai là người không nên hiến máu',
    answer: `- Người đã nhiễm hoặc đã thực hiện hành vi có nguy cơ nhiễm HIV, viêm gan B, C, và các virus lây qua đường truyền máu.
- Người có các bệnh mãn tính: tim mạch, huyết áp, hô hấp, dạ dày…`,
  },
  {
    question: 'Máu của tôi sẽ được làm những xét nghiệm gì?',
    answer: `- Tất cả các đơn vị máu đều được kiểm tra nhóm máu (hệ ABO, Rh), HIV, viêm gan B, viêm gan C, giang mai, sốt rét.
- Bạn sẽ được thông báo kết quả, được giữ kín và tư vấn (miễn phí) nếu phát hiện ra các bệnh nhiễm trùng nói trên.`,
  },   
     {
    question: 'Máu gồm những thành phần và chức năng gì?',
    answer: `Máu là một chất lỏng lưu thông trong các mạch máu của cơ thể, gồm nhiều thành phần, mỗi thành phần làm nhiệm vụ khác nhau:
            - Hồng cầu làm nhiệm vụ chính là vận chuyển oxy.
            - Bạch cầu làm nhiệm vụ bảo vệ cơ thể.
            - Tiểu cầu tham gia vào quá trình đông cầm máu.
            - Huyết tương: gồm nhiều thành phần khác nhau: kháng thể, các yếu tố đông máu, các chất dinh dưỡng...`,
  },
  

];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page container">
      <h2 className="faq-title">Lưu ý quan trọng</h2>
      {faqList.map((item, index) => (
        <div key={index} className="faq-item">
          <div className="faq-question" onClick={() => toggle(index)}>
            <span>{index + 1}. {item.question}</span>
            <span>{openIndex === index ? '▲' : '▼'}</span>
          </div>
          {openIndex === index && (
            <div className="faq-answer">
              {item.answer.split('\n').map((line, idx) => <p key={idx}>- {line}</p>)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Faq;