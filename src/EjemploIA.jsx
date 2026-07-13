import { useState } from 'react';
import useApi from './hooks/useApi';
import { authService } from './services/funvalApi';
//
export default function EjemploIA() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { loading, error, execute: loginExecute } = useApi(authService.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginExecute(email, password);
      alert("¡Inicio de sesión correcto!");
    } catch (err) {
        console.error(err)
      // El error ya queda capturado en el estado 'error' del hook
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

          {/* Caja de Error Dinámica (Usa los estilos semánticos de tu config) */}
          {error && (
            <div className="p-md bg-error-container text-on-error-container rounded-default border border-error/20 flex items-center gap-sm">
              <span className="text-body-sm font-semibold">{error}</span>
            </div>
          )}

          {/* Botón de Submit */}
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