import { httpClient } from "../utils/httpClient.js";

export const authService = {
  checkSession: async () => {
   const response = await httpClient("/api/auth/check-session");
    if (response.success && response.user) {
      localStorage.setItem("user", JSON.stringify(response.user)); 
    }
    return response;
  },

  login: async (credentials) => {
    const response = await httpClient("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (response.success && response.user) {
      localStorage.setItem("user", JSON.stringify(response.user)); 
    }
    return response;
  },

  register: async (data) => {
    return await httpClient("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  resetPassword: async (email) => {
    return await httpClient("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  updatePassword: async (data) => {
    return await httpClient("/api/auth/update-password", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  logout: async () => {
    const response = await httpClient("/api/auth/logout", {
      method: "POST",
    });
    if (response.success) {
      localStorage.removeItem("user"); //Borramos la sesión al salir
    }
    return response;
  },
  // Método para consultar el usuario actual desde cualquier parte
  getUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
};
