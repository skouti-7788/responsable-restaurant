 import axiosClient from '../api/axiosClient'

// =====================================================
// CACHE
// =====================================================

const PROFILE_CACHE_PREFIX = 'restaurant_profile_cache'

// =====================================================
// CURRENT USER
// =====================================================

const getCurrentUser = () => {
  try {
    const storedUser = localStorage.getItem('restaurant_user')

    if (!storedUser) {
      return null
    }

    return JSON.parse(storedUser)
  } catch (error) {
    console.error('Failed to read current user:', error)
    return null
  }
}

// =====================================================
// CURRENT RESTAURANT ID
// =====================================================

export const getCurrentRestaurantId = () => {
  const user = getCurrentUser()

  const restaurantId =
    user?.restaurant_id ??
    user?.restaurantId ??
    null

  return restaurantId ? Number(restaurantId) : null
}

// =====================================================
// CACHE KEY
// =====================================================

export const getProfileCacheKey = (restaurantId) => {
  if (!restaurantId) {
    return null
  }

  return `${PROFILE_CACHE_PREFIX}_${Number(restaurantId)}`
}

// =====================================================
// GET PROFILE
// =====================================================

export const getRestaurantProfile = async (
  restaurantId = null
) => {
  const id =
    restaurantId ??
    getCurrentRestaurantId()

  if (!id) {
    throw new Error('Restaurant ID not found.')
  }

  const response = await axiosClient.get(
    `/restaurants/${Number(id)}`
  )

  return (
    response.data?.data ??
    response.data?.restaurant ??
    response.data ??
    null
  )
}

// =====================================================
// UPDATE PROFILE
// =====================================================

export const updateRestaurantProfile = async (
  restaurantId,
  formData
) => {
  if (!restaurantId) {
    throw new Error('Restaurant ID is required.')
  }

  const id = Number(restaurantId)

  const response = await axiosClient.post(
    `/restaurants/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return (
    response.data?.data ??
    response.data?.restaurant ??
    response.data ??
    null
  )
}

// =====================================================
// GET CACHED PROFILE
// =====================================================

export const getCachedProfile = (
  restaurantId = null
) => {
  const id =
    restaurantId ??
    getCurrentRestaurantId()

  if (!id) {
    return null
  }

  const cacheKey = getProfileCacheKey(id)

  if (!cacheKey) {
    return null
  }

  try {
    const cached = localStorage.getItem(cacheKey)

    if (!cached) {
      return null
    }

    const parsed = JSON.parse(cached)

    // Extra protection against wrong restaurant cache.
    if (
      !parsed?.id ||
      Number(parsed.id) !== Number(id)
    ) {
      localStorage.removeItem(cacheKey)
      return null
    }

    return parsed
  } catch (error) {
    console.error('Failed to read profile cache:', error)

    localStorage.removeItem(cacheKey)

    return null
  }
}

// =====================================================
// SAVE PROFILE CACHE
// =====================================================

export const saveCachedProfile = (
  profile,
  restaurantId = null
) => {
  if (!profile) {
    return
  }

  const id =
    restaurantId ??
    profile?.id ??
    getCurrentRestaurantId()

  if (!id) {
    return
  }

  const numericId = Number(id)

  // Never cache a profile under another restaurant ID.
  if (
    profile?.id &&
    Number(profile.id) !== numericId
  ) {
    console.error('Profile cache mismatch:', {
      profileId: profile.id,
      restaurantId: numericId,
    })

    return
  }

  const cacheKey =
    getProfileCacheKey(numericId)

  if (!cacheKey) {
    return
  }

  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        ...profile,
        id: numericId,
      })
    )
  } catch (error) {
    console.error('Failed to save profile cache:', error)
  }
}

// =====================================================
// CLEAR ONE PROFILE CACHE
// =====================================================

export const clearCachedProfile = (
  restaurantId = null
) => {
  const id =
    restaurantId ??
    getCurrentRestaurantId()

  if (!id) {
    return
  }

  const cacheKey =
    getProfileCacheKey(id)

  if (cacheKey) {
    localStorage.removeItem(cacheKey)
  }
}

// =====================================================
// CLEAR ALL PROFILE CACHES
// =====================================================

export const clearAllProfileCaches = () => {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (
        key.startsWith(
          `${PROFILE_CACHE_PREFIX}_`
        )
      ) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error(
      'Failed to clear profile caches:',
      error
    )
  }
}
