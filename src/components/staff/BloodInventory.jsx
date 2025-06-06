import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const BloodInventory = () => {
  const { user } = useAuth();
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
      // Mock data - replace with actual API call
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
        staff: user.name,
        notes: formData.notes
      };

      setTransactions([newTransaction, ...transactions]);
      
      // Update inventory
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
        staff: user.name,
        notes: transactionData.notes
      };

      setTransactions([newTransaction, ...transactions]);
      
      // Update inventory
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

  const resetAddForm = () => {
    setFormData({
      bloodType: '',
      quantity: '',
      expirationDate: '',
      donorId: '',
      notes: ''
    });
    setShowAddForm(false);
  };

  const resetTransactionForm = () => {
    setTransactionData({
      bloodType: '',
      quantity: '',
      type: 'in',
      hospital: '',
      notes: ''
    });
    setShowTransactionForm(false);
  };

  const getStockLevel = (units) => {
    if (units <= 5) return 'critical';
    if (units <= 15) return 'low';
    if (units <= 30) return 'medium';
    return 'good';
  };

  const getTotalUnits = () => {
    return Object.values(inventory).reduce((total, item) => total + item.units, 0);
  };

  const getExpiringSoon = () => {
    return Object.values(inventory).reduce((total, item) => total + item.expiringSoon, 0);
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu kho máu...</div>;
  }

  return (
    <div className="blood-inventory">
      <div className="page-header">
        <h1>Quản Lý Kho Máu</h1>
        <div className="header-actions">
          <button onClick={() => setShowAddForm(true)}>Thêm Máu</button>
          <button onClick={() => setShowTransactionForm(true)}>Giao Dịch</button>
        </div>
      </div>

      <div className="inventory-stats">
        <div className="stat-card">
          <h3>Tổng Đơn Vị</h3>
          <div className="stat-value">{getTotalUnits()}</div>
        </div>
        <div className="stat-card">
          <h3>Sắp Hết Hạn</h3>
          <div className="stat-value">{getExpiringSoon()}</div>
        </div>
        <div className="stat-card">
          <h3>Loại Máu</h3>
          <div className="stat-value">{bloodTypes.length}</div>
        </div>
      </div>

      <div className="inventory-grid">
        {bloodTypes.map(bloodType => {
          const data = inventory[bloodType] || { units: 0, expiringSoon: 0 };
          const stockLevel = getStockLevel(data.units);
          
          return (
            <div key={bloodType} className={`blood-card ${stockLevel}`}>
              <div className="blood-type">{bloodType}</div>
              <div className="blood-units">{data.units} đơn vị</div>
              <div className="blood-status">
                <span className={`status-indicator ${stockLevel}`}>
                  {stockLevel === 'critical' ? 'Rất ít' :
                   stockLevel === 'low' ? 'Ít' :
                   stockLevel === 'medium' ? 'Vừa đủ' : 'Đủ'}
                </span>
              </div>
              {data.expiringSoon > 0 && (
                <div className="expiring-warning">
                  {data.expiringSoon} đơn vị sắp hết hạn
                </div>
              )}
              <div className="last-updated">
                Cập nhật: {data.lastUpdated}
              </div>
            </div>
          );
        })}
      </div>

      <div className="recent-transactions">
        <h2>Giao Dịch Gần Đây</h2>
        <div className="transactions-list">
          {transactions.map(transaction => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-main">
                <div className="transaction-type">
                  <span className={`type-badge ${transaction.type}`}>
                    {transaction.type === 'in' ? 'Nhập' : 'Xuất'}
                  </span>
                  <span className="blood-type">{transaction.bloodType}</span>
                  <span className="quantity">{transaction.quantity} đơn vị</span>
                </div>
                <div className="transaction-details">
                  <div className="detail-line">
                    <strong>
                      {transaction.type === 'in' ? 'Người hiến:' : 'Bệnh viện:'}
                    </strong>
                    {transaction.donor || transaction.hospital}
                  </div>
                  <div className="detail-line">
                    <strong>Nhân viên:</strong> {transaction.staff}
                  </div>
                  <div className="detail-line">
                    <strong>Thời gian:</strong> {new Date(transaction.date).toLocaleString('vi-VN')}
                  </div>
                  {transaction.notes && (
                    <div className="detail-line">
                      <strong>Ghi chú:</strong> {transaction.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Blood Form Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Thêm Máu Vào Kho</h2>
              <button className="close-btn" onClick={resetAddForm}>×</button>
            </div>
            <form onSubmit={handleAddBlood} className="form">
              <div className="form-group">
                <label>Nhóm máu:</label>
                <select
                  value={formData.bloodType}
                  onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
                  required
                >
                  <option value="">Chọn nhóm máu</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Số lượng (đơn vị):</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Ngày hết hạn:</label>
                <input
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({...formData, expirationDate: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>ID người hiến:</label>
                <input
                  type="text"
                  value={formData.donorId}
                  onChange={(e) => setFormData({...formData, donorId: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Ghi chú:</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={resetAddForm}>Hủy</button>
                <button type="submit">Thêm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Giao Dịch Máu</h2>
              <button className="close-btn" onClick={resetTransactionForm}>×</button>
            </div>
            <form onSubmit={handleTransaction} className="form">
              <div className="form-group">
                <label>Loại giao dịch:</label>
                <select
                  value={transactionData.type}
                  onChange={(e) => setTransactionData({...transactionData, type: e.target.value})}
                >
                  <option value="in">Nhập kho</option>
                  <option value="out">Xuất kho</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nhóm máu:</label>
                <select
                  value={transactionData.bloodType}
                  onChange={(e) => setTransactionData({...transactionData, bloodType: e.target.value})}
                  required
                >
                  <option value="">Chọn nhóm máu</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>
                      {type} (Còn: {inventory[type]?.units || 0} đơn vị)
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Số lượng (đơn vị):</label>
                <input
                  type="number"
                  value={transactionData.quantity}
                  onChange={(e) => setTransactionData({...transactionData, quantity: e.target.value})}
                  min="1"
                  max={transactionData.type === 'out' ? inventory[transactionData.bloodType]?.units || 0 : undefined}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  {transactionData.type === 'in' ? 'Người hiến:' : 'Bệnh viện:'}
                </label>
                <input
                  type="text"
                  value={transactionData.hospital}
                  onChange={(e) => setTransactionData({...transactionData, hospital: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Ghi chú:</label>
                <textarea
                  value={transactionData.notes}
                  onChange={(e) => setTransactionData({...transactionData, notes: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={resetTransactionForm}>Hủy</button>
                <button type="submit">Xác nhận</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodInventory;