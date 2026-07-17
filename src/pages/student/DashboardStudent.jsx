import FooterMobile from "../../components/common/FooterMobile";
import PdfUploader from "../../components/reports/PdfUploader";
import { useState } from "react";
import Header from "../../components/common/Header";

export default function DashboardStudent() {
  const [showUploader, setShowUploader] = useState(false);
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
  const handleUploadSuccess = (data) => {
    console.log("¡Archivo subido con éxito!", data);
    alert("El reporte se ha enviado correctamente al servidor.");
    setShowUploader(false); // Ocultar después de subir con éxito
  };

  return (
    <div className="min-h-screen bg-background text-on-background transition-colors duration-200">
      <Header />

      {/* --- Main Content --- */}
      <main className="pt-24 pb-32 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
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
        {/* --- Sección de Prueba Dinámica de PDF --- */}
        {showUploader && (
          <section className="mb-lg p-lg bg-surface border border-primary/30 rounded-xl shadow-inner relative">
            <button
              onClick={() => setShowUploader(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-error cursor-pointer"
            >
              Cerrar (X)
            </button>
            <h3 className="text-headline-sm text-primary mb-md">
              Subir Reporte PDF de Prueba
            </h3>
            <div className="max-w-xl mx-auto">
              {/* 👉 RETIRAMOS entityId="1" para que funcione en modo CREACIÓN (POST)
               */}
              <PdfUploader onUploadSuccess={handleUploadSuccess} />
            </div>
          </section>
        )}

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
                mantener tu progreso actualizado.
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

          {/* Mis Reportes Quick Access */}
          <div className="md:col-span-12 bg-surface border border-outline-variant rounded-xl p-lg">
            <div className="flex justify-between items-center mb-lg">
              <h3 className="text-headline-sm text-primary">
                Mis Reportes Recientes
              </h3>
              <button className="text-primary font-label-md hover:underline flex items-center gap-xs cursor-pointer">
                Ver todos{" "}
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
      <FooterMobile />
    </div>
  );
}
