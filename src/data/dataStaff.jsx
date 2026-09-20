import axiosClient from '../api/axiosClient'

// Get all staff
export const getStaff = () =>
  axiosClient.get('/staff')

// Create staff
export const createStaff = (data) =>
  axiosClient.post('/staff', data)

// Delete staff
export const deleteStaff = (id) =>
  axiosClient.delete(`/staff/${id}`)

// Get staff permissions
export const getStaffPermissions = (id) =>
  axiosClient.get(`/staff/${id}/permissions`)

// Update staff permissions
export const updateStaffPermissions = (id, permissions) =>
  axiosClient.put(`/staff/${id}/permissions`, {
    permissions,
  })