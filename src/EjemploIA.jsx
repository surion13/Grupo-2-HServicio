// src/components/EjemploIA.jsx
import { useState } from 'react';

// 💡 PASO 1: Importar el hook genérico de peticiones y el servicio específico de la API.
import useApi from './hooks/useApi';
import { authService } from './services/funvalApi';

export default function EjemploIA() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * 💡 PASO 2: Inicializar el Hook `useApi`
   * * 1. Pasamos la función asíncrona del servicio SIN ejecutarla (sin paréntesis): authService.login
   * 2. Desestructuramos las variables de estado reactivas: { data, loading, error, execute }
   * 3. ⚠️ BUENA PRÁCTICA: Renombramos 'execute' usando alias (ej. 'loginExecute') para que sea descriptivo,
   * especialmente si usas múltiples hooks useApi en el mismo componente.
   */
  const { loading, error, execute: loginExecute } = useApi(authService.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      /**
       * 💡 PASO 3: Ejecutar la Petición
       * * Llamamos a la función renombrada 'loginExecute' pasando los argumentos requeridos.
       * El hook se encargará automáticamente de:
       * - Poner 'loading' en true antes de empezar.
       * - Guardar la respuesta en 'data' si todo sale bien.
       * - Guardar el mensaje de error en 'error' si algo falla.
       * - Apagar el 'loading' al finalizar.
       */
      await loginExecute(email, password);
      
      // Si llega aquí, la petición fue exitosa (código 2xx)
      alert("¡Inicio de sesión correcto!");
      
    } catch (err) {
      // El bloque catch local queda para flujos específicos del componente (ej. redirigir, limpiar inputs).
      // No necesitas guardar el error en un estado local aquí, ¡el hook ya lo hizo por ti en la variable 'error'!
      console.error("Error manejado localmente:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-on-background p-md transition-colors duration-300">
      <div className="w-full max-w-[400px] bg-surface-lowest border border-outline-variant rounded-lg p-lg shadow-md">
        
        {/* Encabezado */}
        <div className="text-center mb-lg">
          <h1 className="text-headline-md text-primary font-sans">
            Bienvenido de nuevo
          </h1>
          <p className="text-body-sm text-on-surface-variant mt-xs">
            Ingresa tus credenciales para acceder
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          
          {/* Input Email */}
          <div className="flex flex-col gap-xs">
            <label className="text-label-md text-on-surface">
              Correo electrónico
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="nombre@correo.com"
              required
              className="w-full p-md text-body-md bg-surface-low text-on-surface border border-outline rounded-default outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {/* Input Password */}
          <div className="flex flex-col gap-xs">
            <label className="text-label-md text-on-surface">
              Contraseña
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full p-md text-body-md bg-surface-low text-on-surface border border-outline rounded-default outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {/**
           * 💡 PASO 4: Renderizado de Errores
           * * Usamos cortocircuito (&&) con la variable 'error' provista por el hook.
           * Si la API devuelve un error, se renderizará este contenedor automáticamente.
           */}
          {error && (
            <div className="p-md bg-error-container text-on-error-container rounded-default border border-error/20 flex items-center gap-sm">
              <span className="text-body-sm font-semibold">{error}</span>
            </div>
          )}

          {/**
           * 💡 PASO 5: Feedback de Carga (UX)
           * * Usamos la variable 'loading' para deshabilitar el botón y evitar peticiones dobles (spam de clicks),
           * además de cambiar el texto del botón para que el usuario sepa que está pasando algo.
           */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-xs p-md bg-primary text-on-primary text-label-md rounded-default font-sans hover:bg-primary-container disabled:bg-surface-dim disabled:text-on-surface-variant cursor-pointer disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

      </div>
    </div>
  );
}