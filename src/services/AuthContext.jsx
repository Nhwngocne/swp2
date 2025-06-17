import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from "./authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');

    const initializeAuth = async () => {
      if (token && userData && storedRole) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setRole(storedRole);
          await verifyToken(); // gọi verify lại từ backend để đảm bảo
        } catch (error) {
          console.error('Error initializing auth:', error);
          clearAuthData();
        }
      }
      setLoading(false); // chỉ kết thúc loading sau khi xử lý xong
    };

    initializeAuth();
  }, []);

  const verifyToken = async () => {
    try {
      const response = await authService.getCurrentUser();
      const userFromServer = response.data.result?.user || response.data;
      const roleFromServer = response.data.result?.role;

      setUser(userFromServer);
      setRole(roleFromServer);

      localStorage.setItem('user', JSON.stringify(userFromServer));
      localStorage.setItem('role', roleFromServer);
    } catch (error) {
      console.error('Token verification failed:', error);
      clearAuthData();
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setUser(null);
    setRole(null);
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
    console.log("Google login response:", response.data); // ✅ Thêm dòng này để kiểm tra

      const { token, user, role } = response.data.result;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', role);

      setUser(user);
      setRole(role);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Đăng nhập thất bại',
      };
    } finally {
      setLoading(false);
    }
  };

 const loginWithGoogle = async (idToken) => {
  try {
    setLoading(true);
    const response = await authService.loginWithGoogle(idToken);

    console.log("Google login response:", response.data); // ✅ Thêm dòng này để kiểm tra

    const { token, user, role } = response.data.result;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', role);

    setUser(user);
    setRole(role);

    return { success: true };
  } catch (error) {
    console.error("Google login error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Google login failed"
    };
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
    clearAuthData();
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      await authService.register(userData);
      return { success: true, message: "Đăng ký thành công. Vui lòng đăng nhập." };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Đăng ký thất bại',
      };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData.id,profileData);
      const { data } = response;

      // localStorage.setItem('user', JSON.stringify(data.result.user));
      // setUser(data.result.user);

      const updatedUser = data?.result?.user;
      if (updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }

      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Cập nhật thất bại',
      };
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      await authService.changePassword(oldPassword, newPassword);
      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Đổi mật khẩu thất bại',
      };
    }
  };

  const forgotPassword = async (email) => {
    try {
      await authService.forgotPassword(email);
      return { success: true };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Gửi email thất bại',
      };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      await authService.resetPassword(token, newPassword);
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Reset mật khẩu thất bại',
      };
    }
  };

  const verifyEmail = async (token) => {
    try {
      await authService.verifyEmail(token);
      return { success: true };
    } catch (error) {
      console.error('Verify email error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Xác thực email thất bại',
      };
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await authService.getAllUsers();
      return { success: true, users: response.data };
    } catch (error) {
      console.error('Get all users error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Không lấy được danh sách người dùng',
      };
    }
  };

  const value = {
    user,
    role,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    getAllUsers,
    isAuthenticated: !!user,
    isAdmin: role === 'ADMIN',
    isStaff: role === 'STAFF',
    isMember: role === 'MEMBER',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
