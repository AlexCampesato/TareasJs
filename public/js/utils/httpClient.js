import { API_BASE_URL } from "../config.js";

export const httpClient = async (endpoint, options = {}) => {
  const defaultHeaders = {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
  };

  // Construcción de URL limpia
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Leer respuesta bruta como texto
    const rawText = await response.text();
    console.log("Respuesta RAW del Servidor:", rawText);

    let data = null;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      // Si la respuesta no es un JSON válido (por ejemplo, un error fatal de PHP)
      data = null;
    }

    if (!response.ok) {
      const mensajeError = data?.mensaje || data?.message || `Error ${response.status}: ${response.statusText}`;
      throw new Error(mensajeError);
    }

    return data;
  } catch (error) {
    console.error("HTTP Client Error:", error);
    throw error;
  }
};