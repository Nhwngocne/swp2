import React, { useState, useEffect } from 'react';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Hệ thống Hiến máu',
      siteDescription: 'Nền tảng quản lý hiến máu tình nguyện',
      contactEmail: 'admin@hienmaau.vn',
      contactPhone: '0123456789',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'vi'
    },
    donation: {
      minAge: 18,
      maxAge: 60,
      minWeight: 45,
      donationInterval: 90, // days
      bloodExpiryDays: 35,
      emergencyThreshold: 10, // units
      lowStockThreshold: 20 // units
    },
    notification: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      reminderDays: [7, 3, 1],
      emergencyAlert: true,
      campaignNotifications: true
    },
    security: {
      sessionTimeout: 30, // minutes
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireSpecialChars: true,
      twoFactorAuth: false,
      ipWhitelist: []
    },
    maintenance: {
      maintenanceMode: false,
      maintenanceMessage: 'Hệ thống đang bảo trì, vui lòng quay lại sau.',
      backupEnabled: true,
      backupFrequency: 'daily',
      logRetentionDays: 30
    }
  });

  const [tempSettings, setTempSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(JSON.stringify(settings) !== JSON.stringify(tempSettings));
  }, [settings, tempSettings]);

  const handleSave = () => {
    setSettings(tempSettings);
    setHasChanges(false);
    alert('Cài đặt đã được lưu thành công!');
  };

  const handleReset = () => {
    setTempSettings(settings);
    setHasChanges(false);
  };

  const updateSetting = (tab, key, value) => {
    setTempSettings({
      ...tempSettings,
      [tab]: {
        ...tempSettings[tab],
        [key]: value
      }
    });
  };

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <h3>Cài đặt chung</h3>
      
      <div className="form-group">
        <label>Tên website:</label>
        <input
          type="text"
          value={tempSettings.general.siteName}
          onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Mô tả website:</label>
        <textarea
          value={tempSettings.general.siteDescription}
          onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Email liên hệ:</label>
          <input
            type="email"
            value={tempSettings.general.contactEmail}
            onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Số điện thoại:</label>
          <input
            type="tel"
            value={tempSettings.general.contactPhone}
            onChange={(e) => updateSetting('general', 'contactPhone', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Địa chỉ:</label>
        <input
          type="text"
          value={tempSettings.general.address}
          onChange={(e) => updateSetting('general', 'address', e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Múi giờ:</label>
          <select
            value={tempSettings.general.timezone}
            onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
          >
            <option value="Asia/Ho_Chi_Minh">Việt Nam (UTC+7)</option>
            <option value="Asia/Bangkok">Bangkok (UTC+7)</option>
            <option value="Asia/Singapore">Singapore (UTC+8)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Ngôn ngữ:</label>
          <select
            value={tempSettings.general.language}
            onChange={(e) => updateSetting('general', 'language', e.target.value)}
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderDonationSettings = () => (
    <div className="settings-section">
      <h3>Cài đặt hiến máu</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label>Tuổi tối thiểu:</label>
          <input
            type="number"
            value={tempSettings.donation.minAge}
            onChange={(e) => updateSetting('donation', 'minAge', parseInt(e.target.value))}
            min="16"
            max="25"
          />
        </div>
        
        <div className="form-group">
          <label>Tuổi tối đa:</label>
          <input
            type="number"
            value={tempSettings.donation.maxAge}
            onChange={(e) => updateSetting('donation', 'maxAge', parseInt(e.target.value))}
            min="50"
            max="70"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Cân nặng tối thiểu (kg):</label>
        <input
          type="number"
          value={tempSettings.donation.minWeight}
          onChange={(e) => updateSetting('donation', 'minWeight', parseInt(e.target.value))}
          min="40"
          max="50"
        />
      </div>

      <div className="form-group">
        <label>Khoảng cách giữa các lần hiến (ngày):</label>
        <input
          type="number"
          value={tempSettings.donation.donationInterval}
          onChange={(e) => updateSetting('donation', 'donationInterval', parseInt(e.target.value))}
          min="60"
          max="120"
        />
      </div>

      <div className="form-group">
        <label>Thời hạn sử dụng máu (ngày):</label>
        <input
          type="number"
          value={tempSettings.donation.bloodExpiryDays}
          onChange={(e) => updateSetting('donation', 'bloodExpiryDays', parseInt(e.target.value))}
          min="30"
          max="42"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Ngưỡng cảnh báo khẩn cấp (đơn vị):</label>
          <input
            type="number"
            value={tempSettings.donation.emergencyThreshold}
            onChange={(e) => updateSetting('donation', 'emergencyThreshold', parseInt(e.target.value))}
            min="5"
            max="20"
          />
        </div>
        
        <div className="form-group">
          <label>Ngưỡng cảnh báo thiếu hàng (đơn vị):</label>
          <input
            type="number"
            value={tempSettings.donation.lowStockThreshold}
            onChange={(e) => updateSetting('donation', 'lowStockThreshold', parseInt(e.target.value))}
            min="10"
            max="30"
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <h3>Cài đặt thông báo</h3>
      
      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={tempSettings.notification.emailEnabled}
            onChange={(e) => updateSetting('notification', 'emailEnabled', e.target.checked)}
          />
          Bật thông báo email
        </label>
      </div>

      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={tempSettings.notification.smsEnabled}
            onChange={(e) => updateSetting('notification', 'smsEnabled', e.target.checked)}
          />
          Bật thông báo SMS
        </label>
      </div>

      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={tempSettings.notification.pushEnabled}
            onChange={(e) => updateSetting('notification', 'pushEnabled', e.target.checked)}
          />
          Bật thông báo đẩy
        </label>
      </div>

      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={tempSettings.notification.emergencyAlert}
            onChange={(e) => updateSetting('notification', 'emergencyAlert', e.target.checked)}
          />
          Thông báo khẩn cấp
        </label>
      </div>

      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={tempSettings.notification.campaignNotifications}
            onChange={(e) => updateSetting('notification', 'campaignNotifications', e.target.checked)}
          />
          Thông báo chiến dịch
        </label>
      </div>

      <div className="form-group">
        <label>Ngày nhắc nhở trước khi có thể hiến máu trở lại:</label>
        <div className="reminder-days">
          {[1, 3, 7, 14].map(day => (
            <label key={day} className="checkbox-inline">
              <input
                type="checkbox"
                checked={tempSettings.notification.reminderDays.includes(day)}
                onChange={(e) => {
                  const newDays = e.target.checked
                                    ? [...tempSettings.notification.reminderDays, day]
                  : tempSettings.notification.reminderDays.filter(d => d !== day);
                  
                  updateSetting('notification', 'reminderDays', newDays);
                }}
              />
              {day} ngày
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className="tabs">
      {['general', 'donation', 'notification'].map(tab => (
        <button
          key={tab}
          className={activeTab === tab ? 'tab active' : 'tab'}
          onClick={() => setActiveTab(tab)}
        >
          {tab === 'general' && 'Cài đặt chung'}
          {tab === 'donation' && 'Cài đặt hiến máu'}
          {tab === 'notification' && 'Cài đặt thông báo'}
        </button>
      ))}
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'donation':
        return renderDonationSettings();
      case 'notification':
        return renderNotificationSettings();
      default:
        return null;
    }
  };

  return (
    <div className="system-settings">
      <h2>Cài đặt hệ thống</h2>
      {renderTabs()}
      <div className="tab-content">{renderActiveTab()}</div>
      <div className="settings-actions">
        <button
          className="save-button"
          onClick={handleSave}
          disabled={!hasChanges}
        >
          Lưu cài đặt
        </button>
        <button className="reset-button" onClick={handleReset}>
          Đặt lại
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;
