import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

export default function DashboardAdmin() {
    const { logout } = useContext(AuthContext)

    return (
        <>
            <h2 className="mt-8 text-3xl text-center">Dashboard Admin</h2>
            <button className="cursor-pointer"  onClick={logout}>Cerrar Sesión</button>
        </>
    )
}