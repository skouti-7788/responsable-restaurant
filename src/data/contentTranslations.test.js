import { beforeEach, describe, expect, it, vi } from 'vitest'
import axiosClient from '../api/axiosClient'
import {
  saveMealTranslations,
  saveCategoryTranslations,
  saveRestaurantTranslations,
} from './contentTranslations'

vi.mock('../api/axiosClient', () => ({
  default: {
    put: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
  },
}))

describe('manual content translation persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deletes a cleared manual meal translation', async () => {
    await saveMealTranslations(7, 12, {
      fr: { name: '', description: '', dirty: true, is_manual: true },
    })

    expect(axiosClient.delete).toHaveBeenCalledWith(
      '/restaurants/7/meals/12/translations/fr',
    )
    expect(axiosClient.put).not.toHaveBeenCalled()
  })

  it('deletes a cleared manual category translation', async () => {
    await saveCategoryTranslations(7, 4, {
      ar: { name: '   ', description: '', dirty: true, is_manual: true },
    })

    expect(axiosClient.delete).toHaveBeenCalledWith(
      '/restaurants/7/categories/4/translations/ar',
    )
  })

  it('deletes a cleared manual restaurant translation', async () => {
    await saveRestaurantTranslations(7, {
      en: { name: '', description: '', dirty: true, is_manual: true },
    })

    expect(axiosClient.delete).toHaveBeenCalledWith(
      '/restaurants/7/translations/en',
    )
  })

  it('does not delete an empty translation that was never manually saved', async () => {
    await saveMealTranslations(7, 12, {
      fr: { name: '', description: '', dirty: true, is_manual: false },
    })

    expect(axiosClient.delete).not.toHaveBeenCalled()
    expect(axiosClient.put).not.toHaveBeenCalled()
  })

  it('updates a non-empty dirty translation normally', async () => {
    await saveRestaurantTranslations(7, {
      fr: { name: 'Mon restaurant', description: 'Cuisine', dirty: true, is_manual: true },
    })

    expect(axiosClient.put).toHaveBeenCalledWith(
      '/restaurants/7/translations/fr',
      { name: 'Mon restaurant', description: 'Cuisine' },
    )
    expect(axiosClient.delete).not.toHaveBeenCalled()
  })
})
