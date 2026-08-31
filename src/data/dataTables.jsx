import axiosClient from './axiosClient'

// Get current restaurant
export const getRestaurants = () =>
  axiosClient.get('/restaurants')

// Get restaurant tables
export const getTables = (restaurantId) =>
  axiosClient.get(
    `/restaurants/${restaurantId}/tables`
  )

// Create table
export const createTable = (restaurantId, data) =>
  axiosClient.post(
    `/restaurants/${restaurantId}/tables`,
    data
  )

// Update table
export const updateTable = (
  restaurantId,
  tableId,
  data
) =>
  axiosClient.put(
    `/restaurants/${restaurantId}/tables/${tableId}`,
    data
  )

// Delete one table
export const deleteTable = (
  restaurantId,
  tableId
) =>
  axiosClient.delete(
    `/restaurants/${restaurantId}/tables/${tableId}`
  )

// Delete all tables
export const deleteAllTables = (restaurantId) =>
  axiosClient.delete(
    `/restaurants/${restaurantId}/tables/all`
  )