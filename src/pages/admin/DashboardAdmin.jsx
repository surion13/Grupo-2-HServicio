import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import FooterMobile from "../../components/common/FooterMobile";
import Header from "../../components/common/Header";
import { useLocation, Link } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { dashboardService } from "../../services/funvalApi";
import { useState } from "react";
import { useEffect } from "react";

function DashboardAdmin() {
  const { logout } = useContext(AuthContext);

  const {
    loading,
    error,
    execute: dashboard,
  } = useApi(dashboardService.getStats);

  const [datos, setDatos] = useState([]);
  const [reports, setReports] = useState([]);
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    async function traerDatos() {
      try {
        const response = await dashboard();
        setDatos(response.users);
        setReports(response.reports);
        setCourses(response.top_courses);
        setCategory(response.top_categories);
      } catch (error) {
        console.error(error);
      }
    }
    traerDatos();
  }, []);

  const navItems = [
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

  const location = useLocation();

  const statsCards = [
    {
      title: "Estudiantes",
      value: datos.total_students,
      change: "0 estudiantes nuevos",
      icon: "group",
      iconColor: "bg-primary-container text-on-primary-container",
    },
    {
      title: "Total Reportes",
      value: reports.total,
      change: `${reports.pending} reportes pendientes`,
      icon: "assignment_late",
      iconColor: "bg-error-container text-on-error-container",
    },
    {
      title: "Cursos Activos",
      value: courses.length,
      change: "3 cursos nuevos en proceso",
      icon: "school",
      iconColor: "bg-secondary-container text-on-secondary-container",
    },
    {
      title: "Categorías Activas",
      value: category.length,
      change: `${category[0]?.name}, ${category[1]?.name}, etc..`,
      icon: "category",
      iconColor: "bg-surface-container-highest text-on-surface-variant",
    },
  ];

  const pendingReports = [
    {
      id: "REP-094",
      student: "Lucas Benítez",
      category: "Infraestructura",
      date: "Hace 10 mins",
      description: "Filtración de agua detectada en el laboratorio de química.",
    },
    {
      id: "REP-093",
      student: "Sofía Altamirano",
      category: "Conducta",
      date: "Hace 1 hora",
      description: "Inasistencia reiterada y falta de entrega de asignaciones.",
    },
    {
      id: "REP-092",
      student: "Mateo Salazar",
      category: "Académico",
      date: "Ayer",
      description:
        "Problema técnico con el acceso a la plataforma de exámenes.",
    },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-on-background">
      {/* Header Fijo */}
      <Header />
      {/* Contenedor del Layout - pt-16 compensa exactamente el alto del Header (h-16) */}
      <div className="flex flex-1 pt-16 overflow-hidden">
        {/* Navigation Drawer (Desktop) - Alto dinámico exacto sin mt extra */}
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
          {/* Main Section */}
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
                    <div
                      className={`p-2 rounded-xl flex items-center justify-center ${card.iconColor}`}
                    >
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
                  Reportes pendientes de revisión
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
                {pendingReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-surface-container-lowest border border-outline-variant p-card rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-md hover:border-outline transition-colors"
                  >
                    {/* Report Info */}
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-xs flex-wrap">
                        <span className="text-label-sm font-bold text-outline">
                          {report.id}
                        </span>
                        <span className="text-outline-variant">•</span>
                        <span className="text-body-sm font-semibold text-on-surface">
                          {report.student}
                        </span>
                        <span className="text-outline-variant">•</span>
                        <span className="text-body-sm text-on-surface-variant">
                          {report.category}
                        </span>
                      </div>
                      <p className="text-body-md text-on-surface line-clamp-1">
                        {report.description}
                      </p>
                    </div>

                    {/* Report Status */}
                    <div className="flex items-center justify-between sm:justify-end gap-md shrink-0">
                      <span className="text-label-sm text-outline">
                        {report.date}
                      </span>
                      <span className="bg-status-pending-bg text-status-pending-text px-sm py-1 rounded-full text-label-sm font-bold uppercase tracking-wider">
                        PENDING
                      </span>
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
