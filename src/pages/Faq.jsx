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
  const [openQuestionId, setOpenQuestionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredQuestions = answeredQuestions.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="faq-page container">
      <h2 className="faq-title">Chúng tôi có thể giúp gì cho bạn?</h2>

     <div className="faq-search-box">
  <input
    type="text"
    placeholder="Tìm kiếm câu hỏi..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <button onClick={() => setSearchTerm(searchTerm.trim())}>Tìm kiếm</button>
</div>


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

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Đang tải...</p>
      ) : filteredQuestions.length === 0 ? (
        <p>Không tìm thấy câu hỏi nào phù hợp.</p>
      ) : (
        <div className="faq-grid">
          {filteredQuestions.map((item, index) => (
            <div key={item.id} className="faq-card" onClick={() => toggleAnswer(item.id)}>
              <h4>{index + 1}. {item.question}</h4>
              {openQuestionId === item.id && (
                <div className="faq-answer">
                  {(item.answer || 'Chưa có câu trả lời').split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                 
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Faq;
