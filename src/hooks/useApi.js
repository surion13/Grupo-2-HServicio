import { useState } from "react";

export default function useApi(asyncFunction) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Una función asíncrona normal
  async function execute(...args) {
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
  }

  return { data, loading, error, execute };
}