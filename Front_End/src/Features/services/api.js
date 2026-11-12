
import axios from "axios"
const apiURL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: apiURL,
  headers: {
    "Content-Type": "application/json",
  },
})

// intercreptor is such a check point for checking request befor send in back end
api.interceptors.request.use((config) => {
  const stored =
    localStorage.getItem("carpetpro_auth") ||
    sessionStorage.getItem("carpetpro_auth")

  if (stored) {
    const { token } = JSON.parse(stored)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
});

export default api
