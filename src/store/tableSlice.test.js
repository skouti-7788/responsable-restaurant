import { describe, it, expect, beforeEach } from 'vitest'
import reducer, {
  setTables,
  setRestaurantInfo,
  setTablesLoading,
  setTablesError,
  clearTables,
} from './tableSlice'

describe('tableSlice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const baseState = {
    tables: [],
    restaurantId: null,
    restaurantSlug: null,
    loading: false,
    error: '',
  }

  it('returns the initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' })

    expect(state.tables).toEqual([])
    expect(state.loading).toBe(false)
    expect(state.error).toBe('')
  })

  it('stores the restaurant id and slug via setRestaurantInfo', () => {
    const state = reducer(baseState, setRestaurantInfo({ id: 5, slug: 'my-restaurant' }))

    expect(state.restaurantId).toBe(5)
    expect(state.restaurantSlug).toBe('my-restaurant')
  })

  it('falls back to null id/slug when payload fields are missing', () => {
    const state = reducer(baseState, setRestaurantInfo({}))

    expect(state.restaurantId).toBeNull()
    expect(state.restaurantSlug).toBeNull()
  })

  it('replaces the tables list via setTables', () => {
    const withRestaurant = reducer(baseState, setRestaurantInfo({ id: 1, slug: 'r1' }))

    const tables = [{ id: 1, number: 1 }, { id: 2, number: 2 }]
    const state = reducer(withRestaurant, setTables(tables))

    expect(state.tables).toEqual(tables)
  })

  it('caches tables in localStorage under the current restaurant id', () => {
    const withRestaurant = reducer(baseState, setRestaurantInfo({ id: 7, slug: 'r7' }))
    const tables = [{ id: 1, number: 1 }]

    reducer(withRestaurant, setTables(tables))

    const cacheKeys = Object.keys(localStorage).filter((k) => k.includes('restaurant_tables_cache'))
    expect(cacheKeys.length).toBeGreaterThan(0)
  })

  it('toggles the loading flag via setTablesLoading', () => {
    const state = reducer(baseState, setTablesLoading(true))

    expect(state.loading).toBe(true)
  })

  it('stores an error message via setTablesError', () => {
    const state = reducer(baseState, setTablesError('Failed to load tables'))

    expect(state.error).toBe('Failed to load tables')
  })

  it('resets everything back to defaults via clearTables', () => {
    const populated = {
      tables: [{ id: 1, number: 1 }],
      restaurantId: 3,
      restaurantSlug: 'r3',
      loading: true,
      error: 'oops',
    }

    const state = reducer(populated, clearTables())

    expect(state.tables).toEqual([])
    expect(state.restaurantId).toBeNull()
    expect(state.restaurantSlug).toBeNull()
    expect(state.loading).toBe(false)
    expect(state.error).toBe('')
  })
})
