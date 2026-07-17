
export default function Pagination({ page, page_size, total, onPageChange }) {
  // 1. Calcular el número total de páginas (mínimo 1)
  const totalPages = Math.max(1, Math.ceil(total / page_size));

  // 2. Controladores para evitar desbordar los límites de páginas
  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  return (
    <div className="flex items-center justify-between border-t border-outline-variant px-md py-sm bg-surface-container-lowest mt-md rounded-b-default">
      {/* Información del progreso actual (Izquierda) */}
      <div className="text-body-sm text-on-surface-variant font-sans">
        Mostrando página <span className="font-semibold text-on-surface">{page}</span> de{' '}
        <span className="font-semibold text-on-surface">{totalPages}</span> 
        {total > 0 && ` (${total} registros en total)`}
      </div>

      {/* Botones de navegación (Derecha) */}
      <div className="flex items-center gap-xs">
        {/* Botón Anterior */}
        <button
          type="button"
          onClick={handlePrevious}
          disabled={page === 1}
          className="px-md py-xs text-label-sm font-sans border border-outline rounded-default bg-surface text-on-surface hover:bg-surface-container-low disabled:opacity-50 disabled:bg-surface-dim disabled:text-on-surface-variant disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          Anterior
        </button>

        {/* Indicador de página central */}
        <span className="flex items-center justify-center px-md py-xs text-label-sm font-semibold rounded-default bg-primary text-on-primary shadow-sm min-w-9">
          {page}
        </span>

        {/* Botón Siguiente */}
        <button
          type="button"
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-md py-xs text-label-sm font-sans border border-outline rounded-default bg-surface text-on-surface hover:bg-surface-container-low disabled:opacity-50 disabled:bg-surface-dim disabled:text-on-surface-variant disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}