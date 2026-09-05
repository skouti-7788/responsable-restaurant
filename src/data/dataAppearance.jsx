import axiosClient from '../api/axiosClient'

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

export const normalizeAppearance = (appearance = {}) => ({
  ...DEFAULT_APPEARANCE,
  ...appearance,
})

export const getRestaurantAppearance = async () => {
  const response = await axiosClient.get('/restaurant/appearance')

  const appearance = response.data?.appearance ?? response.data ?? {}

  return normalizeAppearance(appearance)
}

export const saveRestaurantAppearance = async (payload = {}) => {
  const formData = new FormData()

  const fields = [
    'primary_color',
    'secondary_color',
    'text_color',
    'background_color',
    'font_family',
  ]

  fields.forEach((field) => {
    const value = payload[field]

    if (value !== undefined && value !== null && value !== '') {
      formData.append(field, String(value))
    }
  })

  ;['logo', 'header_image', 'background_image'].forEach((field) => {
    const file = payload[`${field}File`]

    if (file instanceof File) {
      formData.append(field, file)
    }

    if (payload[`remove_${field}`] === true) {
      formData.append(`remove_${field}`, '1')
    }
  })

  const response = await axiosClient.post('/restaurant/appearance', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  const appearance = response.data?.appearance ?? response.data ?? {}

  return normalizeAppearance(appearance)
}
