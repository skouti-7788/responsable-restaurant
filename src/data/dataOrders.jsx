import axiosClient from '../api/axiosClient'

// =====================================================
// GET RESTAURANT
// =====================================================

export const getRestaurants = async () => {
  const response = await axiosClient.get('/restaurants')

  const data =
    response.data?.data ||
    response.data ||
    []

  return Array.isArray(data)
    ? data
    : []
}

// =====================================================
// GET RESTAURANT ORDERS
// =====================================================

export const getRestaurantOrders = async (
  restaurantId
) => {
  const response = await axiosClient.get(
    `/restaurants/${restaurantId}/orders`
  )

  const data =
    response.data?.data ||
    response.data ||
    []

  return Array.isArray(data)
    ? data
    : []
}

// =====================================================
// GET RESTAURANT MEALS
// =====================================================

export const getRestaurantMeals = async (
  restaurantId
) => {
  const response = await axiosClient.get(
    `/restaurants/${restaurantId}/meals`
  )

  const data =
    response.data?.data ||
    response.data ||
    []

  return Array.isArray(data)
    ? data
    : []
}

// =====================================================
// GET RESTAURANT TABLES
// =====================================================

export const getRestaurantTables = async (
  restaurantId
) => {
  const response = await axiosClient.get(
    `/restaurants/${restaurantId}/tables`
  )

  const data =
    response.data?.data ||
    response.data ||
    []

  return Array.isArray(data)
    ? data
    : []
}

// =====================================================
// UPDATE ORDER STATUS
// =====================================================

export const updateOrderStatus = async (
  orderId,
  status
) => {
  const response =
    await axiosClient.put(
      `/orders/${orderId}/status`,
      {
        status,
      }
    )

  return (
    response.data?.data ||
    response.data
  )
}

// =====================================================
// DELETE ORDER
// =====================================================

export const deleteOrder = async (
  orderId
) => {
  const response =
    await axiosClient.delete(
      `/orders/${orderId}/delete`
    )

  return response.data
}
 
