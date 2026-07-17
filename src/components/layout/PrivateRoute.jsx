import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import Spinner from "../common/Spinners";

export default function PrivateRoute() {
    const { loading, user } = useContext(AuthContext)

    if (loading) return <Spinner />

    if (!user) return <Navigate to={"/login"} replace />

    return <Outlet />
}