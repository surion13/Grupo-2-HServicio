
import { useState, createContext,useEffect } from "react"; //Rafa: creando useEffect para verificar si hay sesion y evitar loguearse al recargar.
import useApi from "../hooks/useApi";
import { authService, profileService } from "../services/funvalApi";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const navigate = useNavigate();

    const { loading:loginLoading, error, execute: loginExecute } = useApi(authService.login)
    const { execute: authExecute } = useApi(profileService.getMe)
    const {execute: cerrarSesion} = useApi(authService.logout)
    
    const [auth, setAuth] = useState(null);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    //Rafa: estado para pausar la app mientras validamos si hay sesuin en cookies
    const [inicializado,setInicializado]=useState(true)

    //Rafa: efecto para confirmar la sesion activa:

    useEffect(()=>{
        const verifySession = async ()=>{
            try {
                const authme = await authExecute();
                if (authme){
                    setUser(authme.email)
                    setRole(authme.role)
                    setAuth(authme)
                }
                
            } catch (error) {
                console.error(error)                
            }finally{
                setInicializado(false)
            }
        }
        verifySession()
    },[])

    async function login(email, password) {
        try {
            const apiLogin = await loginExecute(email, password)
            
            if(!apiLogin) return
            
            const authme = await authExecute(apiLogin.access_token)

            if(!authme) return

            setUser(authme.email)
            setRole(authme.role)

            setAuth(authme)

            if (authme.role === "ADMIN") {
                navigate("/dashboard-admin")
            } else {
                navigate("/dashboard-student")
            }

        } catch (error) {
            console.error("error al loguear: ", error)
            throw error;//Rafa: para que al fallar las notificaciones Toast usen el error.
        }
    }

    const isAuthenticated = () => {
        if (auth) {
            return true
        } else {
            return navigate("/login");
        }
    }

    const logout = async () => {
        try{
        setAuth(null)
        cerrarSesion()
        navigate("/login")
    }
    catch (err){
        console.error(err)


    }finally{
        navigate("/")
    }

}
//Rafa: se combina el estado de carga del login con el de la validacion de login
const loading = loginLoading|| inicializado

//Rafa: agregue auth para que PdfUploader pueda leer los datos de la sesion.
    const value = { auth, user, role, loading, error, isAuthenticated, login, logout }

    return (
        <AuthContext.Provider value={value}>
            {!inicializado ? (children):(
                <div className="flex h-screen items-center justify-center bg-gray-50">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
                        <p className="text-sm text-gray-500 font-medium">Verificando sesión...</p>
                    </div>
                </div>
            )  }
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }