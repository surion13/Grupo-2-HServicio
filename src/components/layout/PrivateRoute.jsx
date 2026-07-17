import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

export default function PrivateRoute() {
    const { loading, user } = useContext(AuthContext)

    if (loading) return <p>Espere estamos cargando</p>

    if (!user) return <Navigate to={"/login"} replace />

    return <Outlet />
}