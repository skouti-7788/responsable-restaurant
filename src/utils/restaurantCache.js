const CACHE_PREFIXES = [
  'restaurant_categories_cache',
  'restaurant_meals_cache',
  'restaurant_orders_cache',
  'restaurant_tables_cache',
  'restaurant_dashboard_cache',
  'restaurant_staff_cache',
  'restaurant_restaurants_cache',
  'restaurant_profile_cache',
]

const LEGACY_GLOBAL_KEYS = [
  'restaurant_categories_cache',
  'restaurant_meals_cache',
  'restaurant_orders_cache',
  'restaurant_tables_cache',
  'restaurant_dashboard_cache',
  'restaurant_staff_cache',
  'restaurant_restaurants_cache',
  'restaurant_current_cache',
]

const getStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage
  }

  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    return globalThis.localStorage
  }

  return null
}

export const normalizeRestaurantId = (restaurantId) => {
  if (
    restaurantId === null ||
    restaurantId === undefined ||
    restaurantId === ''
  ) {
    return null
  }

  if (typeof restaurantId === 'object') {
    return null
  }

  const value = String(restaurantId).trim()

  if (
    !value ||
    value === 'undefined' ||
    value === 'null' ||
    value === '[object Object]'
  ) {
    return null
  }

  const numericValue = Number(value)

  if (Number.isFinite(numericValue)) {
    return String(numericValue)
  }

  return value
}

export const getCurrentRestaurantId = () => {
  try {
    const storage = getStorage()

    if (!storage) {
      return null
    }

    const storedUser = storage.getItem('restaurant_user')

    if (!storedUser) {
      return null
    }

    const user = JSON.parse(storedUser)
    const id = user?.restaurant_id ?? user?.restaurantId ?? null

    return normalizeRestaurantId(id)
  } catch (error) {
    console.error('Failed to read current restaurant id:', error)
    return null
  }
}

export const getRestaurantCacheKey = (prefix, restaurantId) => {
  if (!prefix || typeof prefix !== 'string') {
    return null
  }

  const id = normalizeRestaurantId(restaurantId)

  if (!id) {
    return null
  }

  return `${prefix}_${id}`
}

const filterRestaurantScopedArray = (data, restaurantId) => {
  if (!Array.isArray(data)) {
    return data
  }

  const normalizedId = normalizeRestaurantId(restaurantId)

  if (!normalizedId) {
    return data
  }

  const hasRestaurantOwnershipField = data.some(
    (item) =>
      item &&
      typeof item === 'object' &&
      (
        Object.prototype.hasOwnProperty.call(item, 'restaurant_id') ||
        Object.prototype.hasOwnProperty.call(item, 'restaurantId')
      )
  )

  if (!hasRestaurantOwnershipField) {
    return data
  }

  return data.filter((item) => {
    if (!item || typeof item !== 'object') {
      return true
    }

    const itemRestaurantId =
      item.restaurant_id ?? item.restaurantId ?? null

    return normalizeRestaurantId(itemRestaurantId) === normalizedId
  })
}

export const getRestaurantCache = (prefix, restaurantId) => {
  const storage = getStorage()
  const key = getRestaurantCacheKey(prefix, restaurantId)

  if (!storage || !key) {
    return null
  }

  try {
    const raw = storage.getItem(key)

    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)

    return filterRestaurantScopedArray(parsed, restaurantId)
  } catch (error) {
    console.error(`Read restaurant cache error (${key}):`, error)
    storage.removeItem(key)
    return null
  }
}

export const setRestaurantCache = (prefix, restaurantId, data) => {
  const storage = getStorage()
  const key = getRestaurantCacheKey(prefix, restaurantId)

  if (!storage || !key) {
    return
  }

  try {
    storage.setItem(key, JSON.stringify(data ?? []))
  } catch (error) {
    console.error(`Save restaurant cache error (${key}):`, error)
  }
}

export const removeRestaurantCache = (prefix, restaurantId) => {
  const storage = getStorage()
  const key = getRestaurantCacheKey(prefix, restaurantId)

  if (!storage || !key) {
    return
  }

  storage.removeItem(key)
}

export const clearRestaurantCachesById = (restaurantId) => {
  const storage = getStorage()
  const id = normalizeRestaurantId(restaurantId)

  if (!storage || !id) {
    return
  }

  const keysToRemove = []

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index)

    if (!key) {
      continue
    }

    const isScopedRestaurantCache = CACHE_PREFIXES.some(
      (prefix) => key.startsWith(`${prefix}_${id}`)
    )

    if (isScopedRestaurantCache || key === 'restaurant_current_cache') {
      keysToRemove.push(key)
    }
  }

  keysToRemove.forEach((key) => storage.removeItem(key))
}

export const clearLegacyRestaurantCaches = () => {
  const storage = getStorage()

  if (!storage) {
    return
  }

  LEGACY_GLOBAL_KEYS.forEach((key) => {
    storage.removeItem(key)
  })
}

export const clearRestaurantCaches = () => {
  const storage = getStorage()

  if (!storage) {
    return
  }

  clearLegacyRestaurantCaches()

  const keysToRemove = []

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index)

    if (!key) {
      continue
    }

    const hasRestaurantCachePrefix = CACHE_PREFIXES.some(
      (prefix) => key.startsWith(`${prefix}_`)
    )

    const isCurrentRestaurantCache = key === 'restaurant_current_cache'

    if (hasRestaurantCachePrefix || isCurrentRestaurantCache) {
      keysToRemove.push(key)
    }
  }

  keysToRemove.forEach((key) => storage.removeItem(key))
}

export default {
  normalizeRestaurantId,
  getCurrentRestaurantId,
  getRestaurantCacheKey,
  getRestaurantCache,
  setRestaurantCache,
  removeRestaurantCache,
  clearRestaurantCachesById,
  clearLegacyRestaurantCaches,
  clearRestaurantCaches,
}
