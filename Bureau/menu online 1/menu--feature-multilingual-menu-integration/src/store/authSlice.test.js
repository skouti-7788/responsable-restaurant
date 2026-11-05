import { describe, it, expect, beforeEach, vi } from 'vitest'
import reducer, { logout, loginUser, registerUser, fetchCurrentUser } from './authSlice'

describe('authSlice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns the initial state when localStorage is empty', () => {
    const state = reducer(undefined, { type: '@@INIT' })

    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.status).toBe('idle')
    expect(state.error).toBeNull()
  })

  it('clears user, token and localStorage on logout', () => {
    localStorage.setItem('token', 'abc123')
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test' }))

    const state = reducer(
      { user: { id: 1, name: 'Test' }, token: 'abc123', status: 'succeeded', error: null },
      logout()
    )

    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })

  it('sets status to loading while login is pending', () => {
    const state = reducer(
      { user: null, token: null, status: 'idle', error: 'previous error' },
      { type: loginUser.pending.type }
    )

    expect(state.status).toBe('loading')
    expect(state.error).toBeNull()
  })

  it('stores the user and token in state and localStorage when login succeeds', () => {
    const payload = { user: { id: 1, name: 'Owner' }, token: 'token-xyz' }

    const state = reducer(
      { user: null, token: null, status: 'loading', error: null },
      { type: loginUser.fulfilled.type, payload }
    )

    expect(state.status).toBe('succeeded')
    expect(state.user).toEqual(payload.user)
    expect(state.token).toBe('token-xyz')
    expect(localStorage.getItem('token')).toBe('token-xyz')
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(payload.user)
  })

  it('sets an error and failed status when login is rejected', () => {
    const state = reducer(
      { user: null, token: null, status: 'loading', error: null },
      { type: loginUser.rejected.type, payload: 'Invalid credentials' }
    )

    expect(state.status).toBe('failed')
    expect(state.error).toBe('Invalid credentials')
  })

  it('stores the user and token when registration succeeds', () => {
    const payload = { user: { id: 2, name: 'New Owner' }, token: 'new-token' }

    const state = reducer(
      { user: null, token: null, status: 'idle', error: null },
      { type: registerUser.fulfilled.type, payload }
    )

    expect(state.user).toEqual(payload.user)
    expect(state.token).toBe('new-token')
  })

  it('updates the current user when fetchCurrentUser succeeds', () => {
    const updatedUser = { id: 1, name: 'Updated Name' }

    const state = reducer(
      { user: { id: 1, name: 'Old Name' }, token: 'token', status: 'succeeded', error: null },
      { type: fetchCurrentUser.fulfilled.type, payload: updatedUser }
    )

    expect(state.user).toEqual(updatedUser)
  })
})
