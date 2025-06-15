import { jwtDecode } from "jwt-decode";

export const IsTokenAboutToExpire = (token) => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    console.log('[TokenCheck]', {
      token,
      decoded,
      now: Date.now() / 1000,
      expiresIn: decoded.exp - now,
    });
    return decoded.exp - now < 3590;
  } catch (err) {
    return false;
  }
};
