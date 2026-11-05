import { describe, it, expect } from 'vitest'
import reducer, { fetchRestaurant } from './restaurantSlice'

describe('restaurantSlice', () => {
  it('returns the initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' })

    expect(state.data).toBeNull()
    expect(state.status).toBe('idle')
  })

  it('sets status to loading while fetching', () => {
    const state = reducer(
      { data: null, status: 'idle', error: null },
      { type: fetchRestaurant.pending.type }
    )

    expect(state.status).toBe('loading')
  })

  it('stores the restaurant data when the fetch succeeds', () => {
    const payload = { id: 1, name: 'La Belle Table' }

    const state = reducer(
      { data: null, status: 'loading', error: null },
      { type: fetchRestaurant.fulfilled.type, payload }
    )

    expect(state.status).toBe('succeeded')
    expect(state.data).toEqual(payload)
  })

  it('stores the error and marks the fetch as failed when it fails', () => {
    const state = reducer(
      { data: null, status: 'loading', error: null },
      { type: fetchRestaurant.rejected.type, payload: 'Restaurant not found' }
    )

    expect(state.status).toBe('failed')
    expect(state.error).toBe('Restaurant not found')
  })
})
