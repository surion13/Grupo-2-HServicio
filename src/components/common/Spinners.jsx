
const Spinner = ({ fullScreen = true, size = "w-24 h-24" }) => {
  
  // Contenedor principal que asegura el centrado total
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" 
    : "flex w-full items-center justify-center p-spacing-lg";

  return (
    <div className={containerClasses}>
      <div
        className={`
          ${size}
          animate-spin
          rounded-full
          border-12 
          border-primary
          border-t-transparent
          shadow-xl
        `}
        role="status"
        aria-label="Cargando"
      >
        <span className="sr-only">Cargando...</span>
      </div>
    </div>
  );
};

export default Spinner;