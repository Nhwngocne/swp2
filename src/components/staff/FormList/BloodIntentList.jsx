import React, { useEffect, useState } from "react";
import { bloodIntentService } from "../../../services/bloodIntentService.jsx";
import "../../../assets/css/components/staff/BloodIntentList.css";

const BloodIntentList = () => {
    const [intents, setIntents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("ALL");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [rejectId, setRejectId] = useState(null);

    const fetchIntents = async () => {
        try {
            setLoading(true);
            const response = await bloodIntentService.getAllBloodIntents();
            setIntents(response.data.result);
            setError(null);
        } catch (err) {
            console.error("Error fetching intents:", err);
            setError(err.response?.data?.message || "Unable to load intents.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIntents();
    }, []);

    const handleApprove = async (id) => {
        if (!window.confirm("Are you sure you want to approve this intent?")) return;
        try {
            await bloodIntentService.approveBloodIntentForm(id);
            alert("Intent approved successfully!");
            fetchIntents();
        } catch (err) {
            console.error("Error approving intent:", err);
            alert(err.response?.data?.message || "Failed to approve intent.");
        }
    };

    const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this intent?")) return;
    try {
        await bloodIntentService.deleteBloodIntent(id);
        alert("Intent deleted successfully!");
        fetchIntents(); // cập nhật lại danh sách sau khi xóa
    } catch (err) {
        console.error("Error deleting intent:", err);
        alert(err.response?.data?.message || "Failed to delete intent.");
    }
};

    const openRejectModal = (id) => {
        setRejectId(id);
        setRejectReason("");
        setShowRejectModal(true);
    };

    const submitReject = async () => {
        if (!rejectReason.trim()) {
            alert("Please provide a reason for rejection.");
            return;
        }
        try {
            await bloodIntentService.rejectBloodIntentForm(rejectId, rejectReason);
            alert("Intent rejected successfully!");
            setShowRejectModal(false);
            fetchIntents();
        } catch (err) {
            console.error("Error rejecting intent:", err);
            alert(err.response?.data?.message || "Failed to reject intent.");
        }
    };

    const filteredIntents = intents.filter((intent) => {
        if (filter === "ALL") return true;
        return intent.intentType === filter;
    });

    const getStatusLabel = (status) => {
        switch (status) {
case "PENDING": return "Chờ xử lý";
            case "ACCEPTED": return "Chấp nhận";
            case "REJECTED": return "Từ chối";
            default: return status;
        }
    };

    return (
        <>
            <div className="flex justify-center space-x-4 mb-4">
                <button
                    className={`px-4 py-2 rounded ${filter === "CHO" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setFilter("CHO")}
                >
                    Người cho
                </button>
                <button
                    className={`px-4 py-2 rounded ${filter === "NHAN" ? "bg-red-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setFilter("NHAN")}
                >
                    Người nhận
                </button>
                <button
                    className={`px-4 py-2 rounded ${filter === "ALL" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setFilter("ALL")}
                >
                    Tất cả
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500">Loading data...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : filteredIntents.length === 0 ? (
                <p className="text-gray-500">No intents found.</p>
            ) : (
                <table className="min-w-full divide-y divide-gray-200 text-center">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Phone</th>
                            <th className="px-4 py-2">Intent Type</th>
                            <th className="px-4 py-2">Blood Type</th>
                            <th className="px-4 py-2">From</th>
                            <th className="px-4 py-2">To</th>
                            <th className="px-4 py-2">Location</th>
                            <th className="px-4 py-2">Description</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredIntents.map((intent) => (
                            <tr key={intent.id}>
                                <td className="px-4 py-2">{intent.id}</td>
                                <td className="px-4 py-2">{intent.memberName || "N/A"}</td>
                                <td className="px-4 py-2">{intent.memberPhone || "N/A"}</td>
                                <td className="px-4 py-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${intent.intentType === "CHO"
? "bg-blue-100 text-blue-600"
                                            : "bg-red-100 text-red-600"
                                        }`}>
                                        {intent.intentType === "CHO" ? "CHO" : "NHAN"}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-red-500 font-medium">{intent.bloodType}</td>
                                <td className="px-4 py-2">{intent.availableFrom || "N/A"}</td>
                                <td className="px-4 py-2">{intent.availableTo || "N/A"}</td>
                                <td className="px-4 py-2">{intent.location || "N/A"}</td>
                                <td className="px-4 py-2">{intent.description || "N/A"}</td>
                                <td className="px-4 py-2 font-medium">
                                    {getStatusLabel(intent.status)}
                                </td>
                                <td className="px-4 py-2 space-x-2">
                                    {intent.status === "PENDING" ? (
                                        <>
                                            <button
                                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                                onClick={() => handleApprove(intent.id)}
                                            >
                                                Chấp nhận 
                                            </button>
                                            <button
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                onClick={() => openRejectModal(intent.id)}
                                            >
                                                Từ chối
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                            onClick={() => handleDelete(intent.id)}
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-lg font-semibold mb-4">Enter Rejection Reason</h2>
<textarea
                            className="w-full border border-gray-300 rounded p-2 mb-4"
                            rows="4"
                            placeholder="Enter reason..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => setShowRejectModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={submitReject}
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BloodIntentList;
