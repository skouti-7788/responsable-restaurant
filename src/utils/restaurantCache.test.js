import test from 'node:test'
import assert from 'node:assert/strict'

const createLocalStorageMock = () => {
  const store = new Map()

  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null
    },
    setItem(key, value) {
      store.set(String(key), String(value))
    },
    removeItem(key) {
      store.delete(String(key))
    },
    clear() {
      store.clear()
    },
    key(index) {
      return Array.from(store.keys())[Number(index)] || null
    },
    get length() {
      return store.size
    },
  }
}

globalThis.localStorage = createLocalStorageMock()

const {
  getRestaurantCacheKey,
  getRestaurantCache,
  setRestaurantCache,
  clearRestaurantCachesById,
} = await import('./restaurantCache.js')

test('restaurant cache keys never use object IDs', () => {
  assert.equal(
    getRestaurantCacheKey('restaurant_meals_cache', { id: 3 }),
    null,
  )

  assert.equal(
    getRestaurantCacheKey('restaurant_meals_cache', 3),
    'restaurant_meals_cache_3',
  )
})

test('invalid JSON cache entries are removed safely', () => {
  globalThis.localStorage.clear()
  globalThis.localStorage.setItem('restaurant_meals_cache_3', '{bad json')

  assert.equal(getRestaurantCache('restaurant_meals_cache', 3), null)
  assert.equal(globalThis.localStorage.getItem('restaurant_meals_cache_3'), null)
})

test('cache ownership is enforced for restaurant-specific arrays', () => {
  globalThis.localStorage.clear()

  setRestaurantCache('restaurant_meals_cache', 3, [
    { id: 1, restaurant_id: 3 },
    { id: 2, restaurant_id: 2 },
  ])

  assert.deepEqual(getRestaurantCache('restaurant_meals_cache', 3), [
    { id: 1, restaurant_id: 3 },
  ])
})

test('remove cache by restaurant id removes only matching restaurant data', () => {
  globalThis.localStorage.clear()
  setRestaurantCache('restaurant_meals_cache', 2, [{ id: 99, restaurant_id: 2 }])
  setRestaurantCache('restaurant_meals_cache', 3, [{ id: 100, restaurant_id: 3 }])

  clearRestaurantCachesById(2)

  assert.equal(globalThis.localStorage.getItem('restaurant_meals_cache_2'), null)
  assert.deepEqual(
    JSON.parse(globalThis.localStorage.getItem('restaurant_meals_cache_3')),
    [{ id: 100, restaurant_id: 3 }],
  )
})
