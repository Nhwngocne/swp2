import React, { useState } from 'react';
import '../assets/css/pages/LookUp.css';
import Form from '../components/member/Form';
import { useNavigate } from "react-router-dom";


const LookUp = () => {
    const [bloodType, setBloodType] = useState('');
    const [result, setResult] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();

    const [origin, setOrigin] = useState('');
    const [selectedDestination, setSelectedDestination] = useState('');
    const [distanceResults, setDistanceResults] = useState([]);
    const [isCalculating, setIsCalculating] = useState(false);

    // Danh sách các địa điểm đã đánh dấu sẵn
    const predefinedLocations = [
        { id: 1, name: 'Bệnh viện Chợ Rẫy', address: '201B Nguyễn Chí Thanh, Quận 5, TP.HCM', type: 'hospital' },
        { id: 2, name: 'Bệnh viện Bình Dân', address: '371 Điện Biên Phủ, Quận 3, TP.HCM', type: 'hospital' },
        { id: 3, name: 'Viện Huyết học Truyền máu TW', address: '125 Yên Thế, Hai Bà Trưng, Hà Nội', type: 'blood_bank' },
        { id: 4, name: 'Trung tâm Truyền máu TP.HCM', address: '118 Hồng Bàng, Quận 5, TP.HCM', type: 'blood_bank' },
        { id: 5, name: 'Bệnh viện Bach Mai', address: '78 Đường Giải Phóng, Đống Đa, Hà Nội', type: 'hospital' },
        { id: 6, name: 'Bệnh viện Việt Đức', address: '40-42 Tràng Thi, Hoàn Kiếm, Hà Nội', type: 'hospital' }
    ];

    const bloodCompatibility = {
        'A+': { canReceive: ['A+', 'A-', 'O+', 'O-'], canDonate: ['A+', 'AB+'] },
        'A-': { canReceive: ['A-', 'O-'], canDonate: ['A+', 'A-', 'AB+', 'AB-'] },
        'B+': { canReceive: ['B+', 'B-', 'O+', 'O-'], canDonate: ['B+', 'AB+'] },
        'B-': { canReceive: ['B-', 'O-'], canDonate: ['B+', 'B-', 'AB+', 'AB-'] },
        'AB+': { canReceive: ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'], canDonate: ['AB+'] },
        'AB-': { canReceive: ['A-', 'B-', 'AB-', 'O-'], canDonate: ['AB+', 'AB-'] },
        'O+': { canReceive: ['O+', 'O-'], canDonate: ['A+', 'B+', 'O+', 'AB+'] },
        'O-': { canReceive: ['O-'], canDonate: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    };

    const handleSearch = () => {
        const formatted = bloodType.toUpperCase().trim();
        setIsSearching(true);
        setResult(null);

        setTimeout(() => {
            if (bloodCompatibility[formatted]) {
                setResult({ type: formatted, ...bloodCompatibility[formatted] });
            } else {
                setResult(null);
            }
            setIsSearching(false);
        }, 400);
    };

    const handleDistanceSearch = async () => {
        if (!origin) return;

        setIsCalculating(true);
        setDistanceResults([]);

        // Simulate distance calculation for all predefined locations
        setTimeout(() => {
            const results = predefinedLocations.map(location => ({
                ...location,
                distance: `${Math.floor(Math.random() * 50) + 5} km`,
                duration: `${Math.floor(Math.random() * 60) + 15} phút`,
                estimatedCost: `${Math.floor(Math.random() * 200) + 50},000 VNĐ`
            })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

            setDistanceResults(results);
            setIsCalculating(false);
        }, 1500);
    };

    const handleCalculateToSpecific = (destination) => {
        if (!origin) return;

        // Simulate calculation to specific location
        const result = {
            ...destination,
            distance: `${Math.floor(Math.random() * 50) + 5} km`,
            duration: `${Math.floor(Math.random() * 60) + 15} phút`,
            estimatedCost: `${Math.floor(Math.random() * 200) + 50},000 VNĐ`
        };

        setDistanceResults([result]);
    };

    return (
        <>
            <div className="lookup-container">
                <div className="header-section">
                    <h1 className="header-title">Tra cứu nhóm máu</h1>
                    <p className="header-description">
                        Nhập nhóm máu để biết có thể <strong>truyền cho</strong> và <strong>nhận từ</strong> những nhóm nào.
                    </p>
                </div>

                <div className="blood-type-section">
                    <div className="search-form">
                        <select
                            value={bloodType}
                            onChange={(e) => setBloodType(e.target.value)}
                            className="blood-type-select"
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
                        <button
                            onClick={handleSearch}
                            disabled={!bloodType}
                            className={`search-button ${bloodType ? 'enabled' : 'disabled'}`}
                        >
                            Tra cứu
                        </button>

                        {isSearching && (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                Đang tra cứu...
                            </div>
                        )}

                        {!isSearching && result && (
                            <div className="result-container">
                                <h2 className="result-title">
                                    Nhóm máu: <span className="blood-type-badge">{result.type}</span>
                                </h2>
                                <div className="result-content">
                                    <p className="result-item">
                                        <strong>Có thể nhận máu từ:</strong>
                                        <span className="blood-list-badge">
                                            {result.canReceive.join(', ')}
                                        </span>
                                    </p>
                                    <p className="result-item">
                                        <strong>Có thể truyền máu cho:</strong>
                                        <span className="blood-list-badge">
                                            {result.canDonate.join(', ')}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {!isSearching && result === null && bloodType.trim() !== '' && (
                            <div className="error-container">
                                <p className="error-message">
                                    Không tìm thấy thông tin cho nhóm máu "<strong>{bloodType.toUpperCase().trim()}</strong>"
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div >
                <button
                    className="btn btn-danger"
                    onClick={() => navigate("/form")}
                >
                    Đăng ký Cho/Nhận máu
                </button>
            </div>
        </>
    );
};

export default LookUp;