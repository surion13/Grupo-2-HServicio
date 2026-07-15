import { useState } from "react";
import { ToastContext } from "./ToastContext"; // Importamos el contexto desde su nuevo archivo

export function ToastProvider({ children }) {
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

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Contenedor flotante de notificaciones */}
            <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm w-full">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center justify-between p-4 rounded-lg shadow-lg border transition-all duration-300 ${
                            toast.type === "success"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : toast.type === "error"
                                ? "bg-error-container text-error border-error/20"
                                : "bg-surface text-on-surface border-outline-variant"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined">
                                {toast.type === "success" ? "check_circle" : toast.type === "error" ? "error" : "info"}
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