import axiosClient from '../api/axiosClient'
import {
  clearLegacyRestaurantCaches,
  getCurrentRestaurantId,
  getRestaurantCache,
  removeRestaurantCache,
  setRestaurantCache,
} from '../utils/restaurantCache'

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
// BUILD RESTAURANT-SCOPED CACHE KEY
// =====================================================

// =====================================================
// GET CACHED CATEGORIES
// =====================================================

export const getCachedCategories = (
  restaurantId = null
) => {
  const id =
    restaurantId ??
    getCurrentRestaurantId()

  const cached =
    getRestaurantCache(
      CATEGORIES_CACHE_KEY,
      id
    )

  return Array.isArray(cached)
    ? cached
    : getEmptyCategories()
}

// =====================================================
// GET CACHED RESTAURANT
// =====================================================

export const getCachedRestaurant = () => {
  const restaurantId = getCurrentRestaurantId()

  if (!restaurantId) {
    return null
  }

  try {
    const storedUser =
      localStorage.getItem(
        'restaurant_user'
      )

    if (!storedUser) {
      return null
    }

    const user = JSON.parse(storedUser)
    const restaurant =
      user?.restaurant || null

    if (!restaurant?.id && !user?.restaurant_id) {
      return null
    }

    return {
      id: Number(
        restaurant?.id ?? user?.restaurant_id
      ),
      slug: restaurant?.slug || null,
    }
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
  restaurantId,
  categories
) => {
  const id = restaurantId ?? getCurrentRestaurantId()

  setRestaurantCache(
    CATEGORIES_CACHE_KEY,
    id,
    Array.isArray(categories)
      ? categories
      : []
  )
}

// =====================================================
// SAVE RESTAURANT CACHE
// =====================================================

export const saveRestaurantToCache = (
  restaurant
) => {
  const id =
    restaurant?.id ??
    getCurrentRestaurantId()

  if (!id) {
    return
  }
}

// =====================================================
// CLEAR CATEGORY CACHE FOR ONE RESTAURANT
// =====================================================

export const clearCategoriesCache = (
  restaurantId
) => {
  removeRestaurantCache(
    CATEGORIES_CACHE_KEY,
    restaurantId
  )
}

// =====================================================
// CLEAR ALL CATEGORY CACHES
// =====================================================

export const clearAllCategoriesCaches = () => {
  try {
    clearLegacyRestaurantCaches()

    for (
      let index = 0;
      index < localStorage.length;
      index++
    ) {
      const key =
        localStorage.key(index)

      if (
        key &&
        key.startsWith(
          `${CATEGORIES_CACHE_KEY}_`
        )
      ) {
        localStorage.removeItem(key)
      }
    }
  } catch (error) {
    console.error(
      'Clear all categories caches error:',
      error
    )
  }
}

// =====================================================
// GET RESTAURANT
// =====================================================

export const fetchRestaurant = async () => {
  const currentRestaurantId = getCurrentRestaurantId()

  if (currentRestaurantId) {
    const response = await axiosClient.get(
      `/restaurants/${currentRestaurantId}`
    )

    const restaurant =
      response.data?.data ||
      response.data?.restaurant ||
      response.data ||
      null

    if (!restaurant?.id) {
      throw new Error(
        'Restaurant not found.'
      )
    }

    return restaurant
  }

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
    restaurants[0] ||
    null

  if (!restaurant?.id) {
    throw new Error(
      'Restaurant not found.'
    )
  }

  return restaurant
}

// =====================================================
// GET CATEGORIES FROM API
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
      restaurant.id,
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

    status:
      'active',
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

    status:
      'active',
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
 
