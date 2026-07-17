import { useState, useEffect, useRef } from "react";
import FooterMobile from "../../components/common/FooterMobile";
import PdfUploader from "../../components/reports/PdfUploader";
import Header from "../../components/common/Header";
import Spinner from "../../components/common/Spinners";
import BadgeState from "../../components/common/BadgeState";
import Pagination from "../../components/common/Pagination";
import { reportService, dashboardService } from "../../services/funvalApi";
import useApi from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";

export default function DashboardStudent() {
  const [showUploader, setShowUploader] = useState(false);
  const [loadingEvidenceId, setLoadingEvidenceId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); 
  const [isAllViewActive, setIsAllViewActive] = useState(false);
  const preAllViewSize = useRef(5); // Guarda el tamaño anterior de página para restaurarlo
  const { showToast } = useToast();

  // 1. Petición para las estadísticas globales
  const {
    loading: loadingStats,
    data: stats,
    execute: fetchStats,
  } = useApi(dashboardService.getStats);

  // 2. Petición para el listado de reportes individuales
  const {
    loading: loadingReports,
    data: reportsData,
    execute: fetchReports,
  } = useApi(reportService.list);

  // Unificamos el ciclo de vida en un único efecto controlado
  useEffect(() => {
    let isMounted = true;

    const cargarDatosDashboard = async () => {
      try {
        if (isMounted) {
          await Promise.all([
            fetchStats(),
            fetchReports(page, pageSize)
          ]);
        }
      } catch (err) {
        console.error("Error al sincronizar el Dashboard:", err);
        if (isMounted) {
          showToast("No se pudo sincronizar la información de tu cuenta.", "error");
        }
      }
    };

    cargarDatosDashboard();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  // 3. Gestión de Visualización de Evidencia con Fallback
  const handleViewEvidence = async (reporte) => {
    setLoadingEvidenceId(reporte.id);
    try {
      const blobData = await reportService.streamEvidencePdf(reporte.id);
      const fileURL = URL.createObjectURL(blobData);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.warn("Fallo el streaming del PDF. Iniciando estrategia de fallback...", error);

      if (reporte.web_view_link) {
        window.open(reporte.web_view_link, "_blank");
      } else {
        try {
          const fallbackData = await reportService.getEvidenceLink(reporte.id);

          if (fallbackData?.web_view_link) {
            window.open(fallbackData.web_view_link, "_blank");
          } else {
            showToast("No se encontró ningún enlace de evidencia disponible.", "error");
          }
        } catch (fallbackError) {
          console.error("Fallo definitivo al recuperar la evidencia:", fallbackError);
          showToast("No se pudo abrir la evidencia de este reporte.", "error");
        }
      }
    } finally {
      setLoadingEvidenceId(null);
    }
  };

  const handleUploadSuccess = () => {
    showToast("El reporte se ha enviado correctamente.", "success");
    setShowUploader(false);
    fetchStats();
    if (page === 1) {
      fetchReports(1, pageSize);
    } else {
      setPage(1);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setPage(1);
    setIsAllViewActive(false); // Salir del modo "Ver todos" si cambia manualmente
  };

  // Alterna entre ver todos los registros y la paginación normal
  const toggleVerTodos = () => {
    if (isAllViewActive) {
      // Restaurar paginación previa
      setPageSize(preAllViewSize.current);
      setPage(1);
      setIsAllViewActive(false);
    } else {
      // Guardar el tamaño actual antes de ir a "Ver todos"
      preAllViewSize.current = pageSize;
      const totalItems = reportsData?.total || 100;
      setPageSize(totalItems);
      setPage(1);
      setIsAllViewActive(true);
    }
  };

  const normalizarEstado = (estadoRaw) => {
    if (!estadoRaw) return "PENDING";
    return estadoRaw.toUpperCase().trim();
  };

  const formatearFecha = (fechaString) => {
    if (!fechaString) return "";
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Mapeo de variables basado en stats.reports
  const totalRequerido = 120;
  const horasReportadas = stats?.reports?.total_hours_submitted || 0;
  const horasAprobadas = stats?.reports?.total_hours_approved || 0;
  const horasPendientes = stats?.reports?.pending || 0;
  const horasRechazadas = stats?.reports?.rejected || 0;

  const porcentajeAprobacion =
    horasReportadas > 0
      ? Math.round((horasAprobadas / horasReportadas) * 100)
      : 0;

  const porcentajeProgreso = Math.min(
    Math.round((horasAprobadas / totalRequerido) * 100),
    100,
  );
  const strokeDasharray = 439.8;
  const strokeDashoffset =
    strokeDasharray - (strokeDasharray * porcentajeProgreso) / 100;

  const listaReportes = reportsData?.items || [];
  const totalReportes = reportsData?.total || 0;

  return (
    <div className="min-h-screen bg-background text-on-background transition-colors duration-200">
      <Header />

      <main className="pt-28 pb-32 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto flex flex-col gap-lg">
        {/* Welcome Message */}
        <section className="flex flex-col gap-xs">
          <h2 className="text-headline-lg-mobile md:text-headline-lg text-primary font-bold">
            Hola, {stats?.studentName || "Estudiante"}
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Aquí tienes el resumen de tu progreso académico y reportes recientes.
          </p>
        </section>

        {/* Sección de Subida de PDF */}
        {showUploader && (
          <section className="p-lg bg-surface border border-primary/30 rounded-xl shadow-inner relative animate-fadeIn">
            <button
              onClick={() => setShowUploader(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-error cursor-pointer flex items-center gap-xs font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                close
              </span>
              Cerrar
            </button>
            <h3 className="text-headline-sm text-primary mb-md font-bold">
              Subir Reporte PDF de Actividad
            </h3>
            <div className="max-w-xl mx-auto">
              <PdfUploader onUploadSuccess={handleUploadSuccess} />
            </div>
          </section>
        )}

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
          {/* Card: Progreso del Curso */}
          <div className="md:col-span-4 bg-surface border border-outline-variant rounded-xl p-lg flex flex-col justify-between items-center relative overflow-hidden min-h-[320px]">
            <div className=" p-4 w-full flex justify-between items-start mb-sm">
              <h3 className="text-label-md text-on-surface-variant font-bold uppercase tracking-wider">
                PROGRESO DEL CURSO
              </h3>
              <span
                className="material-symbols-outlined text-[24px] text-primary/40"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                analytics
              </span>
            </div>

            {loadingStats ? (
              <div className="flex-1 flex items-center justify-center">
                <Spinner fullScreen={false} size="w-10 h-10" />
              </div>
            ) : (
              <div className=" p-4 relative flex items-center justify-center my-md">
                <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
                  <circle
                    className="text-surface-container-highest"
                    cx="80"
                    cy="80"
                    fill="transparent"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                  ></circle>
                  <circle
                    className="text-primary transition-all duration-500 ease-out"
                    cx="80"
                    cy="80"
                    fill="transparent"
                    r="70"
                    stroke="currentColor"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    strokeWidth="12"
                  ></circle>
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-headline-md text-primary font-black">
                    {porcentajeProgreso}%
                  </span>
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">
                    Completado
                  </span>
                </div>
              </div>
            )}

            <div className="text-center w-full">
              <p className="text-body-md font-bold text-on-surface">
                <span className="text-primary font-black">{horasAprobadas} Horas</span> aprobadas
              </p>
              <p className="text-body-sm text-on-surface-variant">
                de {totalRequerido} requeridas
              </p>
            </div>
          </div>

          {/* Card: Nuevo Reporte */}
          <div
            onClick={() => setShowUploader(true)}
            className="md:col-span-8 bg-primary-container text-white rounded-xl p-lg flex flex-col justify-between relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.005] min-h-[320px]"
          >
            {/* Círculo decorativo */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary opacity-30 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
            
            <div className="relative z-10 flex flex-col gap-md max-w-xl">
              <div className="bg-secondary-container/20 text-white inline-flex p-sm rounded-xl self-start">
                <span
                  className="material-symbols-outlined text-[28px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  add_circle
                </span>
              </div>
              <div className="p-4 flex flex-col gap-xs">
                <h3 className="text-headline-md font-black tracking-tight leading-tight">
                  Nuevo Reporte de Actividad
                </h3>
                <p className="text-body-md text-white/80 font-medium leading-relaxed">
                  Registra tus horas de servicio o actividades educativas hoy para
                  mantener tu progreso actualizado de manera segura.
                </p>
              </div>
            </div>

            <div className="relative z-10 flex justify-end mt-md">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUploader(true);
                }}
                className="bg-white text-primary font-bold px-lg py-md rounded-full shadow-md hover:bg-surface-bright transition-all duration-200 flex items-center gap-sm cursor-pointer hover:translate-x-1"
              >
                Comenzar Ahora
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Grid de Cards Métricas */}
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-md">
          <div className="bg-surface border border-outline-variant p-lg rounded-xl text-center flex flex-col items-center justify-center gap-xs">
            <span className="material-symbols-outlined text-primary text-[28px]">
              history
            </span>
            <p className="text-body-sm text-on-surface-variant font-medium">Reportadas</p>
            <p className="text-headline-sm font-black text-on-surface">
              {loadingStats ? "..." : horasReportadas}
            </p>
          </div>
          <div className="bg-surface border border-outline-variant p-lg rounded-xl text-center flex flex-col items-center justify-center gap-xs">
            <span className="material-symbols-outlined text-status-approved-text text-[28px]">
              check_circle
            </span>
            <p className="text-body-sm text-on-surface-variant font-medium">Aprobadas</p>
            <p className="text-headline-sm font-black text-status-approved-text">
              {loadingStats ? "..." : horasAprobadas}
            </p>
          </div>
          <div className="bg-surface border border-outline-variant p-lg rounded-xl text-center flex flex-col items-center justify-center gap-xs">
            <span className="material-symbols-outlined text-status-pending-text text-[28px]">
              pending
            </span>
            <p className="text-body-sm text-on-surface-variant font-medium">Pendientes</p>
            <p className="text-headline-sm font-black text-status-pending-text">
              {loadingStats ? "..." : horasPendientes}
            </p>
          </div>
          <div className="bg-surface border border-outline-variant p-lg rounded-xl text-center flex flex-col items-center justify-center gap-xs">
            <span className="material-symbols-outlined text-status-rejected-text text-[28px]">
              cancel
            </span>
            <p className="text-body-sm text-on-surface-variant font-medium">Rechazadas</p>
            <p className="text-headline-sm font-black text-status-rejected-text">
              {loadingStats ? "..." : horasRechazadas}
            </p>
          </div>
          <div className="bg-surface border border-outline-variant p-lg rounded-xl text-center flex flex-col items-center justify-center gap-xs col-span-2 sm:col-span-1">
            <span className="material-symbols-outlined text-secondary text-[28px]">
              percent
            </span>
            <p className="text-body-sm text-on-surface-variant font-medium">% Aprobación</p>
            <p className="text-headline-sm font-black text-on-surface">
              {loadingStats ? "..." : `${porcentajeAprobacion}%`}
            </p>
          </div>
        </section>

        {/* Sección: Mis Reportes Recientes */}
        <div className="p-4 bg-surface border border-outline-variant rounded-xl p-lg flex flex-col gap-lg">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-md">
            <h3 className="text-headline-sm text-primary font-bold">
              Mis Reportes Recientes
            </h3>
            
            {/* Controles de Vista */}
            <div className="flex items-center flex-wrap gap-md">
              <div className="flex items-center gap-xs">
                <span className="text-body-sm text-on-surface-variant font-bold">Mostrar:</span>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="bg-surface border border-outline rounded-xl px-sm py-xs text-body-sm text-on-surface cursor-pointer focus:outline-primary transition-all font-semibold"
                >
                  <option value={5}>5 por pág.</option>
                  <option value={10}>10 por pág.</option>
                  <option value={20}>20 por pág.</option>
                  <option value={50}>50 por pág.</option>
                </select>
              </div>

              <button 
                onClick={toggleVerTodos}
                className="text-primary font-bold text-body-sm hover:underline flex items-center gap-xs cursor-pointer bg-transparent border-none py-1 px-sm rounded-lg hover:bg-primary/5 transition-all"
              >
                {isAllViewActive ? (
                  <>
                    Mostrar paginado
                    <span className="material-symbols-outlined text-[18px]">
                      filter_list
                    </span>
                  </>
                ) : (
                  <>
                    Ver todos{" "}
                    <span className="material-symbols-outlined text-[18px]">
                      open_in_new
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-md">
            {loadingReports ? (
              <div className="py-lg flex items-center justify-center">
                <Spinner fullScreen={false} size="w-10 h-10" />
              </div>
            ) : listaReportes.length === 0 ? (
              <div className="text-center py-lg text-on-surface-variant font-medium">
                No tienes reportes registrados recientemente.
              </div>
            ) : (
              <>
                <div className="space-y-md">
                  {listaReportes.map((reporte) => (
                    <div
                      key={reporte.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-md bg-surface-container-low border border-outline-variant rounded-xl hover:bg-surface-container transition-colors gap-md animate-fadeIn"
                    >
                      <div className="flex items-center gap-md">
                        <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center text-primary shrink-0">
                          <span
                            className="material-symbols-outlined"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            description
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-on-surface line-clamp-1 max-w-md">
                            {reporte.description || "Reporte sin descripción"}
                          </h4>
                          <p className="text-body-sm text-on-surface-variant font-medium">
                            {formatearFecha(reporte.created_at)} •{" "}
                            {reporte.category?.name || "General"} •{" "}
                            {reporte.hours_spent} Horas
                          </p>
                        </div>
                      </div>

                      {/* Contenedor de Estados y Acciones */}
                      <div className="mt-sm md:mt-0 flex flex-wrap items-center gap-md">
                        <button
                          onClick={() => handleViewEvidence(reporte)}
                          disabled={loadingEvidenceId !== null}
                          className="px-sm py-2 bg-surface-container-highest hover:bg-primary-container hover:text-on-primary-container text-on-surface-variant text-label-sm font-bold rounded-lg flex items-center gap-xs border border-outline-variant transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {loadingEvidenceId === reporte.id ? (
                            <span className="animate-spin material-symbols-outlined text-[16px]">
                              sync
                            </span>
                          ) : (
                            <span className="material-symbols-outlined text-[16px]">
                              visibility
                            </span>
                          )}
                          Ver evidencia
                        </button>

                        <BadgeState estado={normalizarEstado(reporte.status)} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Integración de Pagination (Oculta si "Ver todos" está activo) */}
                {!isAllViewActive && (
                  <Pagination
                    page={page}
                    page_size={pageSize}
                    total={totalReportes}
                    onPageChange={(newPage) => setPage(newPage)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <FooterMobile />
    </div>
  );
}