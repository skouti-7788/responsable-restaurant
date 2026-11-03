import { beforeEach, describe, expect, it, vi } from 'vitest'
import axiosClient from '../api/axiosClient'
import {
  saveMealTranslations,
  saveCategoryTranslations,
  saveRestaurantTranslations,
  getMealTranslations,
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

  it('loads only supported languages and normalizes translation metadata', async () => {
    axiosClient.get.mockResolvedValue({
      data: {
        translations: [
          { language: 'fr', name: '  Tajine  ', description: null, is_manual: 1 },
          { language: 'ar', name: 'طاجين', description: 'وصف', is_manual: 0 },
          { language: 'de', name: 'Nicht unterstützt', description: '', is_manual: true },
        ],
      },
    })

    await expect(getMealTranslations(7, 12)).resolves.toEqual({
      fr: { name: '  Tajine  ', description: '', is_manual: true, dirty: false },
      ar: { name: 'طاجين', description: 'وصف', is_manual: false, dirty: false },
    })

    expect(axiosClient.get).toHaveBeenCalledWith(
      '/restaurants/7/meals/12/translations',
    )
  })

  it('interprets string metadata flags without treating the string zero as true', async () => {
    axiosClient.get.mockResolvedValue({
      data: {
        translations: [
          { language: 'fr', name: 'Traduction automatique', is_manual: '0' },
          { language: 'ar', name: 'ترجمة يدوية', is_manual: 'true' },
          { language: 'en', name: 'Manual translation', is_manual: '1' },
        ],
      },
    })

    await expect(getMealTranslations(7, 12)).resolves.toMatchObject({
      fr: { is_manual: false },
      ar: { is_manual: true },
      en: { is_manual: true },
    })
  })

  it('returns an empty translation map when the API has no translation rows', async () => {
    axiosClient.get.mockResolvedValue({ data: { translations: null } })

    await expect(getMealTranslations(7, 12)).resolves.toEqual({})
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
