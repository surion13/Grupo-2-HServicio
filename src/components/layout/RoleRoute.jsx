import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function RoleRoute({ roleUser }) {
    const { role } = useContext(AuthContext);

    return role ===  roleUser
    ? <Outlet />
    : <Navigate to="/login" />
}