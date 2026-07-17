import { funvalServices } from './api'

const authService = {}

authService.login = async (email, password) => {
    try {
        await funvalServices.post("/v1/auth/login", { email, password })
        return { success: true }

    } catch (error) {
        console.error(error)
        throw new Error("Error al loguear", {cause: error})
    }
}

authService.logout = async () => {
    const response = await funvalServices.post("/v1/auth/logout")
    return response.data // Limpia la cookie HTTPOnly en el navegador
}

export { authService }