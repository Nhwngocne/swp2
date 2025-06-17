import React, { useState, useEffect } from 'react';

const BloodInventory = () => {
  const [inventory, setInventory] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [formData, setFormData] = useState({
    bloodType: '',
    quantity: '',
    expirationDate: '',
    donorId: '',
    notes: ''
  });
  const [transactionData, setTransactionData] = useState({
    bloodType: '',
    quantity: '',
    type: 'in',
    hospital: '',
    notes: ''
  });

  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      // Mock data
      const mockInventory = {
        'O+': { units: 45, expiringSoon: 5, lastUpdated: '2024-03-15' },
        'O-': { units: 12, expiringSoon: 2, lastUpdated: '2024-03-15' },
        'A+': { units: 38, expiringSoon: 3, lastUpdated: '2024-03-15' },
        'A-': { units: 8, expiringSoon: 1, lastUpdated: '2024-03-14' },
        'B+': { units: 22, expiringSoon: 2, lastUpdated: '2024-03-15' },
        'B-': { units: 6, expiringSoon: 0, lastUpdated: '2024-03-13' },
        'AB+': { units: 15, expiringSoon: 1, lastUpdated: '2024-03-15' },
        'AB-': { units: 4, expiringSoon: 0, lastUpdated: '2024-03-14' }
      };

      const mockTransactions = [
        {
          id: 1,
          bloodType: 'O+',
          quantity: 5,
          type: 'out',
          hospital: 'Bệnh viện Chợ Rẫy',
          date: '2024-03-15T14:30:00Z',
          staff: 'Nguyễn Văn A',
          notes: 'Cấp cứu tai nạn giao thông'
        },
        {
          id: 2,
          bloodType: 'A-',
          quantity: 3,
          type: 'in',
          donor: 'Trần Thị B',
          date: '2024-03-15T10:15:00Z',
          staff: 'Lê Văn C',
          notes: 'Hiến máu tình nguyện'
        },
        {
          id: 3,
          bloodType: 'O-',
          quantity: 2,
          type: 'out',
          hospital: 'Bệnh viện Đại học Y Dược',
          date: '2024-03-14T16:45:00Z',
          staff: 'Phạm Thị D',
          notes: 'Phẫu thuật tim'
        }
      ];

      setInventory(mockInventory);
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlood = async (e) => {
    e.preventDefault();
    try {
      const newTransaction = {
        id: Date.now(),
        bloodType: formData.bloodType,
        quantity: parseInt(formData.quantity),
        type: 'in',
        donor: formData.donorId,
        date: new Date().toISOString(),
        staff: 'Nhân viên', // thay vì user.name
        notes: formData.notes
      };

      setTransactions([newTransaction, ...transactions]);

      setInventory(prev => ({
        ...prev,
        [formData.bloodType]: {
          ...prev[formData.bloodType],
          units: (prev[formData.bloodType]?.units || 0) + parseInt(formData.quantity),
          lastUpdated: new Date().toISOString().split('T')[0]
        }
      }));

      alert('Thêm máu vào kho thành công!');
      resetAddForm();
    } catch (error) {
      console.error('Error adding blood:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleTransaction = async (e) => {
    e.preventDefault();
    try {
      const quantity = parseInt(transactionData.quantity);
      const bloodType = transactionData.bloodType;

      if (transactionData.type === 'out' && inventory[bloodType]?.units < quantity) {
        alert('Không đủ máu trong kho!');
        return;
      }

      const newTransaction = {
        id: Date.now(),
        bloodType: bloodType,
        quantity: quantity,
        type: transactionData.type,
        hospital: transactionData.hospital,
        date: new Date().toISOString(),
        staff: 'Nhân viên', // thay vì user.name
        notes: transactionData.notes
      };

      setTransactions([newTransaction, ...transactions]);

      const multiplier = transactionData.type === 'in' ? 1 : -1;
      setInventory(prev => ({
        ...prev,
        [bloodType]: {
          ...prev[bloodType],
          units: (prev[bloodType]?.units || 0) + (quantity * multiplier),
          lastUpdated: new Date().toISOString().split('T')[0]
        }
      }));

      alert('Giao dịch thành công!');
      resetTransactionForm();
    } catch (error) {
      console.error('Error processing transaction:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  // ... (giữ nguyên phần còn lại)
};

export default BloodInventory;
