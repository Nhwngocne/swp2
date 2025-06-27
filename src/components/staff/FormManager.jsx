import React, { useEffect, useState } from "react";
import { eventService } from "../../services/eventService";
import { bloodIntentService } from "../../services/bloodIntentService";
import { useEmergency } from "../../services/EmergencyContext";

import BloodFormList from "./FormList/BloodFormList";
import BloodIntentList from "./FormList/BloodIntentList";
import EmergencyList from "./FormList/EmergencyList";

const FormManager = () => {
    const [forms, setForms] = useState([]);
    const [intents, setIntents] = useState([]);
    const [visibleForms, setVisibleForms] = useState({
        bloodForms: false,
        intents: false,
        emergency: false
    });

    const { fetchEmergencyRequests } = useEmergency();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [formRes, intentRes] = await Promise.all([
                    eventService.getAllBloodDonationForms(),
                    bloodIntentService.getAllBloodIntents()
                ]);
                setForms(formRes?.data?.result || []);
                setIntents(intentRes?.data?.result || []);
                await fetchEmergencyRequests();
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchData();
    }, []);

    const toggleForm = (key) => {
        setVisibleForms((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="p-8 space-y-6">
            {/* --- Đơn đăng ký hiến máu --- */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <h2 className="text-xl font-semibold">Đơn Đăng Ký Hiến Máu</h2>
                {visibleForms.bloodForms ? (
                    <>
                        <BloodFormList forms={forms} />
                        <button
                            className="mt-4 text-red-500 underline"
                            onClick={() => toggleForm("bloodForms")}
                        >
                            Đóng
                        </button>
                    </>
                ) : (
                    <button
                        className="mt-4 text-blue-600 underline"
                        onClick={() => toggleForm("bloodForms")}
                    >
                        Xem tất cả
                    </button>
                )}
            </div>

            {/* --- Ý định hiến/nhận máu --- */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <h2 className="text-xl font-semibold">Ý Định Hiến/Nhận Máu</h2>
                {visibleForms.intents ? (
                    <>
                        <BloodIntentList intents={intents} />
                        <button
                            className="mt-4 text-red-500 underline"
                            onClick={() => toggleForm("intents")}
                        >
                            Đóng
                        </button>
                    </>
                ) : (
                    <button
                        className="mt-4 text-blue-600 underline"
                        onClick={() => toggleForm("intents")}
                    >
                        Xem tất cả
                    </button>
                )}
            </div>

            {/* --- Danh sách cấp cứu --- */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <h2 className="text-xl font-semibold">Danh Sách Cấp Cứu</h2>
                {visibleForms.emergency ? (
                    <>
                        <EmergencyList />
                        <button
                            className="mt-4 text-red-500 underline"
                            onClick={() => toggleForm("emergency")}
                        >
                            Đóng
                        </button>
                    </>
                ) : (
                    <button
                        className="mt-4 text-blue-600 underline"
                        onClick={() => toggleForm("emergency")}
                    >
                        Xem tất cả
                    </button>
                )}
            </div>
        </div>
    );
};

export default FormManager;
