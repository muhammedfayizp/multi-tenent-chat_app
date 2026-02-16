import { AxiosInstance, PubApiClient } from "../axiosInstance/AxiosInstance";


const publicApi = PubApiClient
// const apiClient = AxiosInstance


export const AdminLogin = async (formData) => {
    const response = await publicApi.post('/admin/auth/login', formData);
    return response.data;
}

export const CreateGroup = async(formData)=>{
    const response = await AxiosInstance.post('/admin/createGroup', formData);
        console.log(response.data);
    
    return response.data;
}

export const getGroups = async ()=>{
    const response = await AxiosInstance.get('/admin/getGroups')
    console.log(response.data.groups);
    
    return response.data
}


export const addMemberToGroup = async ({ userName, email, role, groupId }) => {
    console.log(userName, email, role, groupId);
    const response = await AxiosInstance.post('/admin/addMemberToGroup', {userName,email,role,groupId});
    return response.data;
};

export const fetchMembers = async (groupId)=>{
    const response = await AxiosInstance.get(`/admin/getMembers/${groupId}`)    
    return response.data
}

export const removeMember = async(groupId,memberId)=>{
    const response = await AxiosInstance.post('/admin/removeMemnerFrGrp',{groupId,memberId})
    
    return response.data
}

export const leaveOrDeleteGroup = async (groupId)=>{
    console.log(groupId);
    
    const response = await AxiosInstance.post('/admin/leaveOrDeleteGroup',{groupId})
    console.log(response);
    
    return response.data
}