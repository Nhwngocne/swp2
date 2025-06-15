
import axios from "axios"
export const RefreshTokenExprie = (token) =>
{
    return axios.post("http://localhost:8080/swp391/auth/refreshtoken",token)
}