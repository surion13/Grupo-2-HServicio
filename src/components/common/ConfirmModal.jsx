import { useEffect } from "react";

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  isLoading = false,
}) {
  // Evitar el scroll del fondo cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      // Añade la clase 'overflow-hidden' de Tailwind al body
      document.body.classList.add("overflow-hidden");
    } else {
      // La remueve cuando el modal se cierra
      document.body.classList.remove("overflow-hidden");
    }

    // Limpieza al desmontar el componente (evita que el body quede bloqueado)
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  // Cerrar el modal si se presiona la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md">
      {/* Fondo oscuro translúcido (Overlay) */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onCancel}
      />

      {/* Contenedor del Modal */}
      <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-surface text-on-surface border border-outline-variant p-lg shadow-xl transition-all z-10">
        {/* Cabecera / Título */}
        <div className="flex items-start gap-md">
          {/* Icono de advertencia en rojo semántico */}
          <div className="mx-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-container text-error sm:mx-0">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>

          <div className="mt-xs text-left">
            <h3 className="text-headline-sm font-semibold leading-6 text-on-surface">
              {title}
            </h3>

            {/* Mensaje */}
            <div className="mt-sm">
              <p className="text-body-sm text-on-surface-variant font-sans">
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="mt-lg flex flex-col-reverse sm:flex-row sm:justify-end gap-sm">
          {/* Botón Cancelar */}
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full sm:w-auto px-md py-xs text-label-md font-sans border border-outline rounded-default bg-surface text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>

          {/* Botón Confirmar (Rojo Destructivo usando variables de error) */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto px-md py-xs text-label-md font-sans rounded-default bg-error text-on-error hover:bg-error/90 shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-on-error"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Procesando...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
