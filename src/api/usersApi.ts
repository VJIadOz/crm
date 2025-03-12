import axios from "axios";
import {User} from "../components/Main/types/user.type";

const API_URL: string = "http://localhost:3000/api/clients";

export function getUsers(param: string){
    return axios.get<User[]>(`${API_URL}?search=${param}`);
}

export function getUserAPI(userId: string){
    return axios.get<User>(`${API_URL}/${userId}`);
}

export function deleteUserAPI(userId: string){
    return axios.delete(`${API_URL}/${userId}`);
}

export function addUserAPI(user: User){
    return axios.post(`${API_URL}`, user)
}

export function editUserAPI(userId: string, user: User){
    return axios.patch(`${API_URL}/${userId}`, user)
}