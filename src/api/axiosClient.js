import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL ||
                'https://backend-menu-5.onrender.com/api' 
                //  'http://127.0.0.1:8001/api'

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

// axiosClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem('restaurant_token')
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }

//   return config
// })
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('restaurant_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // إلا كان الـ data FormData، حيد الـ Content-Type باش axios يحدد الـ boundary وحدو
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }

  return config
})
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('restaurant_token')
      localStorage.removeItem('restaurant_user')
      window.location.href = '/login'
    }

    return Promise.reject(error?.response?.data || error)
  },
)

export default axiosClient
