import PdfUploader from '../../components/reports/PdfUploader'; // Asegúrate de ajustar la ruta de importación correcta

export default function TestPdf() {
  
  // Esta función se disparará cuando la API responda exitosamente (status 200/201)
  const handleUploadSuccess = (data) => {
    console.log('¡Archivo subido con éxito!', data);
    alert('El reporte se ha enviado correctamente al servidor.');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto space-y-6">
        <header className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Panel de Pruebas de Estudiante</h1>
          <p className="text-sm text-gray-500">Probando la subida de reportes en formato PDF.</p>
        </header>

        {/* Renderizado de tu componente */}
        <PdfUploader 
          entityId="1" // Puedes pasar un ID de prueba que requiera tu endpoint
          onUploadSuccess={handleUploadSuccess} 
        />
      </div>
    </div>
  );
}