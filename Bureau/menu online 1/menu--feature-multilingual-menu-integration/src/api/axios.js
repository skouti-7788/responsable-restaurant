// import axios from 'axios'

// const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

// const api = axios.create({
//   baseURL,
//   headers: {
//     'Accept': 'application/json',
//   },
// })

// // Request interceptor: attach token
// api.interceptors.request.use((config) => {
//   try {
//     const token = localStorage.getItem('token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//   } catch (e) {
//     // noop
//   }
//   return config
// }, (error) => Promise.reject(error))

// // Response interceptor: handle auth errors
// api.interceptors.response.use(
//   (res) => res,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       localStorage.removeItem('token')
//       localStorage.removeItem('user')
//       // redirect to login if in browser
//       if (typeof window !== 'undefined') {
//         window.location.replace('/login')
//       }
//     }
//     return Promise.reject(error)
//   }
// )

// export default api
import axios from 'axios'
// console.log('API URL:', import.meta.env.VITE_API_URL)

const baseURL =
  import.meta.env.VITE_API_URL ||
  'https://backend-menu-5.onrender.com/api'

// console.log('BASE URL:', baseURL)
 

   //'http://127.0.0.1:8001/api'

const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
})

// Request interceptor: attach token
// api.interceptors.request.use(
//   (config) => {
//     try {
//       const token = localStorage.getItem('token')

//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`
//       }
//     } catch (e) {
//       // noop
//     }

//     return config
//   },
//   (error) => Promise.reject(error)
// )

// Response interceptor: handle auth errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (
//       error.response &&
//       error.response.status === 401
//     ) {
//       localStorage.removeItem('token')
//       localStorage.removeItem('user')

//       if (typeof window !== 'undefined') {
//         window.location.replace('/login')
//       }
//     }

//     return Promise.reject(error)
//   }
// )
// export default api

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token')
//       localStorage.removeItem('user')

//       if (
//         typeof window !== 'undefined' &&
//         window.location.pathname !== '/login'
//       ) {
//         window.location.replace('/login')
//       }
//     }

//     return Promise.reject(error)
//   }
// )
export default api
