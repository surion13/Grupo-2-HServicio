import { useState, useRef, useEffect } from 'react';
import useApi from '../../hooks/useApi'; 
import { reportService } from '../../services/funvalApi'; // Ajusta la ruta a tus servicios
import { useToast } from '../../hooks/useToast'; // Importamos tu hook de Toasts

export default function PdfUploader({ entityId, onUploadSuccess }) {
  const { showToast } = useToast(); // Instanciamos el mostrador de Toasts
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Campos requeridos por la especificación OpenAPI (Swagger) para crear reportes nuevos
  const [description, setDescription] = useState('');
  const [hoursSpent, setHoursSpent] = useState('');
  const [categoryId, setCategoryId] = useState(''); 

  // Instanciamos los hooks de useApi
  const { 
    loading: loadingCreate, 
    error: errorCreate, 
    execute: executeCreate 
  } = useApi(reportService.submit);

  const { 
    loading: loadingUpdate, 
    error: errorUpdate, 
    execute: executeUpdate 
  } = useApi(reportService.update);

  // Determina dinámicamente si estamos en modo actualización o creación
  const isUpdating = !!entityId && String(entityId).trim() !== "" && entityId !== "null" && entityId !== "undefined"; 
  
  const loading = loadingCreate || loadingUpdate;
  const error = errorCreate || errorUpdate;

  // Escucha si hay errores del API/Red para disparar Toasts automáticamente
  useEffect(() => {
    if (error) {
      const displayError = error === "You do not own this report" 
        ? "No tienes permisos para modificar este reporte porque no eres el propietario." 
        : error;
      showToast(displayError, "error");
    }
  }, [error]);

  // Validador y selector de archivos PDF (Cumple Criterios 1 y 5 con useToast)
  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    // Validación de tipo MIME y extensión (.pdf)
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    if (selectedFile.type !== 'application/pdf' && fileExtension !== 'pdf') {
      showToast('El archivo seleccionado debe ser obligatoriamente un formato PDF.', 'error');
      setFile(null);
      return;
    }

    // Validación de tamaño (Máximo 5MB)
    const maxSize = 5 * 1024 * 1024; 
    if (selectedFile.size > maxSize) {
      showToast('El archivo es demasiado grande. El límite máximo permitido es de 5MB.', 'warning');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  // Función para eliminar el archivo seleccionado (Cumple Criterio 2)
  const handleRemoveFile = (e) => {
    e.stopPropagation(); // Evita que se dispare el evento click de la zona de arrastre
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Resetea el input HTML
    }
    showToast('Archivo removido del formulario', 'info');
  };

  // Manejo de Drag & Drop (Cumple Criterio 3)
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

  // Envío compatible con multipart/form-data (Cumple Criterio 4)
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();

    try {
      let result;

      if (isUpdating) {
        // MODO ACTUALIZAR (PATCH)
        formData.append('evidence', file);
        result = await executeUpdate(entityId, formData);
        showToast('¡La evidencia en PDF ha sido actualizada exitosamente!', 'success');
      } else {
        // MODO CREAR NUEVO (POST)
        if (!description.trim() || !hoursSpent || !categoryId) {
          showToast('Por favor, completa todos los campos requeridos del formulario.', 'warning');
          return;
        }

        // Estructura idéntica al Swagger del backend
        formData.append('evidence', file); 
        formData.append('hours_spent', Number(hoursSpent)); 
        formData.append('category_id', Number(categoryId)); 
        formData.append('description', description); 

        result = await executeCreate(formData);
        showToast('¡El nuevo reporte ha sido creado y subido exitosamente a Google Drive!', 'success');
        
        // Limpiamos los campos del formulario tras la creación exitosa
        setDescription('');
        setHoursSpent('');
        setCategoryId('');
      }

      setFile(null);
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
    } catch (err) {
      console.error("Error en la operación del reporte:", err);
      // Nota: El error de la API ya es manejado por el useEffect superior
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-gray-800">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        {isUpdating ? 'Actualizar Evidencia del Reporte' : 'Crear Nuevo Reporte de Horas'}
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        {isUpdating 
          ? `Subiendo nuevo documento para el reporte ID: ${entityId}` 
          : 'Sube tu documento PDF para registrar y vincular un nuevo reporte en el sistema.'}
      </p>

      <form onSubmit={handleUpload} onDragEnter={handleDrag} className="space-y-4">
        
        {/* Campos del formulario: Solo se muestran en modo CREACIÓN (POST) */}
        {!isUpdating && (
          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase">Descripción del Reporte *</label>
              <textarea 
                placeholder="Ej: Apoyo en Biblioteca Central organizando el inventario de libros."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-black min-h-[80px]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase">Horas Dedicadas *</label>
                <input 
                  type="number" 
                  placeholder="Ej: 4"
                  value={hoursSpent}
                  onChange={(e) => setHoursSpent(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-black"
                  min="1"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase">ID de Categoría *</label>
                <input 
                  type="number" 
                  placeholder="Ej: 1"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-black"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Zona de Drop/Arrastre con botón para eliminar archivo (Criterios 2 y 3) */}
        <div
          onClick={() => !file && fileInputRef.current.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors relative ${
            file ? 'border-brand-500 bg-brand-50/30' : 'border-gray-300 hover:border-brand-500 cursor-pointer'
          } ${dragActive ? 'border-brand-600 bg-brand-50' : ''}`}
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
            <div className="flex flex-col items-center justify-center gap-2">
              {/* Muestra el nombre del archivo seleccionado (Criterio 2) */}
              <p className="text-sm font-medium text-brand-600 truncate max-w-[250px]" title={file.name}>
                {file.name}
              </p>
              {/* Botón para eliminar/quitar el archivo seleccionado (Criterio 2) */}
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-xs text-red-500 hover:text-red-700 font-semibold underline cursor-pointer"
              >
                Quitar archivo (X)
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Arrastra tu archivo PDF aquí o <span className="text-brand-600 font-medium underline">búscalo en tu equipo</span>
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">Solo archivos PDF (Máx. 5MB)</p>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={loading || !file}
          className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm rounded-lg shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            'Procesando...'
          ) : (
            isUpdating ? 'Actualizar Documento PDF' : 'Crear y Subir Reporte'
          )}
        </button>
      </form>
    </div>
  );
}