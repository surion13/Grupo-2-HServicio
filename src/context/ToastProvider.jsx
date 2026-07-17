import { useState } from "react";
import { ToastContext } from "./ToastContext";
//
function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    function showToast(message, type = "success") {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 4000);
    }

    function removeToast(id) {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }

    // Rafa: Helper para mapear dinámicamente las clases del sistema de diseño según el tipo de Toast
    const getToastStyles = (type) => {
        switch (type) {
            case "success":
                return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "error":
                return "bg-error-container text-error border-error/20";
            case "warning":
                // Rafa: Añadido soporte para tokens de advertencia (Estilo estándar de sistemas basados en Material Design)
                return "bg-warning-container text-warning border-warning/20"; 
            case "info":
            default:
                return "bg-surface text-on-surface border-outline-variant";
        }
    };

    // Rafa: Helper para asignar el icono correcto de Material Symbols
    const getToastIcon = (type) => {
        switch (type) {
            case "success":
                return "check_circle";
            case "error":
                return "error";
            case "warning":
                return "warning";
            case "info":
            default:
                return "info";
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Contenedor flotante de notificaciones */}
            <div className="fixed bottom-5 right-5 z-100 flex flex-col gap-2 max-w-sm w-full">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center justify-between p-4 rounded-lg shadow-lg border transition-all duration-300 ${
                            getToastStyles(toast.type)}`}
                    >
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined">
                                {getToastIcon(toast.type)}
                            </span>
                            <span className="font-label-md text-label-md">{toast.message}</span>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container-high transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export {ToastProvider}