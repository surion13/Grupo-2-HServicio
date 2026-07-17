import { reportService } from '../../services/funvalApi';
import useApi from '../../hooks/useApi';
import { useToast } from '../../hooks/useToast';

export default function VisorPdf({ reportId, buttonText = "Ver evidencia", className = "" }) {
  const { showToast } = useToast();
  
  // Consumimos el servicio de stream usando tu hook de integración de APIs
  const { loading, execute: executeStream } = useApi(reportService.streamEvidencePdf);

  const handleVerEvidencia = async () => {
    const fallbackUrl = `/api/v1/reports/${reportId}/evidence`;

    try {
      // 1. Intentamos obtener el binario (Blob) usando tu hook de API estructurado
      const blobData = await executeStream(reportId);

      // 2. CORRECCIÓN CRUCIAL: Validar que sea un archivo binario PDF real y no un JSON de error oculto en un blob
      if (!blobData || blobData.size === 0 || blobData.type !== 'application/pdf') {
        throw new Error('El archivo recuperado no es un PDF válido.');
      }

      // 3. Crear URL temporal segura y abrir en pestaña nueva
      const fileURL = URL.createObjectURL(blobData);
      window.open(fileURL, '_blank');
      
      showToast('Evidencia cargada con éxito', 'success');
    } catch (error) {
      console.error('Error cargando stream PDF:', error);
      
      // Feedback amigable utilizando tu ToastProvider con estilo 'warning'
      showToast('No se pudo previsualizar de forma interactiva. Intentando enlace directo...', 'warning');

      // 4. Fallback de contingencia: Descarga o redirección mediante elemento de anclaje
      try {
        const link = document.createElement('a');
        link.href = fallbackUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (fallbackError) {
        console.error('Error en el fallback de descarga:', fallbackError);
        showToast('No fue posible acceder a la evidencia directamente.', 'error');
      }
    }
  };

  return (
    <button
      onClick={handleVerEvidencia}
      disabled={loading}
      className={`
        inline-flex items-center justify-center 
        px-md py-xs 
        text-label-md font-sans rounded-default 
        bg-primary text-on-primary hover:bg-primary-container
        shadow-sm transition-colors duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed 
        ${className}
      `}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-xs h-4 w-4 text-on-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Procesando...
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-[20px] mr-xs">
            visibility
          </span>
          {buttonText}
        </>
      )}
    </button>
  );
}