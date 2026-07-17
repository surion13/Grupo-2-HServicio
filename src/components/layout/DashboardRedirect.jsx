import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import { dashboardByRole } from "../../utils/constants/routes"

export default function DashboardRedirect() {
    const { user } = useContext(AuthContext)

    const route = dashboardByRole[user?.role] || "/login"
    
    return <Navigate to={route} replace /> 
}