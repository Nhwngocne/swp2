import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/pages/Home.css"; // Đảm bảo file này chứa style cho hero section và các section sau
import imgMain from '../assets/img/home2.jpg';
import imgSub1 from '../assets/img/hom1.jpg';
import imgSub2 from '../assets/img/hien-mau-nhan-dao.webp';

const rightsList = [
  {
    img: "/assets/heart-in-hand.jpg",
    title: "Quyền lợi của người hiến máu",
    left: [
      "Được khám sức khỏe và tư vấn miễn phí.",
      "Được cấp Giấy chứng nhận hiến máu tình nguyện.",
      "Được phục vụ ăn nhẹ, bồi dưỡng bằng tiền mặt.",
      "Được cấp giấy chứng nhận để được nhận máu miễn phí (nếu cần).",
      "Được nhận quà tặng lưu niệm của chương trình."
    ],
    right: [
      "Tiền bồi dưỡng: 50.000-100.000 VNĐ tuỳ lượng máu.",
      "Ăn nhẹ sau khi hiến máu.",
      "Hỗ trợ viện phí theo quy định Nhà nước.",
      "Ưu tiên truyền máu khi cần thiết.",
      "Được tư vấn sức khoẻ định kỳ."
    ]
  }
];

const standardsList = [
  "Mang theo chứng minh nhân dân/căn cước công dân.",
  "Tuổi từ 18 đến 60, cân nặng nam >= 45kg, nữ >= 42kg.",
  "Không mắc các bệnh lây truyền qua đường máu.",
  "Không sử dụng chất kích thích, rượu bia trước ngày hiến.",
  "Nghỉ ngơi đầy đủ, không làm việc quá sức trước khi hiến.",
  "Không bị cảm sốt hoặc có triệu chứng bệnh.",
];

const importantNotes = [
  {
    q: "Ai có thể tham gia hiến máu?",
    a: "Người khỏe mạnh, đủ 18-60 tuổi, không mắc các bệnh truyền nhiễm."
  },
  {
    q: "Ai là người không nên hiến máu?",
    a: "Người đang điều trị bệnh, vừa phẫu thuật, hoặc vừa xăm hình trong 6 tháng."
  },
  {
    q: "Máu của tôi sẽ được làm những xét nghiệm gì?",
    a: "Kiểm tra các bệnh truyền nhiễm: HIV, Viêm gan B/C, giang mai, sốt rét, ... "
  }
];

const achievements = [
  { icon: "🩸", label: "Lượt hiến máu", value: 12450 },
  { icon: "👥", label: "Người hiến máu", value: 3567 },
  { icon: "🏥", label: "Đơn vị máu", value: 8920 },
  { icon: "❤️", label: "Mạng sống được cứu", value: 25380 }
];

const feedbackList = [
  {
    name: "Nguyễn Văn A",
    content: "Tôi đã hiến máu 5 lần và cảm thấy rất vui khi giúp được cộng đồng. Quy trình rất nhanh chóng, an toàn.",
  },
  {
    name: "Trần Thị B",
    content: "Cảm ơn chương trình đã tạo điều kiện để tôi được chia sẻ sự sống với những người cần máu.",
  },
  {
    name: "Lê Văn C",
    content: "Mỗi lần hiến máu là một lần tôi thấy ý nghĩa. Hẹn gặp lại ở chương trình năm sau!",
  },
];
const Home = () => {
  return (
    <div className="home-page">

      {/* Hero Section ĐẦU TRANG */}
<section className="hero-section-implant">
  <div className="container hero-layout">
    <div className="hero-content-left">
      <span className="hero-brand">BỆNH VIỆN</span>
      <h1>
        <span className="highlight">HIẾN MÁU VÌ CỘNG ĐỒNG </span><br />
        
      </h1>
      <div className="hero-description">
        Hiến máu không chỉ là một hành động nhân văn cao cả, mà còn là cầu nối yêu thương giữa những trái tim đang cần sự sống.<br /> 
        Mỗi giọt máu bạn trao đi hôm nay có thể đem lại hy vọng sống cho một người bệnh, một đứa trẻ, hoặc một người mẹ đang giành giật sự sống từng giây.<br />
        <b>Hãy cùng chúng tôi lan tỏa thông điệp nhân ái và xây dựng một cộng đồng khoẻ mạnh – nơi mà mỗi người đều có thể trở thành người hùng thầm lặng chỉ bằng một hành động đơn giản.</b>

      </div>
      <div className="hero-actions">
        <button className="btn red">Đặt Lịch Khám</button>
        <button className="btn white">Tìm Hiểu Thêm</button>
      </div>
    </div>

      <div className="hero-image-group">
        <img src={imgMain} alt="..." className="hero-img main" />
        <img src={imgSub1} alt="..." className="hero-img sub1" />
        <img src={imgSub2} alt="..." className="hero-img sub2" />
      </div>
  </div>
</section>

            {/* Quyền lợi của người hiến máu */}
      <section className="benefit-section">
        <div className="benefit-container">
          <div className="benefit-left">
            <img src={rightsList[0].img} alt="Quyền lợi" className="benefit-img" />
          </div>
          <div className="benefit-right">
            <h3 className="section-title yellow">{rightsList[0].title}</h3>
            <div className="benefit-content">
              <ul>
                {rightsList[0].left.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>
            <div className="benefit-extra">
              <ul>
                {rightsList[0].right.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tiêu chuẩn tham gia hiến máu */}
      <section className="standards-section blue-bg">
        <h3 className="section-title">Tiêu chuẩn tham gia ghi hiến máu</h3>
        <div className="standards-grid">
          {standardsList.map((item, idx) => (
            <div className="standard-card" key={idx}>
              <span className="standard-icon">✔️</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ / Lưu ý quan trọng */}
      <section className="faq-section">
        <h3 className="section-title">Lưu ý quan trọng</h3>
        <div className="faq-list">
          {importantNotes.map((note, idx) => (
            <details key={idx} className="faq-item">
              <summary>{note.q}</summary>
              <div className="faq-answer">{note.a}</div>
            </details>
          ))}
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <Link to="/faq" className="see-more">Xem thêm &gt;</Link>
          </div>
        </div>
      </section>

      {/* Thành tựu */}
      <section className="achievements-section">
        <h3 className="section-title">Thành tựu của chúng ta</h3>
        <div className="achievements-grid">
          {achievements.map((ach, idx) => (
            <div className="achievement-card" key={idx}>
              <span className="achievement-icon">{ach.icon}</span>
              <div className="achievement-value">{ach.value.toLocaleString()}</div>
              <div className="achievement-label">{ach.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feedback */}
      <section className="feedback-section">
        <h3 className="section-title">Feedback</h3>
        <div className="feedback-grid">
          {feedbackList.map((fb, idx) => (
            <div className="feedback-card" key={idx}>
              <div className="feedback-content">“{fb.content}”</div>
              <div className="feedback-user">- {fb.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
