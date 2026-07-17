import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { dashboardByRole } from "../utils/constants/routes";

export default function PageNotFound() {
  const { user } = useAuth()

  const route = user ? dashboardByRole[user.role] : "/login"

  return (
    <div className="mt-10 ml-16">
      <Link to={route} className="mt-15">
        {" "}
        Regresar
      </Link>
      <h1 className="mt-20 font-bold text-2xl text-center">
        Página no encontrada
      </h1>
    </div>
  );
}
