import { useState, useEffect } from "react";
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
  // Estado dinámico para el tamaño de página (por defecto 5)
  const [pageSize, setPageSize] = useState(5); 
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

  // Cargar estadísticas globales únicamente al montar el componente
  useEffect(() => {
    fetchStats().catch((err) => {
      console.error("Error cargando estadísticas del estudiante:", err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recargar el listado de reportes de manera reactiva cada vez que cambie la página o el tamaño de página
  useEffect(() => {
    fetchReports(page, pageSize).catch((err) => {
      console.error("Error cargando el listado de reportes:", err);
      showToast("No se pudo sincronizar la información de tus reportes.", "error");
    });
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

  const handleUploadSuccess = (data) => {
    console.log("¡Archivo subido con éxito!", data);
    showToast("El reporte se ha enviado correctamente.", "success");
    setShowUploader(false);
    fetchStats();
    if (page === 1) {
      fetchReports(1, pageSize);
    } else {
      setPage(1);
    }
  };

  // Manejador del cambio de tamaño de página
  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setPage(1); // Regresamos siempre a la página 1 para evitar inconsistencias
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

      <main className="pt-24 pb-32 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
        {/* Welcome Message */}
        <section className="mb-lg">
          <h2 className="text-headline-lg-mobile md:text-headline-lg text-primary">
            Hola, {stats?.studentName || "Estudiante"}
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Aquí tienes el resumen de tu progreso académico y reportes recientes.
          </p>
        </section>

        {/* Sección de Subida de PDF */}
        {showUploader && (
          <section className="mb-lg p-lg bg-surface border border-primary/30 rounded-xl shadow-inner relative animate-fadeIn">
            <button
              onClick={() => setShowUploader(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-error cursor-pointer flex items-center gap-xs font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">
                close
              </span>
              Cerrar
            </button>
            <h3 className="text-headline-sm text-primary mb-md">
              Subir Reporte PDF de Actividad
            </h3>
            <div className="max-w-xl mx-auto">
              <PdfUploader onUploadSuccess={handleUploadSuccess} />
            </div>
          </section>
        )}

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg mb-lg">
          {/* Progreso del Curso */}
          <div className="md:col-span-4 bg-surface border border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-md opacity-10 dark:opacity-20">
              <span
                className="material-symbols-outlined text-[64px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                analytics
              </span>
            </div>
            <h3 className="text-label-md text-on-surface-variant self-start mb-lg font-sans">
              PROGRESO DEL CURSO
            </h3>

            {loadingStats ? (
              <div className="w-40 h-40 flex items-center justify-center">
                <Spinner fullScreen={false} size="w-12 h-12" />
              </div>
            ) : (
              <div className="relative flex items-center justify-center mb-md">
                <svg className="w-40 h-40 transform -rotate-90">
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
                <div className="absolute flex flex-col items-center">
                  <span className="text-headline-md text-primary font-bold">
                    {porcentajeProgreso}%
                  </span>
                  <span className="text-label-sm text-on-surface-variant uppercase">
                    Completado
                  </span>
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-body-md font-bold text-on-surface">
                <span className="text-primary">{horasAprobadas} Horas</span>{" "}
                aprobadas
              </p>
              <p className="text-body-sm text-on-surface-variant">
                de {totalRequerido} requeridas
              </p>
            </div>
          </div>

          {/* Nuevo Reporte Card */}
          <div
            onClick={() => setShowUploader(true)}
            className="md:col-span-8 bg-primary-container text-on-primary-container rounded-xl p-lg flex flex-col justify-between relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md"
          >
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
                mantener tu progreso actualizado de manera segura.
              </p>
            </div>
            <div className="relative z-10 mt-lg flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUploader(true);
                }}
                className="bg-white text-primary font-bold px-lg py-md rounded-full shadow-sm hover:bg-surface-bright transition-colors flex items-center gap-sm cursor-pointer"
              >
                Comenzar Ahora
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Grid de Cards Métricas */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-md mb-lg">
          <div className="bg-surface border border-outline-variant p-md rounded-xl text-center">
            <span className="material-symbols-outlined text-primary text-[28px] mb-xs">
              history
            </span>
            <p className="text-body-sm text-on-surface-variant">Reportadas</p>
            <p className="text-headline-sm font-bold text-on-surface">
              {loadingStats ? "..." : horasReportadas}
            </p>
          </div>
          <div className="bg-surface border border-outline-variant p-md rounded-xl text-center">
            <span className="material-symbols-outlined text-status-approved-text text-[28px] mb-xs">
              check_circle
            </span>
            <p className="text-body-sm text-on-surface-variant">Aprobadas</p>
            <p className="text-headline-sm font-bold text-status-approved-text">
              {loadingStats ? "..." : horasAprobadas}
            </p>
          </div>
          <div className="bg-surface border border-outline-variant p-md rounded-xl text-center">
            <span className="material-symbols-outlined text-status-pending-text text-[28px] mb-xs">
              pending
            </span>
            <p className="text-body-sm text-on-surface-variant">Pendientes</p>
            <p className="text-headline-sm font-bold text-status-pending-text">
              {loadingStats ? "..." : horasPendientes}
            </p>
          </div>
          <div className="bg-surface border border-outline-variant p-md rounded-xl text-center">
            <span className="material-symbols-outlined text-status-rejected-text text-[28px] mb-xs">
              cancel
            </span>
            <p className="text-body-sm text-on-surface-variant">Rechazadas</p>
            <p className="text-headline-sm font-bold text-status-rejected-text">
              {loadingStats ? "..." : horasRechazadas}
            </p>
          </div>
          <div className="bg-surface border border-outline-variant p-md rounded-xl text-center col-span-2 md:col-span-1">
            <span className="material-symbols-outlined text-secondary text-[28px] mb-xs">
              percent
            </span>
            <p className="text-body-sm text-on-surface-variant">% Aprobación</p>
            <p className="text-headline-sm font-bold text-on-surface">
              {loadingStats ? "..." : `${porcentajeAprobacion}%`}
            </p>
          </div>
        </section>

        {/* Sección: Mis Reportes Recientes */}
        <div className="bg-surface border border-outline-variant rounded-xl p-lg">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="text-headline-sm text-primary">
              Mis Reportes Recientes
            </h3>
            
            {/* Controles de vista */}
            <div className="flex items-center gap-md">
              <div className="flex items-center gap-xs">
                <span className="text-body-sm text-on-surface-variant font-sans">Mostrar:</span>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="bg-surface border border-outline rounded-default px-sm py-xs text-body-sm text-on-surface cursor-pointer focus:outline-primary"
                >
                  <option value={5}>5 por pág.</option>
                  <option value={10}>10 por pág.</option>
                  <option value={20}>20 por pág.</option>
                  <option value={50}>50 por pág.</option>
                </select>
              </div>

              <button className="text-primary font-label-md hover:underline flex items-center gap-xs cursor-pointer">
                Ver todos{" "}
                <span className="material-symbols-outlined text-[18px]">
                  open_in_new
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-md">
            {loadingReports ? (
              <div className="py-lg flex items-center justify-center">
                <Spinner fullScreen={false} size="w-10 h-10" />
              </div>
            ) : listaReportes.length === 0 ? (
              <div className="text-center py-lg text-on-surface-variant">
                No tienes reportes registrados recientemente.
              </div>
            ) : (
              <>
                <div className="space-y-md">
                  {listaReportes.map((reporte) => (
                    <div
                      key={reporte.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-md bg-surface-container-low border border-outline-variant rounded-lg hover:bg-surface-container transition-colors gap-md animate-fadeIn"
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
                          <h4 className="font-bold text-on-surface line-clamp-1 max-w-md">
                            {reporte.description || "Reporte sin descripción"}
                          </h4>
                          <p className="text-body-sm text-on-surface-variant">
                            {formatearFecha(reporte.created_at)} •{" "}
                            {reporte.category?.name || "General"} •{" "}
                            {reporte.hours_spent} Horas
                          </p>
                        </div>
                      </div>

                      {/* Contenedor de Estados y Acciones */}
                      <div className="mt-sm md:mt-0 flex flex-wrap items-center gap-md">
                        {/* Botón: Ver Evidencia */}
                        <button
                          onClick={() => handleViewEvidence(reporte)}
                          disabled={loadingEvidenceId !== null}
                          className="px-sm py-1 bg-surface-container-highest hover:bg-primary-container hover:text-on-primary-container text-on-surface-variant text-label-sm font-bold rounded-md flex items-center gap-xs border border-outline-variant transition-colors cursor-pointer disabled:opacity-50"
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

                {/* Integración del componente Pagination con pageSize dinámico */}
                <Pagination
                  page={page}
                  page_size={pageSize}
                  total={totalReportes}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </>
            )}
          </div>
        </div>
      </main>
      <FooterMobile />
    </div>
  );
}