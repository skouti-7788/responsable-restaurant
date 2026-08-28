import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
} from 'lucide-react'

import axiosClient from '../../api/axiosClient'
import translations from '../../i18n/translations'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'

const CategoriesPage = () => {
  const { language } = useSelector((state) => state.ui)

  const t =
    translations[language] ||
    translations.en ||
    {}

  // =====================================================
  // CACHE KEY
  // =====================================================

  const CATEGORIES_CACHE_KEY =
    'restaurant_categories_cache'

  const RESTAURANT_CACHE_KEY =
    'restaurant_current_cache'

  // =====================================================
  // LOAD CACHE HELPERS
  // =====================================================

  const getCachedCategories = () => {
    try {
      const cached =
        localStorage.getItem(
          CATEGORIES_CACHE_KEY
        )

      return cached
        ? JSON.parse(cached)
        : []
    } catch (err) {
      console.error(
        'Read categories cache error:',
        err
      )

      return []
    }
  }

  const getCachedRestaurant = () => {
    try {
      const cached =
        localStorage.getItem(
          RESTAURANT_CACHE_KEY
        )

      return cached
        ? JSON.parse(cached)
        : null
    } catch (err) {
      console.error(
        'Read restaurant cache error:',
        err
      )

      return null
    }
  }

  // =====================================================
  // STATE
  // =====================================================

  const [categories, setCategories] =
    useState(() =>
      getCachedCategories()
    )

  const [restaurantId, setRestaurantId] =
    useState(() => {
      const restaurant =
        getCachedRestaurant()

      return restaurant?.id || null
    })

  const [loading, setLoading] =
    useState(() => {
      try {
        return !localStorage.getItem(
          CATEGORIES_CACHE_KEY
        )
      } catch {
        return true
      }
    })

  const [saving, setSaving] =
    useState(false)

  const [deletingId, setDeletingId] =
    useState(null)

  const [error, setError] =
    useState('')

  // =====================================================
  // MODAL
  // =====================================================

  const [isOpen, setIsOpen] =
    useState(false)

  const [editing, setEditing] =
    useState(null)

  // =====================================================
  // FORM
  // =====================================================

  const [form, setForm] = useState({
    name: '',
    description: '',
  })

  // =====================================================
  // SAVE CATEGORIES TO CACHE
  // =====================================================

  const saveCategoriesToCache = (
    data
  ) => {
    try {
      localStorage.setItem(
        CATEGORIES_CACHE_KEY,
        JSON.stringify(data)
      )
    } catch (err) {
      console.error(
        'Save categories cache error:',
        err
      )
    }
  }

  // =====================================================
  // SAVE RESTAURANT TO CACHE
  // =====================================================

  const saveRestaurantToCache = (
    restaurant
  ) => {
    try {
      localStorage.setItem(
        RESTAURANT_CACHE_KEY,
        JSON.stringify({
          id:
            restaurant?.id ||
            null,

          slug:
            restaurant?.slug ||
            null,
        })
      )
    } catch (err) {
      console.error(
        'Save restaurant cache error:',
        err
      )
    }
  }

  // =====================================================
  // LOAD CATEGORIES FROM API
  // =====================================================

  const loadCategories =
    useCallback(async () => {
      setError('')

      try {
        // -------------------------------------------------
        // GET RESTAURANT
        // -------------------------------------------------

        const restaurantsResponse =
          await axiosClient.get(
            '/restaurants'
          )

        const restaurantsData =
          restaurantsResponse.data
            ?.data ||
          restaurantsResponse.data ||
          []

        const restaurant =
          restaurantsData[0] ||
          null

        if (!restaurant?.id) {
          setCategories([])
          setRestaurantId(null)

          localStorage.removeItem(
            CATEGORIES_CACHE_KEY
          )

          localStorage.removeItem(
            RESTAURANT_CACHE_KEY
          )

          return
        }

        const id =
          restaurant.id

        setRestaurantId(id)

        saveRestaurantToCache(
          restaurant
        )

        // -------------------------------------------------
        // GET CATEGORIES
        // -------------------------------------------------

        const categoriesResponse =
          await axiosClient.get(
            `/restaurants/${id}/categories`
          )

        const data =
          categoriesResponse.data
            ?.data ||
          categoriesResponse.data ||
          []

        const normalizedCategories =
          Array.isArray(data)
            ? data
            : []

        // -------------------------------------------------
        // UPDATE STATE
        // -------------------------------------------------

        setCategories(
          normalizedCategories
        )

        // -------------------------------------------------
        // UPDATE CACHE
        // -------------------------------------------------

        saveCategoriesToCache(
          normalizedCategories
        )
      } catch (err) {
        console.error(
          'Load categories error:',
          err
        )

        /*
         * مهم:
         * إلا API فشل، ما نمسحوش
         * categories الموجودة فـ cache.
         */

        setError(
          err?.response?.data
            ?.message ||
          err?.message ||
          t.loadCategoriesError ||
          'Failed to load categories.'
        )
      } finally {
        setLoading(false)
      }
    }, [t.loadCategoriesError])

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      if (cancelled) return

      await loadCategories()
    }

    run()

    return () => {
      cancelled = true
    }
  }, [loadCategories])

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {
    setLoading(true)

    await loadCategories()
  }

  // =====================================================
  // OPEN MODAL
  // =====================================================

  const handleOpen = (
    category
  ) => {
    setEditing(
      category || null
    )

    setForm(
      category
        ? {
            name:
              category.name ||
              '',

            description:
              category.description ||
              '',
          }
        : {
            name: '',
            description: '',
          }
    )

    setError('')
    setIsOpen(true)
  }

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleClose = () => {
    if (saving) return

    setIsOpen(false)
    setEditing(null)

    setForm({
      name: '',
      description: '',
    })
  }

  // =====================================================
  // SAVE CATEGORY
  // =====================================================

  const handleSave = async () => {
    if (!restaurantId) {
      setError(
        t.restaurantNotFound ||
        'Restaurant not found.'
      )

      return
    }

    if (!form.name.trim()) {
      setError(
        t.categoryNameRequired ||
        'Category name is required.'
      )

      return
    }

    setSaving(true)
    setError('')

    try {
      let response

      const payload = {
        name:
          form.name.trim(),

        description:
          form.description?.trim() ||
          '',

        status: 'active',
      }

      // -------------------------------------------------
      // EDIT
      // -------------------------------------------------

      if (editing) {
        response =
          await axiosClient.put(
            `/restaurants/${restaurantId}/categories/${editing.id}`,
            payload
          )

        const updatedCategory =
          response.data?.data ||
          response.data

        setCategories(
          (current) => {
            const updated =
              current.map(
                (category) =>
                  category.id ===
                  editing.id
                    ? updatedCategory
                    : category
              )

            saveCategoriesToCache(
              updated
            )

            return updated
          }
        )
      }

      // -------------------------------------------------
      // CREATE
      // -------------------------------------------------

      else {
        response =
          await axiosClient.post(
            `/restaurants/${restaurantId}/categories`,
            payload
          )

        const newCategory =
          response.data?.data ||
          response.data

        setCategories(
          (current) => {
            const updated = [
              ...current,
              newCategory,
            ]

            saveCategoriesToCache(
              updated
            )

            return updated
          }
        )
      }

      // -------------------------------------------------
      // CLOSE
      // -------------------------------------------------

      setIsOpen(false)
      setEditing(null)

      setForm({
        name: '',
        description: '',
      })
    } catch (err) {
      console.error(
        'Save category error:',
        err?.response?.data ||
          err
      )

      setError(
        err?.response?.data
          ?.message ||
        err?.message ||
        t.saveCategoryError ||
        'Failed to save category.'
      )
    } finally {
      setSaving(false)
    }
  }

  // =====================================================
  // DELETE CATEGORY
  // =====================================================

  const handleDelete = async (
    category
  ) => {
    if (
      !restaurantId ||
      !category?.id
    ) {
      return
    }

    const categoryName =
      category.name ||
      'Category'

    const confirmed =
      window.confirm(
        `${t.deleteCategoryConfirm || 'Delete category'} "${categoryName}"?`
      )

    if (!confirmed) return

    setDeletingId(
      category.id
    )

    setError('')

    try {
      await axiosClient.delete(
        `/restaurants/${restaurantId}/categories/${category.id}`
      )

      setCategories(
        (current) => {
          const updated =
            current.filter(
              (item) =>
                item.id !==
                category.id
            )

          saveCategoriesToCache(
            updated
          )

          return updated
        }
      )
    } catch (err) {
      console.error(
        'Delete category error:',
        err?.response?.data ||
          err
      )

      setError(
        err?.response?.data
          ?.message ||
        err?.message ||
        t.deleteCategoryError ||
        'Failed to delete category.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="text-slate-900 dark:text-slate-100">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {t.categories}
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t.categoriesDescription ||
              'Create categories and organize your menu.'}
          </p>

        </div>

        <div className="flex gap-2">

          {/* REFRESH */}

          <button
            type="button"
            onClick={
              handleRefresh
            }
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >

            <RefreshCw
              size={17}
              className={
                loading
                  ? 'animate-spin'
                  : ''
              }
            />

            <span className="hidden sm:inline">
              {t.refresh ||
                'Refresh'}
            </span>

          </button>

          {/* ADD */}

          <Button
            onClick={() =>
              handleOpen(null)
            }
          >
            <span className="flex items-center gap-2">
              <Plus size={17} />
              {t.addCategory}
            </span>
          </Button>

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
          {error}
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (

        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" />

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {t.loading ||
              'Loading...'}
          </p>

        </div>

      ) : categories.length ===
        0 ? (

        /* =================================================
            EMPTY
        ================================================= */

        <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-card dark:border-slate-800 dark:bg-slate-900">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-500">

            <Plus size={30} />

          </div>

          <h2 className="mt-5 text-xl font-semibold">
            {t.noCategoriesAdded ||
              'No categories added yet.'}
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t.categoriesDescription ||
              'Create your first category to organize your menu.'}
          </p>

          <button
            type="button"
            onClick={() =>
              handleOpen(null)
            }
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
          >

            <Plus size={18} />

            {t.addCategory}

          </button>

        </div>

      ) : (

        /* =================================================
            TABLE
        ================================================= */

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">

          <div className="overflow-x-auto">

            <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">

              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950/80 dark:text-slate-400">

                <tr>

                  <th className="px-6 py-4 text-left font-medium">
                    {t.name}
                  </th>

                  <th className="px-6 py-4 text-left font-medium">
                    {t.description}
                  </th>

                  <th className="px-6 py-4 text-right font-medium">
                    {t.actions}
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">

                {categories.map(
                  (category) => (

                    <tr
                      key={
                        category.id
                      }
                      className="bg-white transition-colors hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/50"
                    >

                      {/* NAME */}

                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">

                        {category.name}

                      </td>

                      {/* DESCRIPTION */}

                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">

                        {category.description ||
                          '—'}

                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-4 text-right">

                        <div className="inline-flex items-center gap-2">

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              handleOpen(
                                category
                              )
                            }
                            disabled={
                              deletingId ===
                              category.id
                            }
                            className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                          >

                            <Pencil
                              size={15}
                            />

                            {t.editCategory}

                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                category
                              )
                            }
                            disabled={
                              deletingId ===
                              category.id
                            }
                            className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-3 py-2 text-sm text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
                          >

                            <Trash2
                              size={15}
                              className={
                                deletingId ===
                                category.id
                                  ? 'animate-pulse'
                                  : ''
                              }
                            />

                            {deletingId ===
                            category.id
                              ? t.deleting ||
                                'Deleting...'
                              : t.deleteCategory}

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

      {/* =================================================
          MODAL
      ================================================= */}

      <Modal
        title={
          editing
            ? t.editCategory
            : t.addCategory
        }
        open={isOpen}
        onClose={
          handleClose
        }
        footer={

          <div className="flex justify-end gap-3">

            <Button
              variant="secondary"
              onClick={
                handleClose
              }
              disabled={saving}
            >
              {t.cancel}
            </Button>

            <Button
              onClick={
                handleSave
              }
              disabled={saving}
            >
              {saving
                ? t.saving ||
                  'Saving...'
                : editing
                  ? t.editCategory
                  : t.addCategory}
            </Button>

          </div>

        }
      >

        <div className="grid gap-5">

          <Input
            label={t.name}
            value={
              form.name
            }
            onChange={(e) =>
              setForm({
                ...form,
                name:
                  e.target.value,
              })
            }
          />

          <Input
            label={
              t.description
            }
            value={
              form.description
            }
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value,
              })
            }
          />

        </div>

      </Modal>

    </div>
  )
}

export default CategoriesPage
 
