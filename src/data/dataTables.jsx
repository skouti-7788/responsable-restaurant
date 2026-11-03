import axiosClient from '../api/axiosClient'

// =====================================================
// GET RESTAURANTS
// =====================================================

export const getRestaurants = () =>
  axiosClient.get('/restaurants')

// =====================================================
// GET RESTAURANT TABLES
// =====================================================

export const getTables = (restaurantId) =>
  axiosClient.get(
    `/restaurants/${restaurantId}/tables`
  )

// =====================================================
// CREATE TABLE
// =====================================================

export const createTable = (
  restaurantId,
  data
) =>
  axiosClient.post(
    `/restaurants/${restaurantId}/tables`,
    data
  )

// =====================================================
// UPDATE TABLE
// =====================================================

export const updateTable = (
  restaurantId,
  tableId,
  data
) =>
  axiosClient.put(
    `/restaurants/${restaurantId}/tables/${tableId}`,
    data
  )

// =====================================================
// DELETE ONE TABLE
// =====================================================

export const deleteTable = (
  restaurantId,
  tableId
) =>
  axiosClient.delete(
    `/restaurants/${restaurantId}/tables/${tableId}`
  )

// =====================================================
// DELETE ALL TABLES
// =====================================================

export const deleteAllTables = (
  restaurantId
) =>
  axiosClient.delete(
    `/restaurants/${restaurantId}/tables/all`
  )