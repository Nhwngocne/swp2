import api from './api.js';

export const GetInfoMemberAPI = ()=> {
    return api.get("/member/my-profile");
}

export const UpdateInfoMemberAPI = (data, memberId) => {
    return api.put(`/member/${memberId}`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

export const registerAPI = (data) => {
    return api.post("/member/register", data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
