import axiosClient from '../api/axiosClient'

// =====================================================
// CACHE KEYS
// =====================================================

export const CATEGORIES_CACHE_KEY =
  'restaurant_categories_cache'

export const RESTAURANT_CACHE_KEY =
  'restaurant_current_cache'

// =====================================================
// DEFAULT DATA
// =====================================================

const getEmptyCategories = () => {
  return []
}

// =====================================================
// GET CACHED CATEGORIES
// =====================================================

export const getCachedCategories = () => {
  try {
    const cached =
      localStorage.getItem(
        CATEGORIES_CACHE_KEY
      )

    if (!cached) {
      return getEmptyCategories()
    }

    const parsed =
      JSON.parse(cached)

    return Array.isArray(parsed)
      ? parsed
      : getEmptyCategories()

  } catch (error) {
    console.error(
      'Read categories cache error:',
      error
    )

    return getEmptyCategories()
  }
}

// =====================================================
// GET CACHED RESTAURANT
// =====================================================

export const getCachedRestaurant = () => {
  try {
    const cached =
      localStorage.getItem(
        RESTAURANT_CACHE_KEY
      )

    if (!cached) {
      return null
    }

    return JSON.parse(cached)

  } catch (error) {
    console.error(
      'Read restaurant cache error:',
      error
    )

    return null
  }
}

// =====================================================
// SAVE CATEGORIES CACHE
// =====================================================

export const saveCategoriesToCache = (
  categories
) => {
  try {
    localStorage.setItem(
      CATEGORIES_CACHE_KEY,
      JSON.stringify(
        Array.isArray(categories)
          ? categories
          : []
      )
    )
  } catch (error) {
    console.error(
      'Save categories cache error:',
      error
    )
  }
}

// =====================================================
// SAVE RESTAURANT CACHE
// =====================================================

export const saveRestaurantToCache = (
  restaurant
) => {
  try {
    localStorage.setItem(
      RESTAURANT_CACHE_KEY,
      JSON.stringify({
        id:
          restaurant?.id ||
          null,

        slug:
          restaurant?.slug ||
          null,
      })
    )
  } catch (error) {
    console.error(
      'Save restaurant cache error:',
      error
    )
  }
}

// =====================================================
// CLEAR CACHE
// =====================================================

export const clearCategoriesCache = () => {
  try {
    localStorage.removeItem(
      CATEGORIES_CACHE_KEY
    )
  } catch (error) {
    console.error(
      'Clear categories cache error:',
      error
    )
  }
}

// =====================================================
// GET RESTAURANT
// =====================================================

export const fetchRestaurant = async () => {
  const response =
    await axiosClient.get(
      '/restaurants'
    )

  const data =
    response.data?.data ||
    response.data ||
    []

  const restaurants =
    Array.isArray(data)
      ? data
      : []

  const restaurant =
    restaurants[0] || null

  if (!restaurant?.id) {
    throw new Error(
      'Restaurant not found.'
    )
  }

  saveRestaurantToCache(
    restaurant
  )

  return restaurant
}

// =====================================================
// GET CATEGORIES
// =====================================================

export const fetchCategories = async (
  restaurantId
) => {
  if (!restaurantId) {
    throw new Error(
      'Restaurant ID is required.'
    )
  }

  const response =
    await axiosClient.get(
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
// LOAD ALL CATEGORIES DATA
// =====================================================

export const loadCategoriesData =
  async () => {

    const restaurant =
      await fetchRestaurant()

    const categories =
      await fetchCategories(
        restaurant.id
      )

    saveCategoriesToCache(
      categories
    )

    return {
      restaurant,
      categories,
    }
  }

// =====================================================
// CREATE CATEGORY
// =====================================================

export const createCategory = async ({
  restaurantId,
  name,
  description,
}) => {

  if (!restaurantId) {
    throw new Error(
      'Restaurant not found.'
    )
  }

  const payload = {
    name:
      name.trim(),

    description:
      description?.trim() ||
      '',

    status: 'active',
  }

  const response =
    await axiosClient.post(
      `/restaurants/${restaurantId}/categories`,
      payload
    )

  return (
    response.data?.data ||
    response.data
  )
}

// =====================================================
// UPDATE CATEGORY
// =====================================================

export const updateCategoryApi = async ({
  restaurantId,
  categoryId,
  name,
  description,
}) => {

  if (!restaurantId) {
    throw new Error(
      'Restaurant not found.'
    )
  }

  if (!categoryId) {
    throw new Error(
      'Category ID is required.'
    )
  }

  const payload = {
    name:
      name.trim(),

    description:
      description?.trim() ||
      '',

    status: 'active',
  }

  const response =
    await axiosClient.put(
      `/restaurants/${restaurantId}/categories/${categoryId}`,
      payload
    )

  return (
    response.data?.data ||
    response.data
  )
}

// =====================================================
// DELETE CATEGORY
// =====================================================

export const deleteCategoryApi = async ({
  restaurantId,
  categoryId,
}) => {

  if (!restaurantId) {
    throw new Error(
      'Restaurant not found.'
    )
  }

  if (!categoryId) {
    throw new Error(
      'Category ID is required.'
    )
  }

  await axiosClient.delete(
    `/restaurants/${restaurantId}/categories/${categoryId}`
  )

  return categoryId
}
 
