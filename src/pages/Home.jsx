import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/css/pages/Home.css";
import imgMain from '../assets/img/home2.jpg';
import imgSub1 from '../assets/img/hom1.jpg';
import imgSub2 from '../assets/img/hien-mau-nhan-dao.webp';
import FeedbackList from "./FeedbackList";
import { useDonation } from "../services/DonationContext";
import {
  IdCard, Syringe, ShieldX, Weight, HeartPulse,
  Droplet, UserCheck, CalendarDays
} from "lucide-react";

const benefitSlides = [
  {
    title: "Được bồi dưỡng trực tiếp",
    content: [
      " Ăn nhẹ, nước uống tại chỗ: tương đương 30.000 đồng (1 chai trà xanh không độ, 01 hộp chocopie 66gram, 01 hộp bánh Goute 35,5gram).",
      " Hỗ trợ chi phí đi lại (bằng tiền mặt): 50.000 đồng.",
      " Nhận phần quà tặng giá trị tương đương: 100.000đ khi hiến máu 250ml, 150.000đ khi hiến máu 350ml, 180.000đ khi hiến máu 450ml."
    ]
  },
  {
    title: "Được cấp Giấy chứng nhận hiến máu tình nguyện",
    content: [
      " Giấy chứng nhận được trao cho người hiến máu sau mỗi lần hiến máu tình nguyện.",
      " Có giá trị để được truyền máu miễn phí bằng số lượng máu đã hiến, khi bản thân người hiến có nhu cầu sử dụng máu tại tất cả các cơ sở y tế công lập trên toàn quốc.",
      " Người hiến máu cần xuất trình Giấy chứng nhận để làm cơ sở cho các cơ sở y tế thực hiện việc truyền máu miễn phí.",
      " Cơ sở y tế có trách nhiệm ký, đóng dấu, xác nhận số lượng máu đã truyền miễn phí cho người hiến máu vào giấy chứng nhận."
    ]
  },
  {
    title: "Được tư vấn về sức khoẻ",
    content: [
      " Được giải thích về quy trình hiến máu và các tai biến có thể xảy ra trong và sau khi hiến máu.",
      " Được cung cấp thông tin về dấu hiệu, triệu chứng do nhiễm vi rút viêm gan, HIV và một số bệnh lây qua đường truyền máu, tình dục khác.",
      " Được xét nghiệm sàng lọc một số vi rút lây qua đường truyền máu, tình dục (HIV, Giang mai, viêm gan,...) sau khi hiến máu.",
      " Được tư vấn hướng dẫn cách chăm sóc sức khỏe, tư vấn về kết quả bất thường sau hiến máu.",
      " Được bảo mật về kết quả khám lâm sàng, kết quả xét nghiệm."
    ]
  }
];

const standardsList = [
  { icon: <IdCard color="#a73737" size={28} />, text: "Mang theo chứng minh nhân dân/hộ chiếu" },
  { icon: <Syringe color="#a73737" size={28} />, text: "Không nghiện ma túy, rượu bia và các chất kích thích" },
  { icon: <ShieldX color="#a73737" size={28} />, text: "Không mắc HIV, viêm gan B/C, các virus lây qua máu" },
  { icon: <Weight color="#a73737" size={28} />, text: "Cân nặng: Nam ≥ 45 kg, Nữ ≥ 45 kg" },
  { icon: null, text: <span className="center-title">Tiêu chuẩn tham gia hiến máu</span>, center: true },
  { icon: <HeartPulse color="#a73737" size={28} />, text: "Không mắc bệnh tim mạch, huyết áp, hô hấp…" },
  { icon: <Droplet color="#a73737" size={28} />, text: "Chỉ số huyết sắc tố (Hb) ≥120g/l (≥125g/l nếu hiến ≥350ml)" },
  { icon: <UserCheck color="#a73737" size={28} />, text: "Người khỏe mạnh, độ tuổi từ 18 đến 60" },
  { icon: <CalendarDays color="#a73737" size={28} />, text: "Thời gian giữa 2 lần hiến máu là 12 tuần trở lên" },
];

const Home = () => {
  const { topDonors, loading, error, fetchTopDonors } = useDonation();
  console.log("Home: Giá trị topDonors:", JSON.stringify(topDonors, null, 2));
  console.log("Home: loading:", loading, "error:", error);

  const handleFetchTopDonors = async () => {
    console.log("Home: Gọi lại fetchTopDonors");
    const result = await fetchTopDonors(10);
    console.log("Home: Kết quả fetchTopDonors:", JSON.stringify(result, null, 2));
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true
  };

  return (
    <div className="home-page">
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
              <Link to="/events" className="btn red">Xem Sự Kiện</Link>
              <Link to="/faq" className="btn white">Tìm Hiểu Thêm</Link>
            </div>
          </div>
          <div className="hero-image-group">
            <img src={imgMain} alt="..." className="hero-img main" />
            <img src={imgSub1} alt="..." className="hero-img sub1" />
            <img src={imgSub2} alt="..." className="hero-img sub2" />
          </div>
        </div>
      </section>

      <section className="benefit-modern-section">
        <div className="benefit-modern-container">
          <div className="benefit-image-wrapper">
            <div className="l-frame-bg"></div>
            <img src={imgSub2} alt="Hiến máu" className="benefit-modern-img" />
          </div>
          <div className="benefit-modern-list">
            <h2 className="section-title yellow">Quyền lợi của người hiến máu</h2>
            <Slider {...settings}>
              {benefitSlides.map((slide, index) => (
                <div key={index}>
                  <div className="benefit-title-box">
                    <span className="check-icon">✔</span>
                    <span className="benefit-title-text">{slide.title}</span>
                  </div>
                  {slide.content.map((item, idx) => (
                    <div key={idx} className="benefit-content-item">
                      <span className="content-check">✔</span> {item}
                    </div>
                  ))}
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      <section className="donation-standards">
        <div className="standards-grid-centered">
          {standardsList.map((item, idx) => (
            <div
              className={`standard-box ${item.center ? "center-title-box" : ""}`}
              key={idx}
            >
              {item.icon && <div className="icon-circle">{item.icon}</div>}
              <p className={item.center ? "center-title-text" : ""}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="top-donors-section">
        <div className="container">
          <h2 className="section-title yellow">Top Nhà Hảo Tâm</h2>
          {loading ? (
            <div className="loading">Đang tải...</div>
          ) : error ? (
            <div className="error">Lỗi: {error}</div>
          ) : topDonors.length === 0 ? (
            <p>Chưa có dữ liệu nhà hảo tâm</p>
          ) : (
            <ul>
              {topDonors.map((donor) => (
                <li key={donor.memberId}>
                  <p>
                    <strong>{donor.memberName}</strong><br />
                    Tổng lượng máu: {donor.totalVolume.toLocaleString()} ml<br />
                    Số lần hiến: {donor.donationCount}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <FeedbackList />
    </div>
  );
};

export default Home;