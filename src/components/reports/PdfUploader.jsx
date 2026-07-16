import { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth.';

export default function PdfUploader({ entityId, onUploadSuccess }) {
  const { auth } = useAuth(); 
  const token = auth?.access_token;
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  // Validar y asignar el archivo
  const handleFileChange = (selectedFile) => {
    setError('');
    setSuccess('');

    if (!selectedFile) return;

    // Validación de tipo MIME de PDF
    if (selectedFile.type !== 'application/pdf') {
      setError('El archivo seleccionado debe ser obligatoriamente un formato PDF.');
      setFile(null);
      return;
    }

    // Validación de Tamaño Máximo (5 MB)
    const maxSize = 5 * 1024 * 1024; 
    if (selectedFile.size > maxSize) {
      setError('El archivo es demasiado grande. El límite máximo permitido es de 5MB.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor, selecciona un archivo antes de enviar.');
      return;
    }

    setLoading(true);
    setError('');

    // Construcción del cuerpo multipart/form-data
    const formData = new FormData();
    formData.append('file', file);
    if (entityId) {
      formData.append('entity_id', entityId); // Id vinculante opcional según endpoint
    }

    try {
      // Ajustar la URL base según corresponda a la API oficial (ej: http://localhost:8000/api/v1)
      const response = await fetch('http://localhost:8000/api/v1/reports/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Nota: No se define 'Content-Type' manualmente, el navegador lo autodefine con el boundary correcto para FormData
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error al intentar subir el archivo al servidor. Inténtalo de nuevo.');
      }

      const data = await response.json();
      setSuccess('¡El reporte en formato PDF ha sido subido e integrado exitosamente!');
      setFile(null);
      
      if (onUploadSuccess) {
        onUploadSuccess(data);
      }
    } catch (err) {
      setError(err.message || 'Hubo un problema de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Carga de Reporte PDF</h3>
      <p className="text-sm text-gray-500 mb-4">Sube la documentación o evidencia requerida en formato PDF.</p>

      <form onSubmit={handleUpload} onDragEnter={handleDrag} className="space-y-4">
        {/* Zona de Drop/Arrastre */}
        <div
          onClick={() => fileInputRef.current.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragActive ? 'border-brand-600 bg-brand-50' : 'border-gray-300 hover:border-brand-500'
          }`}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
          <span className="text-4xl block mb-2">📄</span>
          {file ? (
            <p className="text-sm font-medium text-brand-600 truncate">{file.name}</p>
          ) : (
            <p className="text-sm text-gray-600">
              Arrastra tu archivo PDF aquí o <span className="text-brand-600 font-medium underline">búscalo en tu equipo</span>
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">Solo archivos PDF (Máx. 5MB)</p>
        </div>

        {/* Notificaciones de Estado */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Acciones del Formulario */}
        <button
          type="submit"
          disabled={loading || !file}
          className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm rounded-lg shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Subiendo documento...
            </>
          ) : (
            'Subir Documento PDF'
          )}
        </button>
      </form>
    </div>
  );
}