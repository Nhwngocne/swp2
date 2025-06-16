// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAtkUY6O143huGHt1ugtwnpMP5yuEL1RNo",
  authDomain: "swp391-7d1de.firebaseapp.com",
  projectId: "swp391-7d1de",
  storageBucket: "swp391-7d1de.appspot.com", // ✅ đúng đuôi
  messagingSenderId: "885376727554",
  appId: "1:885376727554:web:972ead685dd0b1f776451b",
  measurementId: "G-2FLTM3VEWH"
};

// Khởi tạo Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/**
 * Đăng nhập bằng Google
 * Trả về: { success, user, token, error }
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const token = await user.getIdToken(); // Firebase ID token

    // ✅ In ra console để kiểm tra
    console.log("✅ Đăng nhập Google thành công:");
    console.log("👤 User:", user);
    console.log("🔐 Token:", token);

    return {
      success: true,
      user,
      token
    };
  } catch (error) {
    console.error("❌ Lỗi đăng nhập Google:", error);
    return {
      success: false,
      error
    };
  }
};

export { auth };
