import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { dashboardByRole } from "../../utils/constants/routes";

export default function RoleRoute({ allowedRoles }) {
    const { user: { role } } = useContext(AuthContext)

    const canAccess = allowedRoles.includes(role)

    if(canAccess) {
        return <Outlet />
    }
    
    return <Navigate to={dashboardByRole[role] || "/"} replace />
}