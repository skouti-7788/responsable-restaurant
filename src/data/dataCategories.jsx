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
// BUILD RESTAURANT-SCOPED CACHE KEY
// =====================================================

const getCategoriesCacheKey = (
  restaurantId
) => {
  if (!restaurantId) {
    return null
  }

  return `${CATEGORIES_CACHE_KEY}_${restaurantId}`
}

// =====================================================
// GET CACHED CATEGORIES
// =====================================================

export const getCachedCategories = (
  restaurantId
) => {
  try {
    const cacheKey =
      getCategoriesCacheKey(
        restaurantId
      )

    if (!cacheKey) {
      return getEmptyCategories()
    }

    const cached =
      localStorage.getItem(
        cacheKey
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

    const parsed =
      JSON.parse(cached)

    if (
      !parsed ||
      !parsed.id
    ) {
      return null
    }

    return parsed

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
  try {
    const cacheKey =
      getCategoriesCacheKey(
        restaurantId
      )

    if (!cacheKey) {
      return
    }

    localStorage.setItem(
      cacheKey,
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
// CLEAR CATEGORY CACHE FOR ONE RESTAURANT
// =====================================================

export const clearCategoriesCache = (
  restaurantId
) => {
  try {
    const cacheKey =
      getCategoriesCacheKey(
        restaurantId
      )

    if (!cacheKey) {
      return
    }

    localStorage.removeItem(
      cacheKey
    )

  } catch (error) {
    console.error(
      'Clear categories cache error:',
      error
    )
  }
}

// =====================================================
// CLEAR ALL CATEGORY CACHES
// =====================================================

export const clearAllCategoriesCaches = () => {
  try {
    const keys = []

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
        keys.push(key)
      }
    }

    keys.forEach((key) => {
      localStorage.removeItem(key)
    })

    // Remove old legacy cache too
    localStorage.removeItem(
      CATEGORIES_CACHE_KEY
    )

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

  saveRestaurantToCache(
    restaurant
  )

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
 
