import { useState, useCallback, useRef } from "react";
import api from "./axios";

export const useData = () => {
  // `restau` starts as null. MenuPro.jsx already treats "no valid restau
  // yet" as "keep showing the default/demo data", so null here is safe —
  // it is NEVER used to blank out MenuPro's state, only to signal
  // "nothing from the API yet / last call failed".
  const [restau, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestIdRef = useRef(0);

  const fetchData = useCallback(async (slug, language = "en", tableToken = "") => {
    const requestId = ++requestIdRef.current;

    if (!slug) {
      setRestaurant(null);
      setLoading(false);
      setError("Restaurant slug is missing.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const safeLanguage = ["en", "fr", "ar"].includes(language) ? language : "en";
      const params = { lang: safeLanguage };
      if (tableToken) params.table = tableToken;
      const res = await api.get(`/menu/${slug}`, { params });
      const data = res?.data;
      const isValidPayload =
        data &&
        typeof data === "object" &&
        !Array.isArray(data) &&
        Object.keys(data).length > 0;

      if (requestId !== requestIdRef.current) return;

      if (isValidPayload) {
        setRestaurant(data);
      } else {
        setRestaurant(null);
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) return;

      console.error("Load restaurant menu error:", err);
      setRestaurant(null);
      setError(
        err.response?.data?.message ||
        "Unable to load restaurant menu."
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);
 
  return {
    restau,
    loading,
    error,
    fetchData,
  };
};