import { describe, it, expect } from 'vitest'
import reducer, { fetchOrders, updateOrderStatus } from './orderSlice'

describe('orderSlice', () => {
  it('returns the initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' })

    expect(state.list).toEqual([])
    expect(state.status).toBe('idle')
  })

  it('replaces the list when orders are fetched (paginated shape)', () => {
    const payload = { data: [{ id: 1, status: 'pending' }, { id: 2, status: 'ready' }] }

    const state = reducer(
      { list: [], status: 'idle', error: null },
      { type: fetchOrders.fulfilled.type, payload }
    )

    expect(state.list).toHaveLength(2)
    expect(state.list[0].id).toBe(1)
  })

  it('replaces the list when orders are fetched (plain array shape)', () => {
    const payload = [{ id: 1, status: 'pending' }]

    const state = reducer(
      { list: [], status: 'idle', error: null },
      { type: fetchOrders.fulfilled.type, payload }
    )

    expect(state.list).toEqual(payload)
  })

  it('updates only the matching order when a status update succeeds', () => {
    const initial = {
      list: [
        { id: 1, status: 'pending' },
        { id: 2, status: 'pending' },
      ],
      status: 'idle',
      error: null,
    }

    const payload = { data: { id: 2, status: 'preparing' } }

    const state = reducer(initial, {
      type: updateOrderStatus.fulfilled.type,
      payload,
    })

    expect(state.list.find((o) => o.id === 1).status).toBe('pending')
    expect(state.list.find((o) => o.id === 2).status).toBe('preparing')
  })

  it('leaves the list unchanged when the updated order id is not found', () => {
    const initial = {
      list: [{ id: 1, status: 'pending' }],
      status: 'idle',
      error: null,
    }

    const state = reducer(initial, {
      type: updateOrderStatus.fulfilled.type,
      payload: { id: 999, status: 'completed' },
    })

    expect(state.list).toEqual(initial.list)
  })
})
