import axiosClient from '../api/axiosClient'

export const CONTENT_LANGUAGES = [
  { code: 'ar', label: 'العربية' },
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
]

const normalizeTranslations = (data) => {
  const rows = Array.isArray(data?.translations) ? data.translations : []
  return rows.reduce((result, row) => {
    if (['ar', 'fr', 'en'].includes(row.language)) {
      result[row.language] = {
        name: row.name || '',
        description: row.description || '',
        is_manual: Boolean(row.is_manual),
        dirty: false,
      }
    }
    return result
  }, {})
}

export const getMealTranslations = async (restaurantId, mealId) => {
  const response = await axiosClient.get(
    `/restaurants/${restaurantId}/meals/${mealId}/translations`
  )
  return normalizeTranslations(response.data)
}

export const getCategoryTranslations = async (restaurantId, categoryId) => {
  const response = await axiosClient.get(
    `/restaurants/${restaurantId}/categories/${categoryId}/translations`
  )
  return normalizeTranslations(response.data)
}

export const saveMealTranslations = async (restaurantId, mealId, translations) => {
  for (const language of ['ar', 'fr', 'en']) {
    const value = translations?.[language]
    if (!value?.name?.trim() || (!value?.dirty && !value?.is_manual)) continue
    await axiosClient.put(
      `/restaurants/${restaurantId}/meals/${mealId}/translations/${language}`,
      {
        name: value.name.trim(),
        description: value.description || '',
      }
    )
  }
}

export const saveCategoryTranslations = async (restaurantId, categoryId, translations) => {
  for (const language of ['ar', 'fr', 'en']) {
    const value = translations?.[language]
    if (!value?.name?.trim() || (!value?.dirty && !value?.is_manual)) continue
    await axiosClient.put(
      `/restaurants/${restaurantId}/categories/${categoryId}/translations/${language}`,
      {
        name: value.name.trim(),
        description: value.description || '',
      }
    )
  }
}
