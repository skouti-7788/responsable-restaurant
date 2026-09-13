import axiosClient from '../api/axiosClient'

// =========================================================
// CACHE
// =========================================================

export const APPEARANCE_CACHE_KEY =
  'restaurant_appearance_cache'

// =========================================================
// DEFAULT APPEARANCE
// =========================================================

export const DEFAULT_APPEARANCE = {
  logo: null,
  header_image: null,
  background_image: null,
  primary_color: '#D97706',
  secondary_color: '#92400E',
  text_color: '#1F2937',
  background_color: '#FFFFFF',
  font_family: 'Inter',
}

// =========================================================
// NORMALIZE APPEARANCE
// =========================================================

export const normalizeAppearance = (appearance = {}) => ({
  ...DEFAULT_APPEARANCE,
  ...appearance,
})

// =========================================================
// CACHE
// =========================================================

export const getCachedAppearance = () => {
  try {
    const cached = localStorage.getItem(
      APPEARANCE_CACHE_KEY
    )

    if (!cached) {
      return null
    }

    return normalizeAppearance(
      JSON.parse(cached)
    )
  } catch (error) {
    console.error(
      'Failed to read appearance cache:',
      error
    )

    return null
  }
}

export const setCachedAppearance = (
  appearance
) => {
  try {
    const normalized =
      normalizeAppearance(
        appearance
      )

    localStorage.setItem(
      APPEARANCE_CACHE_KEY,
      JSON.stringify(normalized)
    )
  } catch (error) {
    console.error(
      'Failed to save appearance cache:',
      error
    )
  }
}

export const clearCachedAppearance = () => {
  try {
    localStorage.removeItem(
      APPEARANCE_CACHE_KEY
    )
  } catch (error) {
    console.error(
      'Failed to clear appearance cache:',
      error
    )
  }
}

// =========================================================
// GET APPEARANCE
// =========================================================

export const getRestaurantAppearance = async () => {
  const response =
    await axiosClient.get(
      '/restaurant/appearance'
    )

  const appearance =
    response.data?.appearance ??
    response.data ??
    {}

  const normalizedAppearance =
    normalizeAppearance(
      appearance
    )

  // Save fresh API data in cache
  setCachedAppearance(
    normalizedAppearance
  )

  return normalizedAppearance
}

// =========================================================
// SAVE APPEARANCE
// =========================================================

export const saveRestaurantAppearance = async (
  payload = {}
) => {
  const formData = new FormData()

  // =======================================================
  // TEXT FIELDS
  // =======================================================

  const fields = [
    'primary_color',
    'secondary_color',
    'text_color',
    'background_color',
    'font_family',
  ]

  fields.forEach((field) => {
    const value =
      payload[field]

    if (
      value !== undefined &&
      value !== null &&
      value !== ''
    ) {
      formData.append(
        field,
        String(value)
      )
    }
  })

  // =======================================================
  // IMAGE FILES
  // =======================================================

  ;[
    'logo',
    'header_image',
    'background_image',
  ].forEach((field) => {
    const file =
      payload[`${field}File`]

    if (file instanceof File) {
      formData.append(
        field,
        file
      )
    }

    // =====================================================
    // REMOVE IMAGE
    // =====================================================

    if (
      payload[`remove_${field}`] === true
    ) {
      formData.append(
        `remove_${field}`,
        '1'
      )
    }
  })

  // =======================================================
  // API REQUEST
  // =======================================================

  const response =
    await axiosClient.post(
      '/restaurant/appearance',
      formData,
      {
        headers: {
          'Content-Type':
            'multipart/form-data',
        },
      }
    )

  // =======================================================
  // RESPONSE
  // =======================================================

  const appearance =
    response.data?.appearance ??
    response.data ??
    {}

  const normalizedAppearance =
    normalizeAppearance(
      appearance
    )

  // Update cache after successful save
  setCachedAppearance(
    normalizedAppearance
  )

  return normalizedAppearance
}