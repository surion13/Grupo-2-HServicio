import { useState, useEffect } from "react";

export default function DashboardStudent() {
  // Estado para controlar el modo oscuro (Dark Mode)
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // Datos mockeados para los reportes (siguiendo tu diseño original)
  const reportes = [
    {
      id: 1,
      titulo: "Apoyo en Biblioteca Central",
      fecha: "24 Oct, 2023",
      horas: 4,
      estado: "Approved",
    },
    {
      id: 2,
      titulo: "Taller de Alfabetización Digital",
      fecha: "21 Oct, 2023",
      horas: 6,
      estado: "Pending",
    },
    {
      id: 3,
      titulo: "Mantenimiento de Redes Lab 02",
      fecha: "15 Oct, 2023",
      horas: 3,
      estado: "Rejected",
    },
  ];

  // Helper para asignar las clases de estado semántico personalizadas
  const getBadgeStyle = (estado) => {
    switch (estado) {
      case "Approved":
        return "bg-status-approved-bg text-status-approved-text";
      case "Pending":
        return "bg-status-pending-bg text-status-pending-text";
      case "Rejected":
        return "bg-status-rejected-bg text-status-rejected-text";
      default:
        return "bg-surface-container text-on-surface";
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background transition-colors duration-200">
      {/* --- TopAppBar --- */}
      <header className="bg-surface border-b border-outline-variant fixed top-0 w-full z-40 h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center gap-md">
          <button className="material-symbols-outlined text-primary cursor-pointer">
            menu
          </button>
          <h1 className="text-headline-md font-bold text-primary">EduReport</h1>
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

      {/* --- Main Content --- */}
      <main className="pt-24 pb-32 px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto">
        {/* Welcome Message */}
        <section className="mb-lg">
          <h2 className="text-headline-lg-mobile md:text-headline-lg text-primary">
            Hola, Alejandro
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Aquí tienes el resumen de tu progreso académico y reportes
            recientes.
          </p>
        </section>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
          {/* Progreso del Curso Section */}
          <div className="md:col-span-4 bg-surface border border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-md opacity-10 dark:opacity-20">
              <span
                className="material-symbols-outlined text-[64px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                analytics
              </span>
            </div>
            <h3 className="text-label-md text-on-surface-variant self-start mb-lg">
              PROGRESO DEL CURSO
            </h3>

            <div className="relative flex items-center justify-center mb-md">
              <svg className="w-40 h-40 transform -rotate-90">
                {/* Background Ring */}
                <circle
                  className="text-surface-container-highest"
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                ></circle>
                {/* Progress Ring */}
                <circle
                  className="text-primary"
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="70"
                  stroke="currentColor"
                  strokeDasharray="439.8"
                  strokeDashoffset="146.6"
                  strokeLinecap="round"
                  strokeWidth="12"
                ></circle>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-headline-md text-primary">66%</span>
                <span className="text-label-sm text-on-surface-variant uppercase">
                  Completado
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-body-md font-bold text-on-surface">
                <span className="text-primary">80 Horas</span> aprobadas
              </p>
              <p className="text-body-sm text-on-surface-variant">
                de 120 requeridas
              </p>
            </div>
          </div>

          {/* Nuevo Reporte Primary Card */}
          <div className="md:col-span-8 bg-primary-container text-on-primary-container rounded-xl p-lg flex flex-col justify-between relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md">
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary opacity-20 rounded-full group-hover:scale-110 transition-transform"></div>

            <div className="relative z-10">
              <div className="bg-secondary-container text-on-secondary-container inline-flex p-sm rounded-lg mb-md">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  add_circle
                </span>
              </div>
              <h3 className="text-headline-md text-white mb-xs">
                Nuevo Reporte de Actividad
              </h3>
              <p className="text-body-md text-on-primary-container max-w-md">
                Registra tus horas de servicio o actividades educativas hoy para
                mantener tu progreso actualizado.
              </p>
            </div>

            <div className="relative z-10 mt-lg flex justify-end">
              <button className="bg-white text-primary font-bold px-lg py-md rounded-full shadow-sm hover:bg-surface-bright transition-colors flex items-center gap-sm cursor-pointer">
                Comenzar Ahora
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Mis Reportes Quick Access */}
          <div className="md:col-span-12 bg-surface border border-outline-variant rounded-xl p-lg">
            <div className="flex justify-between items-center mb-lg">
              <h3 className="text-headline-sm text-primary">
                Mis Reportes Recientes
              </h3>
              <button className="text-primary font-label-md hover:underline flex items-center gap-xs cursor-pointer">
                Ver todos
                <span className="material-symbols-outlined text-[18px]">
                  open_in_new
                </span>
              </button>
            </div>

            <div className="space-y-md">
              {reportes.map((reporte) => (
                <div
                  key={reporte.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-md bg-surface-container-low border border-outline-variant rounded-lg hover:bg-surface-container transition-colors"
                >
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center text-primary">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        description
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface">
                        {reporte.titulo}
                      </h4>
                      <p className="text-body-sm text-on-surface-variant">
                        {reporte.fecha} • {reporte.horas} Horas
                      </p>
                    </div>
                  </div>
                  <div className="mt-sm md:mt-0">
                    <span
                      className={`px-md py-1 rounded-full text-label-sm font-bold ${getBadgeStyle(reporte.estado)}`}
                    >
                      {reporte.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* --- BottomNavBar (Mobile only) --- */}
      <nav className="fixed bottom-0 w-full z-50 bg-surface border-t border-outline-variant h-20 pb-safe px-2 flex justify-around items-center md:hidden rounded-t-xl">
        <button className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1 scale-95 transition-transform duration-150 cursor-pointer">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            home
          </span>
          <span className="text-label-sm mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors px-4 py-1 cursor-pointer">
          <span className="material-symbols-outlined">description</span>
          <span className="text-label-sm mt-1">Reports</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors px-4 py-1 cursor-pointer">
          <span className="material-symbols-outlined">add_circle</span>
          <span className="text-label-sm mt-1">New</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors px-4 py-1 cursor-pointer">
          <span className="material-symbols-outlined">
            admin_panel_settings
          </span>
          <span className="text-label-sm mt-1">Admin</span>
        </button>
      </nav>

      {/* --- Floating Action Button (FAB) --- */}
      <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-40 hidden sm:block">
        <button className="bg-secondary shadow-lg hover:shadow-xl text-on-secondary w-14 h-14 rounded-xl flex items-center justify-center transition-all hover:-translate-y-1 active:scale-95 group cursor-pointer">
          <span className="material-symbols-outlined text-[28px] group-hover:rotate-90 transition-transform">
            add
          </span>
        </button>
      </div>
    </div>
  );
}
