import { describe, it, expect } from 'vitest'
import reducer, {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  updateOrder,
  removeOrder,
  clearOrdersError,
  setNotafication,
  clearNotafication,
} from './orderSlice'

describe('orderSlice (admin dashboard)', () => {
  const baseState = { items: [], loading: false, error: null, notafication: false }

  it('returns the initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' })

    expect(state.items).toEqual([])
    expect(state.loading).toBe(false)
    expect(state.notafication).toBe(false)
  })

  it('sets loading true and clears error on fetchOrdersStart', () => {
    const state = reducer({ ...baseState, error: 'old error' }, fetchOrdersStart())

    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
  })

  it('stores the fetched orders on fetchOrdersSuccess', () => {
    const orders = [{ id: 1, status: 'pending' }, { id: 2, status: 'ready' }]

    const state = reducer({ ...baseState, loading: true }, fetchOrdersSuccess(orders))

    expect(state.loading).toBe(false)
    expect(state.items).toEqual(orders)
  })

  it('defaults to an empty list if the payload is not an array', () => {
    const state = reducer({ ...baseState, loading: true }, fetchOrdersSuccess(null))

    expect(state.items).toEqual([])
  })

  it('stores an error message on fetchOrdersFailure', () => {
    const state = reducer({ ...baseState, loading: true }, fetchOrdersFailure('Network error'))

    expect(state.loading).toBe(false)
    expect(state.error).toBe('Network error')
  })

  it('falls back to a default error message when none is provided', () => {
    const state = reducer({ ...baseState, loading: true }, fetchOrdersFailure(undefined))

    expect(state.error).toBe('Unable to load orders')
  })

  it('updates the matching order in place via updateOrder', () => {
    const initial = {
      ...baseState,
      items: [{ id: 1, status: 'pending' }, { id: 2, status: 'pending' }],
    }

    const state = reducer(initial, updateOrder({ id: 2, status: 'ready' }))

    expect(state.items.find((o) => o.id === 1).status).toBe('pending')
    expect(state.items.find((o) => o.id === 2).status).toBe('ready')
  })

  it('matches order ids loosely (string vs number) when updating', () => {
    const initial = { ...baseState, items: [{ id: 1, status: 'pending' }] }

    const state = reducer(initial, updateOrder({ id: '1', status: 'ready' }))

    expect(state.items[0].status).toBe('ready')
  })

  it('does nothing when updateOrder receives a payload without an id', () => {
    const initial = { ...baseState, items: [{ id: 1, status: 'pending' }] }

    const state = reducer(initial, updateOrder({ status: 'ready' }))

    expect(state.items).toEqual(initial.items)
  })

  it('removes the matching order via removeOrder', () => {
    const initial = {
      ...baseState,
      items: [{ id: 1 }, { id: 2 }, { id: 3 }],
    }

    const state = reducer(initial, removeOrder(2))

    expect(state.items.map((o) => o.id)).toEqual([1, 3])
  })

  it('clears the error via clearOrdersError', () => {
    const state = reducer({ ...baseState, error: 'oops' }, clearOrdersError())

    expect(state.error).toBeNull()
  })

  it('sets and clears the notification flag', () => {
    const withNotif = reducer(baseState, setNotafication(true))
    expect(withNotif.notafication).toBe(true)

    const cleared = reducer(withNotif, clearNotafication())
    expect(cleared.notafication).toBe(false)
  })
})
