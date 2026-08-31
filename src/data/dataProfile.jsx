import axiosClient from '../api/axiosClient'

// =====================================================
// CACHE KEY
// =====================================================

export const PROFILE_CACHE_KEY =
  'restaurant_profile_cache'

// =====================================================
// GET RESTAURANT PROFILE FROM API
// =====================================================

export const getRestaurantProfile = async () => {
  const response =
    await axiosClient.get('/restaurants')

  const restaurant =
    response.data?.data?.[0] ||
    response.data?.[0] ||
    null

  return restaurant
}

// =====================================================
// UPDATE RESTAURANT PROFILE
// =====================================================

export const updateRestaurantProfile = async (
  restaurantId,
  formData
) => {
  const response =
    await axiosClient.post(
      `/restaurants/${restaurantId}`,
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
    response.data?.restaurant ||
    response.data
  )
}

// =====================================================
// READ PROFILE CACHE
// =====================================================

export const getCachedProfile = () => {
  try {
    const cached =
      localStorage.getItem(
        PROFILE_CACHE_KEY
      )

    if (!cached) {
      return null
    }

    return JSON.parse(cached)
  } catch (error) {
    console.error(
      'Failed to read profile cache:',
      error
    )

    return null
  }
}

// =====================================================
// SAVE PROFILE CACHE
// =====================================================

export const saveCachedProfile = (
  profile
) => {
  try {
    localStorage.setItem(
      PROFILE_CACHE_KEY,
      JSON.stringify(profile)
    )
  } catch (error) {
    console.error(
      'Failed to save profile cache:',
      error
    )
  }
}
 
