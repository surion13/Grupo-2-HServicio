import { useContext, useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import useApi from "../../hooks/useApi";
import { dashboardService, reportService } from "../../services/funvalApi";

import FooterMobile from "../../components/common/FooterMobile";
import Header from "../../components/common/Header";
import BadgeState from "../../components/common/BadgeState";

function DashboardAdmin() {
  const { logout } = useContext(AuthContext);

  // Instancias de consumo de API
  const {
    loading,
    error,
    execute: dashboard,
  } = useApi(dashboardService.getStats);

  const { execute: reportes } = useApi(reportService.list);

  // Estados locales para la información dinámica
  const [datos, setDatos] = useState([]);
  const [reports, setReports] = useState([]);
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState([]);
  const [pendientes, setPendientes] = useState([]);

  // Carga asíncrona de datos desde la API
  useEffect(() => {
    async function traerDatos() {
      try {
        const response = await dashboard();
        const data = await reportes();
        
        setDatos(response.users);
        setReports(response.reports);
        setCourses(response.top_courses);
        setCategory(response.top_categories);
        setPendientes(data.items);
      } catch (err) {
        console.error("Error cargando métricas en el dashboard:", err);
      }
    }
    traerDatos();
  }, []);

  const location = useLocation();

  // Enlaces de navegación para el sidebar
  const navItems = [
    { label: "Categories", icon: "category", path: "/admin/categories" },
    { label: "Courses", icon: "school", path: "/admin/courses" },
    { label: "Dashboard", icon: "dashboard", path: "/dashboard-admin" },
    { label: "Student Records", icon: "group", path: "/students" },
    { label: "Reports Queue", icon: "assignment_late", path: "/reports" },
    {
      label: "User Management",
      icon: "manage_accounts",
      path: "/user-managment",
    },
    { label: "Settings", icon: "settings", path: "/settings" },
  ];

  // Mapeo dinámico de tarjetas utilizando el estado actualizado de la API
  const statsCards = [
    {
      title: "Estudiantes",
      value: datos.total_students || 0,
      change: "0 estudiantes nuevos",
      icon: "group",
      iconColor: "bg-primary-container text-on-primary-container",
    },
    {
      title: "Total Reportes",
      value: reports.total || 0,
      change: `${reports.pending || 0} reportes pendientes`,
      icon: "assignment_late",
      iconColor: "bg-error-container text-on-error-container",
    },
    {
      title: "Cursos Activos",
      value: courses.length || 0,
      change: "3 cursos nuevos en proceso",
      icon: "school",
      iconColor: "bg-secondary-container text-on-secondary-container",
    },
    {
      title: "Categorías Activas",
      value: category.length || 0,
      change: category.length > 0 
        ? `${category[0]?.name || ""}, ${category[1]?.name || ""}, etc...` 
        : "Sin categorías registradas",
      icon: "category",
      iconColor: "bg-surface-container-highest text-on-surface-variant",
    },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-on-background">
      {/* Header Fijo */}
      <Header />
      
      {/* Contenedor del Layout - pt-16 compensa exactamente el alto del Header (h-16) */}
      <div className="flex flex-1 pt-16 overflow-hidden">
        
        {/* Navigation Drawer (Desktop) */}
        <aside className="hidden md:flex flex-col h-[calc(100vh-64px)] w-72 bg-surface-container-low border-r border-outline-variant py-md z-30 shrink-0">
          <nav className="flex-1 space-y-1">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={index}
                  to={item.path}
                  className={
                    isActive
                      ? "bg-primary-container text-on-primary-container rounded-full mx-2 my-1 px-4 py-3 flex items-center gap-md translate-x-1 transition-transform cursor-pointer"
                      : "text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-full mx-2 my-1 px-4 py-3 flex items-center gap-md cursor-pointer"
                  }
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="text-label-md font-label-md">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area - Scroll independiente */}
        <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-y-auto min-w-0">
          <main className="flex-1 px-margin-mobile py-stack-lg md:px-margin-desktop md:py-stack-lg space-y-lg max-w-7xl mx-auto w-full mb-24 md:mb-0">
            
            {/* Welcome Section */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-md">
              <div>
                <p className="text-body-md font-body-md text-on-surface-variant">
                  Welcome back, Admin
                </p>
                <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface">
                  Overview for today
                </h2>
              </div>
            </section>

            {/* Tarjetas de Métricas */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mt-4">
              {statsCards.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-surface-container-lowest border border-outline-variant p-card rounded-2xl shadow-sm flex flex-col justify-between gap-stack-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-body-sm font-semibold text-on-surface-variant">
                      {card.title}
                    </span>
                    <div className={`p-2 rounded-xl flex items-center justify-center ${card.iconColor}`}>
                      <span className="material-symbols-outlined text-body-lg">
                        {card.icon}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-headline-md font-bold text-on-surface">
                      {card.value}
                    </h3>
                    <p className="text-label-sm text-outline mt-1">
                      {card.change}
                    </p>
                  </div>
                </div>
              ))}
            </section>

            {/* Reportes Pendientes */}
            <section className="space-y-stack-md mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-headline-sm text-on-surface font-semibold">
                  Estado de reportes
                </h3>
                <Link
                  to="/reports"
                  className="text-label-md text-primary hover:underline flex items-center gap-1"
                >
                  Ver todos
                  <span className="material-symbols-outlined text-body-sm">
                    arrow_forward
                  </span>
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-stack-sm mt-4">
                {pendientes && pendientes
                  .filter((report) => report.status === "PENDING")
                  .map((report, index) => (
                    <div
                      key={index}
                      className="bg-surface-container-lowest border border-outline-variant p-card rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-md hover:border-outline transition-colors"
                    >
                      {/* Report Info */}
                      <div className="space-y-1 max-w-2xl">
                        <div className="flex items-center gap-xs flex-wrap">
                          <span className="text-label-sm font-bold text-outline">
                            {report.student?.full_name}
                          </span>
                          <span className="text-outline-variant">•</span>
                          <span className="text-body-sm font-semibold text-on-surface">
                            {report.student?.document_number}
                          </span>
                          <span className="text-outline-variant">•</span>
                          <span className="text-body-sm text-on-surface-variant">
                            {report.category?.name}
                          </span>
                        </div>
                        <p className="text-body-md text-on-surface line-clamp-1">
                          {report.description}
                        </p>
                      </div>

                      {/* Report Status */}
                      <div className="flex items-center justify-between sm:justify-end gap-md shrink-0">
                        <span className="text-label-sm text-outline">
                          {report.updated_at}
                        </span>
                        <BadgeState estado={report.status} />
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          </main>

          {/* Bottom Navigation Bar (Mobile only) */}
          <FooterMobile />
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;