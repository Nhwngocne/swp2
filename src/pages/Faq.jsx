import React, { useState, useEffect } from 'react';
import { useQnA } from '../services/QnAContext';
import { useAuth } from '../services/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/pages/Faq.css';

const Faq = () => {
  const { answeredQuestions, fetchAnsweredQuestions, createQuestion, loading, error } = useQnA();
  const { user, role } = useAuth();
  const [question, setQuestion] = useState('');
  const [openQuestionId, setOpenQuestionId] = useState(null); // ID câu hỏi đang mở

  useEffect(() => {
    fetchAnsweredQuestions();
  }, [fetchAnsweredQuestions]);

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
      fetchAnsweredQuestions();
    } else {
      toast.error(`Lỗi: ${response.error}`);
    }
  };

  const toggleAnswer = (id) => {
    setOpenQuestionId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="faq-page container">
      <h2 className="faq-title">Câu hỏi thường gặp</h2>

      {/* Form gửi câu hỏi */}
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
            <div
              className="faq-question"
              onClick={() => toggleAnswer(item.id)}
              style={{
                cursor: 'pointer',
                fontWeight: 'bold',
                padding: '10px',
                background: '#f2f2f2',
                borderRadius: '5px',
                marginBottom: '5px',
              }}
            >
              {index + 1}. {item.question}
            </div>
            {openQuestionId === item.id && (
              <div className="faq-answer" style={{ marginLeft: '15px', marginBottom: '10px' }}>
                {(item.answer || 'Chưa có câu trả lời')
                  .split('\n')
                  .map((line, i) => (
                    <p key={i} style={{ margin: 0 }}>{line}</p>
                  ))}
                <small>
                  Được hỏi bởi: {item.member?.name || 'ẩn'} | Trả lời bởi: {item.staff?.name}
                </small>
              </div>
            )}
          </div>
        ))
      )}

      <ToastContainer />
    </div>
  );
};

export default Faq;
