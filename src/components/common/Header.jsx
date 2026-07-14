import { useState, useEffect } from "react";

function Header() {
  const [darkMode, setDarkMode] = useState(false);

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
          <button className="material-symbols-outlined text-primary cursor-pointer">
            menu
          </button>
          <h1 className="text-headline-md font-bold text-primary">Funval</h1>
        </div>

        <div className="flex items-center gap-md">
          {/* Botón de cambio de tema (Sol / Luna) */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer p-xs rounded-full hover:bg-surface-container-high transition-colors"
            title="Cambiar modo de color"
          >
            {darkMode ? "light_mode" : "dark_mode"}
          </button>

          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container">
            <img
              className="w-full h-full object-cover"
              alt="Alejandro's profile portrait"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCMWPecmMLNvge6tCUWWlnibQESmiANPvAZlKtvkqvU9eZW0kHOeQR9Q_VmPBAAlFfs9K262QX7YrE50dWlrH24CB-VSaCBs-X0HZr5lOKU4F1JpI5TrnYdbN7i2WeTp7Vj690zJqnxkK56Mym8vzdYlLzj1tv5pjw8is7lq45Hg2xdE6noXF7fRRjcAUe8rmZ06qFShFzwLAubMClIpYzIdCwW19LBiQdLH4UWSQGIqveHUNqOkXekmaMWKATIly0xJBiaOQe3ys"
            />
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
