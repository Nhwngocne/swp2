import React, { useState, useEffect } from 'react';
import { useQnA } from '../services/QnAContext';
import { useAuth } from '../services/AuthContext'; // Giả sử bạn có AuthContext để kiểm tra vai trò người dùng
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/pages/Faq.css';

const Faq = () => {
  const { answeredQuestions, fetchAnsweredQuestions, createQuestion, loading, error } = useQnA();
  const { user,role } = useAuth(); // Lấy thông tin người dùng để kiểm tra vai trò
  const [question, setQuestion] = useState(''); // State cho form gửi câu hỏi

  // Gọi API để lấy danh sách câu hỏi đã trả lời
  useEffect(() => {
    fetchAnsweredQuestions();
  }, [fetchAnsweredQuestions]);

  // Xử lý gửi câu hỏi
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || role !== 'MEMBER') {
      toast.error('Vui lòng đăng nhập với vai trò MEMBER để gửi câu hỏi!');
      return;
    }
    const response = await createQuestion({ question });
    if (response.success) {
      toast.success('Câu hỏi đã được gửi!');
      setQuestion('');
      fetchAnsweredQuestions(); // Làm mới danh sách câu hỏi
    } else {
      toast.error(`Lỗi: ${response.error}`);
    }
  };

  return (
    <div className="faq-page container">
      <h2 className="faq-title">Câu hỏi thường gặp</h2>

      {/* Form gửi câu hỏi (chỉ hiển thị cho MEMBER) */}
      {user && role === 'MEMBER' && (
        <div className="ask-question-form">
          <h3>Gửi câu hỏi của bạn</h3>
          <form onSubmit={handleSubmit}>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              required
              rows="4"
              style={{ width: '100%', marginBottom: '10px' }}
            />
            <button type="submit">Gửi câu hỏi</button>
          </form>
        </div>
      )}

      {/* Hiển thị lỗi nếu có */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Danh sách câu hỏi đã trả lời */}
      {loading ? (
        <p>Đang tải...</p>
      ) : answeredQuestions.length === 0 ? (
        <p>Chưa có câu hỏi nào được trả lời.</p>
      ) : (
        answeredQuestions.map((item, index) => (
          <div key={item.id} className="faq-item">
            <div className="faq-question">
              <span>
                {index + 1}. {item.question}
              </span>
            </div>
            <div className="faq-answer">
              <p>{item.answer || 'Chưa có câu trả lời'}</p>
              <small>
                Được hỏi bởi: {item.member?.name||"ẩn"} | Trả lời bởi:{' '}
                {item.staff?.name}
              </small>
            </div>
          </div>
        ))
      )}

      {/* Component thông báo */}
      <ToastContainer />
    </div>
  );
};

export default Faq;