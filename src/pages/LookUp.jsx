import React, { useState } from 'react';
import '../assets/css/pages/LookUp.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const LookUp = () => {
    const [componentId, setComponentId] = useState(0);
    const [bloodTypeId, setBloodTypeId] = useState(0);
    const [result, setResult] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (componentId === 0 && bloodTypeId === 0) return;

        setIsSearching(true);
        setResult(null);

        try {
            const res = await axios.get(`http://localhost:8080/swp391/lookup/${componentId}/${bloodTypeId}`);
            setResult(res.data.result);
        } catch (err) {
            console.error("Tra cứu thất bại:", err);
            alert("Không thể tra cứu dữ liệu.");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="lookup-container">
            <div className="header-section">
                <h1 className="header-title">Tra cứu tương thích máu</h1>
                <p className="header-description">
                    Chọn <strong>thành phần</strong> và <strong>nhóm máu</strong> để tra cứu.
                </p>
            </div>

            <div className="blood-type-section">
                <div className="search-form">
                    <select
                        value={componentId}
                        onChange={(e) => setComponentId(Number(e.target.value))}
                        className="blood-type-select"
                    >
                        <option value={0}>-- Thành phần máu --</option>
                        <option value={1}>Toàn phần</option>
                        <option value={2}>Hồng cầu</option>
                        <option value={3}>Huyết tương</option>
                        <option value={4}>Tiểu cầu</option>
                    </select>

                    <select
                        value={bloodTypeId}
                        onChange={(e) => setBloodTypeId(Number(e.target.value))}
                        className="blood-type-select"
                    >
                        <option value={0}>-- Nhóm máu --</option>
                        <option value={6}>O-</option>
                        <option value={7}>O+</option>
                        <option value={8}>A-</option>
                        <option value={9}>A+</option>
                        <option value={10}>B-</option>
                        <option value={11}>B+</option>
                        <option value={12}>AB-</option>
                        <option value={13}>AB+</option>
                    </select>

                    <button
                        onClick={handleSearch}
                        disabled={componentId === 0 && bloodTypeId === 0}
                        className={`search-button ${(componentId !== 0 || bloodTypeId !== 0) ? 'enabled' : 'disabled'}`}
                    >
                        {isSearching ? "Đang tra cứu..." : "Tra cứu"}
                    </button>
                </div>

                {/* Hiển thị kết quả */}
                {result && (
                    <div className="result-section">
                        <h3>Kết quả:</h3>
                        {result.componentName && (
                            <p><strong>Thành phần:</strong> {result.componentName}</p>
                        )}
                        {result.bloodTypeName && (
                            <p><strong>Nhóm máu:</strong> {result.bloodTypeName}</p>
                        )}
                        {result.description && (
                            <p><strong>Mô tả:</strong> {result.description}</p>
                        )}

                        {Array.isArray(result.canDonateTo) && (
                            <div className="donate-to-section">
                                <h4>Có thể truyền cho:</h4>
                                {result.canDonateTo.length > 0 ? (
                                    <ul>
                                        {result.canDonateTo.map((item) => (
                                            <li key={item.id}>
                                                <strong>{item.name}</strong> – Kháng nguyên: {item.antigens} | Kháng thể: {item.antibodies}
                                                <br />
                                                <em>{item.description}</em>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Không có dữ liệu.</p>
                                )}
                            </div>
                        )}

                        {Array.isArray(result.canReceiveFrom) && (
                            <div className="receive-from-section">
                                <h4>Có thể nhận từ:</h4>
                                {result.canReceiveFrom.length > 0 ? (
                                    <ul>
                                        {result.canReceiveFrom.map((item) => (
                                            <li key={item.id}>
                                                <strong>{item.name}</strong> – Kháng nguyên: {item.antigens} | Kháng thể: {item.antibodies}
                                                <br />
                                                <em>{item.description}</em>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Không có dữ liệu.</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div>
                <button className="btn btn-danger" onClick={() => navigate("/form")}>
                    Đăng ký Cho/Nhận máu
                </button>
            </div>
        </div>
    );
};

export default LookUp;
