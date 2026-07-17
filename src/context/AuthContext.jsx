import { useState, createContext } from "react";
import { useEffect } from "react";
import { authService } from "../services/authService";
import { api } from "../services/api";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const checkAuth = async () => {
        
        setError(null)
        setLoading(true)
        
        try {
            const response = await api.get("/api/v1/profile/me")
            
            setUser(response.data)

        } catch(err) {

            setUser(null)
            setError(err.message)

        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        
        setError(null)

        try {
            await authService.login(email, password);
              
            await checkAuth()

        } catch (error) {
            console.error(error.response?.data?.detail)
            setError("Error al loguearse")
            throw error

        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {    
        await authService.logout()
        setUser(null)
    }

    useEffect(() => {
        
        checkAuth();
        
    }, []);

    
    const value = { user, loading, error, login, logout, isAuthenticated: Boolean(user)}

    return (
        <AuthContext.Provider value={value}>
            { children }
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }