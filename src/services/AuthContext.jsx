import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "./authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // const [user, setUser] = useState(null);
  //change
  // const [user, setUser] = useState(() => {
  //   const storedUser = localStorage.getItem("user");
  //   return storedUser ? JSON.parse(storedUser) : null;
  // });
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      // Kiểm tra storedUser tồn tại và không phải "undefined"
      if (storedUser && storedUser !== "undefined") {
        return JSON.parse(storedUser);
      }
      return null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      // Xóa dữ liệu hỏng để tránh lỗi tái diễn
      localStorage.removeItem("user");
      return null;
    }
  });
  //add roleAdd
  // const [role, setRole] = useState(() => {
  //   return localStorage.getItem("role") || null;
  // });
  const [role, setRole] = useState(() => {
    const storedRole = localStorage.getItem("role");
    return storedRole && storedRole !== "undefined" ? storedRole : null;
  });
  const [loading, setLoading] = useState(true);

  // Kiểm tra user khi app khởi động
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      const storedRole = localStorage.getItem("role");

      if (token && userData && storedRole) {
        try {
          const parsedUser = JSON.parse(userData);
          const success = await verifyToken(); // ✅ cần await
          if (success) {
            setUser(parsedUser);
            setRole(storedRole);
          } else {
            clearAuthData();
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          clearAuthData();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Xác minh token với server
  const verifyToken = async () => {
    try {
      const response = await authService.getCurrentUser();
      const userFromServer = response.data.result.user || response.data;
      const roleFromServer = response.data.result.role;

      setUser(userFromServer);
      setRole(roleFromServer);
      localStorage.setItem("user", JSON.stringify(userFromServer));
      localStorage.setItem("role", roleFromServer);
      return true;
    } catch (error) {
      console.error("Token verification failed:", error);
      clearAuthData();
      return false;
    }
  };
  // Xóa dữ liệu xác thực
  const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUser(null);
    setRole(null);
  };

  // Đăng nhập
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      const { data } = response;

      // Nếu BE trả code khác 1000 thì không phải đăng nhập thành công
      if (data.code !== 1000) {
        let errorMessage = data.message || "Đăng nhập thất bại";

        if (data.code === 1002) {
          errorMessage = "Tài khoản không tồn tại";
        }

        return { success: false, error: errorMessage, code: data.code };
      }

      localStorage.setItem("token", data.result.token);
      localStorage.setItem("user", JSON.stringify(data.result.user));
      localStorage.setItem("role", data.result.role);
      setUser(data.result.user);
      setRole(data.result.role);

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Đăng nhập thất bại";

      // ✅ Dịch lỗi sang tiếng Việt
      if (errorMessage.includes("User does not exist")) {
        errorMessage = "Tài khoản không tồn tại";
      } else if (errorMessage.includes("Invalid credentials")) {
        errorMessage = "Email hoặc mật khẩu không đúng";
      } else if (errorMessage.includes("Network Error")) {
        errorMessage = "Không thể kết nối đến máy chủ";
      } else {
        errorMessage = "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      }

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  // Đăng ký
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      ////REGIST NOT ALLOW LOGINLOGIN
      //const { data } = response;
      // localStorage.setItem('token', data.token);
      // localStorage.setItem('user', JSON.stringify(data.user));
      // setUser(data.user);

      return {
        success: true,
        message: "Đăng ký thành công. Vui lòng đăng nhập.",
      };
    } catch (error) {
      console.error("Register error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Đăng ký thất bại";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  // Dăng ký với Google
  const loginWithGoogle = async (idToken) => {
    try {
      setLoading(true);
      const response = await authService.loginWithGoogle(idToken);

      console.log("Google login response:", response.data); // ✅ Thêm dòng này để kiểm tra

      const { token, user, role } = response.data.result;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role);

      setUser(user);
      setRole(role);

      return { success: true };
    } catch (error) {
      console.error("Google login error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Google login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // Đăng xuất
  const logout = async () => {
    clearAuthData();
    // const token = localStorage.getItem("token");
    // try {
    //   if (token) {
    //     await authService.logout(token); // Truyền token
    //   }
    // } catch (error) {
    //   console.error("Logout API error:", error);
    // } finally {
    //   clearAuthData();
    // }
  };

  // Cập nhật hồ sơ
  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(
        profileData.id,
        profileData
      );
      const { data } = response;

      // localStorage.setItem('user', JSON.stringify(data.result.user));
      // setUser(data.result.user);

      const updatedUser = data?.result?.user;
      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }

      return { success: true };
    } catch (error) {
      console.error("Update profile error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Cập nhật thất bại";
      return { success: false, error: errorMessage };
    }
  };

  // Đổi mật khẩu
  const changePassword = async (oldPassword, newPassword) => {
    try {
      await authService.changePassword(oldPassword, newPassword);
      return { success: true };
    } catch (error) {
      console.error("Change password error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Đổi mật khẩu thất bại";
      return { success: false, error: errorMessage };
    }
  };

  // Quên mật khẩu
  const forgotPassword = async (email) => {
    try {
      await authService.forgotPassword(email);
      return { success: true };
    } catch (error) {
      console.error("Forgot password error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Gửi email thất bại";
      return { success: false, error: errorMessage };
    }
  };

  // Reset mật khẩu
  const resetPassword = async (token, newPassword) => {
    try {
      await authService.resetPassword(token, newPassword);
      return { success: true };
    } catch (error) {
      console.error("Reset password error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Reset mật khẩu thất bại";
      return { success: false, error: errorMessage };
    }
  };

  // Xác thực email(forget password)
  const verifyEmail = async (token) => {
    try {
      await authService.verifyEmail(token);
      return { success: true };
    } catch (error) {
      console.error("Verify email error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Xác thực email thất bại";
      return { success: false, error: errorMessage };
    }
  };
  //Xác thực email(register)
  const sendOtp = async (email) => {
    try {
      const response = await authService.sendOtp(email);
      if (response.data.code !== 1000) {
        return {
          success: false,
          error: response.data.message || "Gửi OTP thất bại",
        };
      }
      return { success: true, message: "OTP đã được gửi đến email của bạn!" };
    } catch (error) {
      console.error("Send OTP error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Gửi OTP thất bại";
      return { success: false, error: errorMessage };
    }
  };

  //xác thực otp(register)
  const verifyOtpRegis = async (otp, email) => {
    try {
      const response = await authService.verifyOtpRegis(parseInt(otp), email);
      if (response.data.code !== 1000 || !response.data.result.verified) {
        return {
          success: false,
          error: response.data.message || "Xác thực OTP thất bại",
        };
      }
      return { success: true, message: "Xác thực OTP thành công" };
    } catch (error) {
      console.error("Verify OTP error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Xác thực OTP thất bại";
      return { success: false, error: errorMessage };
    }
  };

  // Lấy danh sách tất cả user (chỉ dành cho admin)
  const getAllUsers = async () => {
    try {
      const response = await authService.getAllUsers(); // phải khai báo trong authService
      return { success: true, users: response.data };
    } catch (error) {
      console.error("Get all users error:", error);
      const errorMessage =
        error.response?.data?.message || "Không lấy được danh sách người dùng";
      return { success: false, error: errorMessage };
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
    sendOtp,
    verifyOtpRegis,
    getAllUsers,
    isAuthenticated: !!user,
    isAdmin: role === "ADMIN",
    isStaff: role === "STAFF",
    isMember: role === "MEMBER",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
