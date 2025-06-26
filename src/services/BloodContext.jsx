// src/contexts/BloodContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { bloodService } from "../services/BloodService";

const BloodContext = createContext();

export const BloodProvider = ({ children }) => {
  const [bloodTypes, setBloodTypes] = useState([]);
  const [bloodInventories, setBloodInventories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBloodTypes = async () => {
    try {
      setLoading(true);
      const res = await bloodService.getAllBloodTypes();
      setBloodTypes(res.data.result || []);
    } catch (err) {
      console.error("Lỗi khi tải nhóm máu:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBloodInventories = async () => {
    try {
      setLoading(true);
      const res = await bloodService.getAllBloodInventories();
      setBloodInventories(res.data.result || []);
    } catch (err) {
      console.error("Lỗi khi tải kho máu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodTypes();
    fetchBloodInventories();
  }, []);

  return (
    <BloodContext.Provider
      value={{
        bloodTypes,
        bloodInventories,
        loading,
        fetchBloodTypes,
        fetchBloodInventories,
      }}
    >
      {children}
    </BloodContext.Provider>
  );
};

export const useBlood = () => useContext(BloodContext);
