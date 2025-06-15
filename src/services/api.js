// api.js (file cấu hình Axios)
import axios from 'axios';


import { IsTokenAboutToExpire } from './jwtDecode';
import { RefreshTokenExprie } from './refreshtoken.js';
const api = axios.create({
  baseURL: 'http://localhost:8080/swp391',
});

// Tự động thêm token vào mỗi request
let flag = true;
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('token');

   
    if (flag && IsTokenAboutToExpire(token)) {
      flag = false;
      try {
      console.log("token cu ", token)
        const response = await RefreshTokenExprie({ token: token });
        
        localStorage.setItem('token', response.data.token);
        // window.location.href = `/test/${localStorage.getItem("token")}`
        console.log("token moi",response.data.token)
        flag = true;
      } catch (error) {
       console.log("loi refresh token ")
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = '/user/login'
        }

      }
    }
    token = localStorage.getItem("token")
    console.log("token giu di ",token)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
