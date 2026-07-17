import { useState, useEffect } from "react";
import { useAuth } from '../../hooks/useAuth'; // Llamando al hook personalizado

function Header() {
  const [darkMode, setDarkMode] = useState(false);

  // Extraemos el usuario y la función logout desde el hook de forma limpia
  const { user, logout } = useAuth();

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div>
      {/* --- TopAppBar --- */}
      <header className="bg-surface border-b border-outline-variant fixed top-0 w-full z-40 h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center gap-md">
          {/* Se añade "md:hidden" para que el botón desaparezca en desktop */}
          <button
            className="material-symbols-outlined text-primary cursor-pointer md:hidden"
            style={{ display: window.innerWidth >= 768 ? "none" : "block" }}
          >
            menu
          </button>
          <h1 className="text-headline-md font-bold text-primary">Funval</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Botón de cambio de tema (Sol / Luna) */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer p-xs rounded-full hover:bg-surface-container-high transition-colors"
            title="Cambiar modo de color"
          >
            {darkMode ? "light_mode" : "dark_mode"}
          </button>

          {/* Se muestra el nombre/correo si el usuario existe */}
          {user && (
            <span className="text-body-medium font-medium text-on-surface hidden sm:inline">
              {user}
            </span>
          )}

          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container">
            <img
              className="w-full h-full object-cover"
              alt="User profile portrait"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCMWPecmMLNvge6tCUWWlnibQESmiANPvAZlKtvkqvU9eZW0kHOeQR9Q_VmPBAAlFfs9K262QX7YrE50dWlrH24CB-VSaCBs-X0HZr5lOKU4F1JpI5TrnYdbN7i2WeTp7Vj690zJqnxkK56Mym8vzdYlLzj1tv5pjw8is7lq45Hg2xdE6noXF7fRRjcAUe8rmZ06qFShFzwLAubMClIpYzIdCwW19LBiQdLH4UWSQGIqveHUNqOkXekmaMWKATIly0xJBiaOQe3ys"
            />
          </div>

          {/* Botón de salida estilizado de main */}
          <button
            onClick={logout}
            className="material-symbols-outlined text-error hover:bg-error-container hover:text-on-error-container cursor-pointer p-xs rounded-full transition-colors"
            title="Cerrar Sesión"
          >
            logout
          </button>
        </div>
      </header>
    </div>
  );
}

export default Header;