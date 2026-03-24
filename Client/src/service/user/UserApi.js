import { AxiosInstance, PubApiClient } from "../axiosInstance/AxiosInstance";


const publicApi = PubApiClient

export const fetchInfo=async(token)=>{
    const response = await publicApi.get(`/member/auth/invite-details/${token}`)
    return response.data
}

export const UserLogin = async(formData)=>{
    const response = await publicApi.post('/member/auth/login',formData)
    return response.data
}

export const getGroups = async()=>{    
    const response = await AxiosInstance.get('/member/getGroups')
    console.log(response.data.groups);
    
    return response.data
}

