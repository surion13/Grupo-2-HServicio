import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="mt-10 ml-16">
      <Link to={"/"} className="mt-15">
        {" "}
        Regresar
      </Link>
      <h1 className="mt-20 font-bold text-2xl text-center">
        Página no encontrada
      </h1>
    </div>
  );
}
