import { describe, it, expect } from 'vitest'
import reducer, { fetchCategories, createCategory } from './menuSlice'

describe('menuSlice', () => {
  it('returns the initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' })

    expect(state.categories).toEqual([])
    expect(state.status).toBe('idle')
  })

  it('sets categories when fetchCategories succeeds', () => {
    const payload = { data: [{ id: 1, name: 'Starters' }] }

    const state = reducer(
      { categories: [], status: 'idle', error: null },
      { type: fetchCategories.fulfilled.type, payload }
    )

    expect(state.categories).toEqual(payload.data)
  })

  it('adds the new category to the front of the list when created', () => {
    const initial = {
      categories: [{ id: 1, name: 'Starters' }],
      status: 'idle',
      error: null,
    }

    const payload = { data: { id: 2, name: 'Desserts' } }

    const state = reducer(initial, {
      type: createCategory.fulfilled.type,
      payload,
    })

    expect(state.categories).toHaveLength(2)
    expect(state.categories[0].name).toBe('Desserts')
    expect(state.categories[1].name).toBe('Starters')
  })
})
