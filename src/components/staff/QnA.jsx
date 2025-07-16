import React, { useEffect, useState } from "react";
import { qnaService } from "../../services/qnaService";
import "../../assets/css/components/staff/QnA.css";

const QnA = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await qnaService.getPendingQuestions();
        setQuestions(res.data);
      } catch (err) {
        console.error("Lỗi khi tải câu hỏi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [refresh]);

  const handleAnswer = async (id) => {
    try {
      const formData = { qnaId: id, answer };
      await qnaService.answerQuestion(formData);
      alert("Đã trả lời câu hỏi.");
      setAnswer("");
      setSelectedId(null);
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("Lỗi khi gửi câu trả lời:", err);
      alert("Không thể gửi câu trả lời.");
    }
  };

  if (loading) return <div className="qna-empty">Đang tải câu hỏi...</div>;

  return (
    <div className="qna-container">
      <h2 className="qna-title">Danh sách câu hỏi chưa được trả lời</h2>
      {questions.length === 0 ? (
        <div className="qna-empty">Không có câu hỏi nào đang chờ trả lời.</div>
      ) : (
        <ul className="qna-list">
          {questions.map((qna) => (
            <li key={qna.id} className="qna-item">
              <p className="qna-user"><strong>Người hỏi:</strong> {qna.username}</p>
              <p className="qna-question"><strong>Câu hỏi:</strong> {qna.question}</p>
              {selectedId === qna.id ? (
                <div className="mt-2">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="qna-textarea"
                    rows="3"
                    placeholder="Nhập câu trả lời..."
                  ></textarea>
                  <div className="qna-button-group">
                    <button
                      onClick={() => handleAnswer(qna.id)}
                      className="qna-button qna-submit-button"
                    >
                      Gửi
                    </button>
                    <button
                      onClick={() => {
                        setSelectedId(null);
                        setAnswer("");
                      }}
                      className="qna-button qna-cancel-button"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedId(qna.id)}
                  className="qna-button qna-answer-button"
                >
                  Trả lời
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QnA;