    import axiosClient from '../api/axiosClient'

    // =====================================================
    // RESTAURANT API
    // =====================================================

    export const getRestaurant = async () => {
    const response = await axiosClient.get('/restaurants')

    const data =
    response.data?.data ||
    response.data ||
    []

    return data[0] || null
    }

    // =====================================================
    // CATEGORIES API
    // =====================================================

    export const getRestaurantCategories = async (
    restaurantId
    ) => {
    const response = await axiosClient.get(
    `/restaurants/${restaurantId}/categories`
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
    // MEALS API
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
    // CREATE MEAL
    // =====================================================

    export const createMeal = async (
    restaurantId,
    formData
    ) => {
    const response = await axiosClient.post(
    `/restaurants/${restaurantId}/meals`,
    formData,
    {
    headers: {
    'Content-Type':
    'multipart/form-data',
    },
    }
    )

    return (
    response.data?.data ||
    response.data?.meal ||
    response.data
    )
    }

    // =====================================================
    // UPDATE MEAL
    // =====================================================

    export const updateMeal = async (
    restaurantId,
    mealId,
    formData
    ) => {
    formData.append(
    '_method',
    'PUT'
    )

    const response = await axiosClient.post(
    `/restaurants/${restaurantId}/meals/${mealId}`,
    formData,
    {
    headers: {
    'Content-Type':
    'multipart/form-data',
    },
    }
    )

    return (
    response.data?.data ||
    response.data?.meal ||
    response.data
    )
    }

    // =====================================================
    // DELETE MEAL
    // =====================================================

    export const deleteMeal = async (
    restaurantId,
    mealId
    ) => {
    await axiosClient.delete(
    `/restaurants/${restaurantId}/meals/${mealId}`
    )
    }
