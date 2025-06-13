import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  //add role
  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || null;
  });
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    const validateToken = async () => {
      if (token && userData && storedRole) {
        try {
          const response = await fetch(
            "http://localhost:8080/swp391/auth/introspect",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ token }),
            }
          );

          if (!response.ok) {
            throw new Error("Token hết hạn hoặc không hợp lệ");
          }

          // Nếu token hợp lệ, giữ nguyên user và role
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setRole(storedRole);
        } catch (error) {
          console.error("Token không hợp lệ:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("role");
          setUser(null);
          setRole(null);
        }
      } else {
        // Không có đủ thông tin
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        setUser(null);
        setRole(null);
      }

      setLoading(false);
    };

    validateToken();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);

      // Simulate API call
      const response = await fetch("http://localhost:8080/swp391/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Đăng nhập thất bại");
      }

      const data = await response.json();

      // Store token and user data
      localStorage.setItem("token", data.result.token);
      localStorage.setItem("user", JSON.stringify(data.result.user));
      localStorage.setItem("role", data.result.role);

      setUser(data.result.user);
      setRole(data.result.role);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/swp391/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Đăng ký thất bại");
      }

      // const data = await response.json();

      // // Auto login after successful registration
      // localStorage.setItem("token", data.token);
      // localStorage.setItem("user", JSON.stringify(data.user));

      // setUser(data.user);
      return {
        success: true,
        message: "Đăng ký thành công, vui lòng đăng nhập",
      };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUser(null);
    setRole(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Cập nhật thất bại");
      }

      const data = await response.json();

      // Update user data in localStorage and state
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      return { success: true };
    } catch (error) {
      console.error("Update profile error:", error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    role,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: role === "ADMIN",
    isStaff: role === "STAFF",
    isMember: role === "MEMBER",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
