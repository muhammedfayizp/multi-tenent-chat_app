import { AxiosInstance, PubApiClient } from "../axiosInstance/AxiosInstance";


export const getMessages = async (groupId) => {
    const response = await AxiosInstance.get(`/groups/getMessages/${groupId}`);    
    return response.data;
};
