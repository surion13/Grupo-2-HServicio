// Instancia de Axios + Interceptores
import axios from 'axios'

export const funvalServices = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        withCredentials: false,
        headers: {
                'Content-Type': 'application/json'
        }
})