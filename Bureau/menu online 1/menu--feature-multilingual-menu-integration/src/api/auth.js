import api from './axios'

export const login = async (credentials) => {
  const res = await api.post('/auth/login', credentials)
  return res.data
}

export const register = async (payload) => {
  const res = await api.post('/auth/register', payload)
  return res.data
}

export const logout = async () => {
  const res = await api.post('/auth/logout')
  return res.data
}

export const fetchUser = async () => {
  const res = await api.get('/user')
  return res.data
}
