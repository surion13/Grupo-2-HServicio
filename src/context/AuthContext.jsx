import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import { authService, profileService } from "../services/funvalApi";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const navigate = useNavigate();

    // Hooks personalizados de API
    const { loading: loginLoading, error: loginError, execute: loginExecute } = useApi(authService.login);
    const { execute: authExecute } = useApi(profileService.getMe);
    const { execute: cerrarSesion } = useApi(authService.logout);
    
    // Estados de Autenticación y Usuario
    const [auth, setAuth] = useState(null);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [error, setError] = useState(null);

    // Estado para pausar la app mientras validamos si hay sesión activa en cookies
    const [inicializado, setInicializado] = useState(true);

    // Efecto para confirmar la sesión activa al recargar la página
    useEffect(() => {
        const verifySession = async () => {
            try {
                const authme = await authExecute();
                if (authme) {
                    setUser(authme.email);
                    setRole(authme.role);
                    setAuth(authme);
                }
            } catch (err) {
                console.error("Error al verificar sesión activa:", err);
            } finally {
                setInicializado(false);
            }
        };
        verifySession();
    }, []);

    // Función de Inicio de Sesión
    async function login(email, password) {
        setError(null);
        try {
            // 1. Ejecutar el login en el servidor
            await loginExecute(email, password);
            
            // 2. Obtener inmediatamente el perfil del usuario autenticado
            const authme = await authExecute();
            if (authme) {
                setUser(authme.email);
                setRole(authme.role);
                setAuth(authme);
            }
        } catch (err) {
            console.error("error al loguear: ", err);
            setError("Error al iniciar sesión. Verifique sus credenciales.");
            throw err; // Permite que los componentes (o Toasts de notificación) capturen el error
        }
    }

    // Función de Cierre de Sesión
    const logout = async () => {
        try {
            setAuth(null);
            setUser(null);
            setRole(null);
            await cerrarSesion();
        } catch (err) {
            console.error("Error al cerrar sesión de forma segura:", err);
        } finally {
            navigate("/login");
        }
    };

    // Combinación de estados de carga y autenticidad
    const loading = loginLoading || inicializado;
    const isAuthenticated = Boolean(user);

    // Contexto unificado
    const value = { 
        auth, 
        user, 
        role, 
        loading, 
        error: error || loginError, 
        isAuthenticated, 
        login, 
        logout 
    };

    return (
        <AuthContext.Provider value={value}>
            {!inicializado ? (
                children
            ) : (
                /* Pantalla de carga integrada mientras se valida la sesión */
                <div className="flex h-screen items-center justify-center bg-gray-50">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
                        <p className="text-sm text-gray-500 font-medium">Verificando sesión...</p>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };