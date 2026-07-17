import { useState, useCallback } from "react";

export default function useApi(asyncFunction) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Envolvemos con useCallback para mantener la referencia estable
  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await asyncFunction(...args);
      
      setData(result);
      return result; 
    } catch (err) {
      console.error("API Hook Error:", err);
      const errorMsg = err.response?.data?.detail || err.message || "Error inesperado";
      setError(errorMsg);
      throw err; 
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]); // Depende únicamente de la función de servicio que le pasamos

  return { data, loading, error, execute };
}