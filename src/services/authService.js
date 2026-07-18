import { funvalServices } from './api'

const authService = {}

authService.login = async (email, password) => {
    try {
        // Enviamos las credenciales y recibimos la respuesta
        const response = await funvalServices.post("/v1/auth/login", { email, password })
        
        // Retornamos los datos para que el AuthContext los pueda usar
        return response.data 
    } catch (error) {
        // Si el backend devuelve un error (401, 400), lo capturamos
        // Esto permite que el componente de Login muestre el mensaje real:
        throw error.response?.data?.message || "Error al iniciar sesión"
    }
}

authService.logout = async () => {
    try {
        await funvalServices.post("/v1/auth/logout")
        return { success: true }
    } catch (error) {
        console.error("Error al cerrar sesión", error)
        throw error
    }
}

export { authService }