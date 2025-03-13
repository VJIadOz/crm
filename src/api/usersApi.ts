import axios from "axios";
import {User} from "../components/Main/types/user.type";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api/clients",
    timeout: 15000,
});


export function getUsers(param: string){
    return axiosInstance.get<User[]>(`?search=${param}`);
}

export function getUserAPI(userId: string){
    return axiosInstance.get<User>(`/${userId}`);
}

export function deleteUserAPI(userId: string){
    return axiosInstance.delete(`/${userId}`);
}

export function addUserAPI(user: User){
    return axiosInstance.post('', user)
}

export function editUserAPI(userId: string, user: User){
    return axiosInstance.patch(`/${userId}`, user)
}

axiosInstance.interceptors.response.use(
    function(response){
        return response;
    },
    function (error){
        let errorMessage: string;
        if (error.response) {
            const { status, data } = error.response;
            errorMessage = `Ошибка сервера ${status}: ${data.message}`;
        } else if (error.request) {
            if (error.code === 'ERR_NETWORK' || error.message.includes('ERR_CONNECTION_REFUSED')) {
                errorMessage = `Сервер недоступен: ${error.message}`
            } else {
                errorMessage = `Ошибка запроса: ${error.request}`
            }
        } else {
            errorMessage = `Ошибка: ${error.message}`
        }
        toast.error(errorMessage,{
            position: "top-right",
            autoClose: 5000,
        });
        return {}
    });