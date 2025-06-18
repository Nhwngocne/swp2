import React, { useState } from 'react';
import '../assets/css/pages/LookUp.css'; // Dùng lại hoặc tạo CSS riêng

const LookUp = () => {
    const [bloodType, setBloodType] = useState('');
    const [result, setResult] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const bloodCompatibility = {
        'A+': {
            canReceive: ['A+', 'A-', 'O+', 'O-'],
            canDonate: ['A+', 'AB+']
        },
        'A-': {
            canReceive: ['A-', 'O-'],
            canDonate: ['A+', 'A-', 'AB+', 'AB-']
        },
        'B+': {
            canReceive: ['B+', 'B-', 'O+', 'O-'],
            canDonate: ['B+', 'AB+']
        },
        'B-': {
            canReceive: ['B-', 'O-'],
            canDonate: ['B+', 'B-', 'AB+', 'AB-']
        },
        'AB+': {
            canReceive: ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'],
            canDonate: ['AB+']
        },
        'AB-': {
            canReceive: ['A-', 'B-', 'AB-', 'O-'],
            canDonate: ['AB+', 'AB-']
        },
        'O+': {
            canReceive: ['O+', 'O-'],
            canDonate: ['A+', 'B+', 'O+', 'AB+']
        },
        'O-': {
            canReceive: ['O-'],
            canDonate: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
        }
    };

    const handleSearch = () => {
        const formatted = bloodType.toUpperCase().trim();
        setIsSearching(true);

        setTimeout(() => {
            if (bloodCompatibility[formatted]) {
                setResult({
                    type: formatted,
                    ...bloodCompatibility[formatted]
                });
            } else {
                setResult(null);
            }
            setIsSearching(false);
        }, 400);
    };

    return (
        <div className="lookup-container">
            <div className="lookup-header">
                <h1>Tra cứu nhóm máu</h1>
                <p>Nhập nhóm máu để biết có thể <strong>truyền cho</strong> và <strong>nhận từ</strong> những nhóm nào.</p>
            </div>

            <div className="lookup-form">
                <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                >
                    <option value="">-- Chọn nhóm máu --</option>
                    <option value="O-">O-</option>
                    <option value="O+">O+</option>
                    <option value="A-">A-</option>
                    <option value="A+">A+</option>
                    <option value="B-">B-</option>
                    <option value="B+">B+</option>
                    <option value="AB-">AB-</option>
                    <option value="AB+">AB+</option>
                </select>
                <button onClick={handleSearch} disabled={!bloodType}>
                    Tra cứu
                </button>
            </div>


            <div className="lookup-results">
                {isSearching && <div className="loading">Đang tra cứu...</div>}

                {!isSearching && result && (
                    <div className="result-card">
                        <h2>Nhóm máu: <span className="highlight">{result.type}</span></h2>
                        <div className="blood-info">
                            <p><strong>Có thể nhận máu từ:</strong> {result.canReceive.join(', ')}</p>
                            <p><strong>Có thể truyền máu cho:</strong> {result.canDonate.join(', ')}</p>
                        </div>
                    </div>
                )}

                {!isSearching && result === null && bloodType.trim() !== '' && (
                    <div className="no-results">
                        <p>Không tìm thấy thông tin cho nhóm máu "<strong>{bloodType.toUpperCase().trim()}</strong>"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LookUp;
