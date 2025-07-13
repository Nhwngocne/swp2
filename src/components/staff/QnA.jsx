import React, { useEffect, useState } from "react";
import { qnaService } from "../../services/qnaService";
 import "../../assets/css/components/staff/QnA.css"; // ✅ thêm CSS nếu cần
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
      const formData = { qnaId: id, answer }; // ✅ đúng với backend

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

  if (loading) return <div>Đang tải câu hỏi...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Danh sách câu hỏi chưa được trả lời</h2>
      {questions.length === 0 ? (
        <div>Không có câu hỏi nào đang chờ trả lời.</div>
      ) : (
        <ul className="space-y-4">
          {questions.map((qna) => (
            <li key={qna.id} className="border p-4 rounded shadow">
              <p><strong>Người hỏi:</strong> {qna.username}</p>
              <p><strong>Câu hỏi:</strong> {qna.question}</p>
              {selectedId === qna.id ? (
                <div className="mt-2">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full border p-2 rounded"
                    rows="3"
                    placeholder="Nhập câu trả lời..."
                  ></textarea>
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => handleAnswer(qna.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Gửi
                    </button>
                    <button
                      onClick={() => {
                        setSelectedId(null);
                        setAnswer("");
                      }}
                      className="bg-gray-300 px-4 py-2 rounded"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedId(qna.id)}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
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
