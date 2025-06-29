import React, { useState, useEffect } from "react";
import { useDonor } from "../services/DonorContext";
import { useAuth } from "../services/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoongMap from "./GoongMap";
import "./DonorSearch.css";
import { donorService } from "../services/donorService";
import polyline from "polyline";
import { useNavigate } from "react-router-dom";

const DonorSearch = () => {
  const [searchType, setSearchType] = useState("");
  const { searchNearestDonors, donors, loading, error } = useDonor();
  const { user } = useAuth();
  const [address, setAddress] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [center, setCenter] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Vui lòng đăng nhập để tìm nhà tài trợ!");
      return;
    }
    if (!searchType) {
      toast.error("Vui lòng chọn loại tìm kiếm!");
      return;
    }
    const response = await searchNearestDonors({ address, bloodType, searchType });
    if (response.success) {
      toast.success("Tìm kiếm thành công!");
      try {
        const geocodeResponse = await donorService.getGeocode(address);
        setCenter({
          latitude: geocodeResponse.data.result.latitude,
          longitude: geocodeResponse.data.result.longitude,
        });
      } catch (error) {
        toast.error("Lỗi: Không thể lấy tọa độ địa chỉ");
      }
    } else {
      toast.error(`Lỗi: ${response.error}`);
    }
  };

  const handleShowRoute = async (donor) => {
    try {
      const origin = center;
      const destination = { latitude: donor.latitude, longitude: donor.longitude };
      const routeResponse = await donorService.getRoute(origin, destination);
      const steps = routeResponse.data.routes[0].legs[0].steps;

      let allCoordinates = [];
      steps.forEach(step => {
        const coords = polyline.decode(step.polyline.points);
        allCoordinates = allCoordinates.concat(coords);
      });

      const formatted = allCoordinates.map(([lat, lng]) => ({ lat, lng }));
      setSelectedRoute(formatted);
    } catch (error) {
      toast.error("Lỗi: Không thể lấy tuyến đường");
    }
  };

  return (
    <>
      <div className="donor-search-page container">
        <h2>Tìm Nhà Tài Trợ Máu Gần Nhất</h2>
        <form onSubmit={handleSubmit} className="search-form">
          <div>
            <label>Địa chỉ của bạn:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Nhập địa chỉ..."
              required
            />
          </div>
          <div>
            <label>Nhóm máu (tùy chọn):</label>
            <select value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
              <option value="">Tất cả</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div>
            <label>Loại tìm kiếm:</label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              required
            >
              <option value="">-- Chọn loại --</option>
              <option value="CHO">Người cho</option>
              <option value="NHAN">Người nhận</option>
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Đang tìm..." : "Tìm kiếm"}
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {donors.length > 0 ? (
          <div className="donor-list">
            <h3>Kết quả ({donors.length} {searchType === "CHO" ? "người nhận" : "người cho"}):</h3>
            {donors.map((donor) => (
              <div key={donor.id} className="donor-item">
                <p><strong>Tên:</strong> {donor.name}</p>
                <p><strong>Địa chỉ:</strong> {donor.address}</p>
                <p><strong>Nhóm máu:</strong> {donor.bloodType}</p>
                <p><strong>Số điện thoại:</strong> {donor.phone}</p>
                <p><strong>Khoảng cách:</strong> {donor.distance.toFixed(2)} km</p>
                <button onClick={() => handleShowRoute(donor)}>Xem tuyến đường</button>
              </div>
            ))}
          </div>
        ) : (
          <p>Chưa có {searchType === "CHO" ? "người nhận" : "người cho"} nào được tìm thấy.</p>
        )}
        {center && <GoongMap center={center} donors={donors} selectedRoute={selectedRoute} />}
        <ToastContainer />
      </div>

      <div>
        <button className="btn btn-danger" onClick={() => navigate("/form")}>
          Đăng ký Cho/Nhận máu
        </button>
      </div>
    </>
  );
};

export default DonorSearch;