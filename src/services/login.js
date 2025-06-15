import axios from "axios";

export const LoginAPI =  (userlogin) => {  return axios.post("http://localhost:8080/swp391/auth/login", userlogin)};
export const RegisterAPI =  (userregister) =>  {  return  axios.post("http://localhost:8080/swp391/members", userregister,{
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})};