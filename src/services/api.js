import axios from 'axios';

// 1. Instancia centralizada
export const funvalServices = axios.create({
  baseURL: "/api", // Este "/api" se comunicará con tu proxy en Vercel
  withCredentials: true, // ESENCIAL: Permite el envío de cookies/sesión
  headers: {
    'Content-Type': 'application/json',
  }
});

// 2. Interceptor de respuesta mejorado
funvalServices.interceptors.response.use(
  (response) => response, // Retornamos la respuesta tal cual
  (error) => {
    // Si el error no tiene objeto response (ej. servidor caído/timeout), detenemos la ejecución
    if (!error.response) {
      console.error("Error de red o servidor no disponible:", error);
      return Promise.reject(error);
    }

    const { status } = error.response;

    // Manejo global según tu rúbrica
    switch (status) {
      case 401:
        console.warn("Sesión expirada o no autorizada.");
        window.location.href = '/login';
        break;
      case 403:
        alert("No tienes permiso para realizar esta acción");
        break;
      case 404:
        console.error("El recurso solicitado no existe.");
        break;
      case 409:
      case 422:
        console.error("Error de validación o conflicto de datos.");
        break;
      default:
        console.error(`Error inesperado: ${status}`);
    }
    
    return Promise.reject(error);
  }
);