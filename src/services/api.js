// Instancia de Axios + Interceptores
import axios from 'axios'

export const funvalServices = axios.create({
        baseURL: "/api",
        withCredentials: true,
        headers: {
                'Content-Type': 'application/json'
        }
})