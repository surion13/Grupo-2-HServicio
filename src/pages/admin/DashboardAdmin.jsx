import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import FooterMobile from "../../components/common/FooterMobile";
import Header from "../../components/common/Header";
import { useLocation, Link } from "react-router-dom";

function DashboardAdmin() {
  const { logout } = useContext(AuthContext);

  const navItems = [
    { label: "Dashboard", icon: "dashboard", path: "/dashboard" },
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

  const submissions = [
    {
      initialcheck: "JM",
      name: "Juan Martínez",
      date: "Oct 24, 2023",
      subject: "Math Dept Survey",
      status: "Pending",
      statusColor: "bg-amber-100 text-amber-800",
    },
    {
      initialcheck: "SP",
      name: "Sofía Pérez",
      date: "Oct 23, 2023",
      subject: "Field Trip Attendance",
      status: "Approved",
      statusColor: "bg-emerald-100 text-emerald-800",
    },
  ];

  return (
    <div>
      <Header />
      <div className="flex min-h-screen overflow-hidden">
        {/* Navigation Drawer (Desktop) */}
        <aside className="hidden md:flex flex-col h-screen w-72 bg-surface-container-low border-r border-outline-variant py-md z-40 shrink-0 mt-10">
          <nav className="flex-1 space-y-1">
            {navItems.map((item, index) => {
              // Comprobamos si el enlace actual coincide con la URL del navegador
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
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0 mt-16 px-4">
          {/* Main Section */}
          <main className="flex-1 p-container-margin-mobile md:p-container-margin-desktop space-y-lg max-w-7xl mx-auto w-full mb-24 md:mb-0">
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
              <div className="flex gap-sm">
                <button className="flex items-center gap-xs px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md hover:opacity-90 transition-all">
                  <span className="material-symbols-outlined text-[18px]">
                    add
                  </span>
                  New Report
                </button>
                <button className="flex items-center gap-xs px-4 py-2 rounded-lg bg-surface-container-high border border-outline-variant text-on-surface font-label-md hover:bg-surface-container-highest transition-all">
                  <span className="material-symbols-outlined text-[18px]">
                    download
                  </span>
                  Export
                </button>
              </div>
            </section>

            {/* Key Metrics Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
              {/* Metric 1 */}
              <div className="glass-card p-lg rounded-xl flex items-start justify-between">
                <div className="space-y-sm">
                  <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                    Reportes Pendientes
                  </p>
                  <h3 className="text-headline-lg font-headline-lg text-on-surface">
                    24
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-error-container flex items-center justify-center text-on-error-container">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    assignment_late
                  </span>
                </div>
              </div>
              {/* Metric 3 */}
              <div className="glass-card p-lg rounded-xl flex items-start justify-between sm:col-span-2 lg:col-span-1">
                <div className="space-y-sm">
                  <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                    Horas Totales Registradas
                  </p>
                  <h3 className="text-headline-lg font-headline-lg text-on-surface">
                    8,640
                  </h3>
                  <div className="flex items-center gap-xs text-on-surface-variant font-label-sm">
                    <span className="material-symbols-outlined text-[16px]">
                      schedule
                    </span>
                    <span>Monthly total</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    history
                  </span>
                </div>
              </div>
            </section>

            {/* Main Bento Layout */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-md">
              {/* Chart Section */}
              <div className="lg:col-span-2 glass-card rounded-xl p-lg space-y-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-headline-sm font-headline-sm">
                    Tendencia de Reportes
                  </h3>
                  <select className="text-label-sm font-label-sm bg-surface border-outline-variant rounded-lg focus:ring-primary">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                  </select>
                </div>
                <div className="flex justify-between text-label-sm text-outline px-1">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <span key={day}>{day}</span>
                    ),
                  )}
                </div>
              </div>

              {/* Quick Links / Recent Activity */}
              {/*  <div className="space-y-md">
                <div className="glass-card rounded-xl p-lg">
                  <h3 className="text-label-md font-label-md text-on-surface-variant mb-md uppercase tracking-wider">
                    Quick Actions
                  </h3>
                  <div className="space-y-sm">
                    {[
                      { text: "Revisar Reportes", icon: "rule" },
                      { text: "Gestión de Usuarios", icon: "person_search" },
                    ].map((action, i) => (
                      <a
                        key={i}
                        className="flex items-center justify-between p-md rounded-lg hover:bg-primary-container hover:text-on-primary-container group transition-all border border-outline-variant"
                        href="#"
                      >
                        <div className="flex items-center gap-md">
                          <span className="material-symbols-outlined text-primary group-hover:text-on-primary-container">
                            {action.icon}
                          </span>
                          <span className="text-body-sm font-label-md">
                            {action.text}
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-[20px]">
                          chevron_right
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div> */}
            </section>

            {/* Submissions Table Section */}
            <section className="glass-card rounded-xl overflow-hidden shadow-sm">
              <div className="px-lg py-md border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
                <h3 className="text-headline-sm font-headline-sm">
                  Submissions Log
                </h3>
                <button className="text-primary text-label-md hover:underline">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low text-on-surface-variant text-label-sm uppercase tracking-wider">
                    <tr>
                      {["User", "Date", "Subject", "Status", "Action"].map(
                        (th) => (
                          <th key={th} className="px-lg py-4">
                            {th}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {submissions.map((sub, i) => (
                      <tr
                        key={i}
                        className="hover:bg-surface-container-low transition-colors"
                      >
                        <td className="px-lg py-4">
                          <div className="flex items-center gap-sm">
                            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs">
                              {sub.initialcheck}
                            </div>
                            <span className="text-body-sm font-label-md">
                              {sub.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-lg py-4 text-body-sm text-on-surface-variant">
                          {sub.date}
                        </td>
                        <td className="px-lg py-4 text-body-sm font-label-md">
                          {sub.subject}
                        </td>
                        <td className="px-lg py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${sub.statusColor}`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-lg py-4">
                          <button className="text-primary material-symbols-outlined hover:bg-primary-container/10 p-1 rounded-full">
                            visibility
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
