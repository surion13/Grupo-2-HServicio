import { useState, createContext } from "react";
import useApi from "../hooks/useApi";
import { authService, profileService } from "../services/funvalApi";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const { loading, error, execute: loginExecute } = useApi(authService.login);
  const { execute: authExecute } = useApi(profileService.getMe);
  const { execute: cerrarSesion } = useApi(authService.logout);

  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  async function login(email, password) {
    try {
      const apiLogin = await loginExecute(email, password);

      if (!apiLogin) return;

      const authme = await authExecute(apiLogin.access_token);

      if (!authme) return;

      setUser(authme.email);
      setRole(authme.role);
       } catch (error) {
            console.error("error al loguear: ", error)
            throw error;//Rafa: para que al fallar las notificaciones Toast usen el error.
        }
    }
      setAuth(authme);

      if (authme.role === "ADMIN") {
        navigate("/dashboard-admin");
      } else {
        navigate("/dashboard-student");
      }
    } catch (error) {
      console.error("error al loguear: ", error);
    }
  }

  const isAuthenticated = () => {
    if (auth) {
      return true;
    } else {
      return navigate("/");
    }
  };

  const logout = () => {
    setAuth(null);
    cerrarSesion();
    navigate("/");
  };

  const value = { user, role, loading, error, isAuthenticated, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
