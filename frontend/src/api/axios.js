import axios from 'axios'

const API = axios.create({
    // baseURL: "http://localhost:3000/api/v1",
    baseURL: import.meta.env.VITE_API_URL,
    headers:{
        "Content-Type":"application/json",
    },
    withCredentials: true,
    timeout: 10000,
});

export default API;