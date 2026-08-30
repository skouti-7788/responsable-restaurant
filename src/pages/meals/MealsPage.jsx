import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useSelector } from 'react-redux'

import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Utensils,
} from 'lucide-react'

import {
  getRestaurant,
  getRestaurantCategories,
  getRestaurantMeals,
  createMeal,
  updateMeal,
  deleteMeal,
} from '../../data/dataMeals'

import translations from '../../i18n/translations'

const MEALS_CACHE_KEY = 'restaurant_meals_cache'
const CATEGORIES_CACHE_KEY = 'restaurant_categories_cache'
const RESTAURANT_CACHE_KEY = 'restaurant_current_cache'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category_id: '',
  status: 'active',
  featured: false,
  image: '',
  imageFile: null,
}

const MealsPage = () => {
  const { language } = useSelector((state) => state.ui)

  const t =
    translations[language] ||
    translations.en ||
    {}

  // =====================================================
  // CACHE HELPERS
  // =====================================================

  const getCachedRestaurant = () => {
    try {
      const cached = localStorage.getItem(
        RESTAURANT_CACHE_KEY
      )

      return cached
        ? JSON.parse(cached)
        : null
    } catch {
      return null
    }
  }

  const getCachedArray = (key) => {
    try {
      const cached =
        localStorage.getItem(key)

      const parsed = cached
        ? JSON.parse(cached)
        : []

      return Array.isArray(parsed)
        ? parsed
        : []
    } catch {
      return []
    }
  }

  // =====================================================
  // INITIAL CACHE
  // =====================================================

  const cachedRestaurant =
    getCachedRestaurant()

  const cachedMeals =
    getCachedArray(
      MEALS_CACHE_KEY
    )

  const cachedCategories =
    getCachedArray(
      CATEGORIES_CACHE_KEY
    )

  // =====================================================
  // STATE
  // =====================================================

  const [meals, setMeals] =
    useState(cachedMeals)

  const [categories, setCategories] =
    useState(cachedCategories)

  const [restaurantId, setRestaurantId] =
    useState(
      cachedRestaurant?.id || null
    )

  // Loading ديال أول دخول فقط
  // إلا كان cache موجود مايبانش loading
  const [loading, setLoading] =
    useState(
      cachedMeals.length === 0
    )

  // Loading خاص غير بزر Refresh
  const [refreshing, setRefreshing] =
    useState(false)

  const [error, setError] =
    useState('')

  const [saving, setSaving] =
    useState(false)

  const [deletingId, setDeletingId] =
    useState(null)

  // =====================================================
  // MODAL
  // =====================================================

  const [open, setOpen] =
    useState(false)

  const [editing, setEditing] =
    useState(null)

  const [imagePreview, setImagePreview] =
    useState('')

  // =====================================================
  // FORM
  // =====================================================

  const [form, setForm] =
    useState(emptyForm)

  // =====================================================
  // CACHE - MEALS
  // =====================================================

  const saveMealsToCache =
    useCallback((data) => {
      try {
        localStorage.setItem(
          MEALS_CACHE_KEY,
          JSON.stringify(data)
        )
      } catch (err) {
        console.error(
          'Save meals cache error:',
          err
        )
      }
    }, [])

  // =====================================================
  // CACHE - CATEGORIES
  // =====================================================

  const saveCategoriesToCache =
    useCallback((data) => {
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
    }, [])

  // =====================================================
  // CACHE - RESTAURANT
  // =====================================================

  const saveRestaurantToCache =
    useCallback((restaurant) => {
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
    }, [])

  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadMeals =
    useCallback(
      async (showRefreshLoading = false) => {
        if (showRefreshLoading) {
          setRefreshing(true)
        } else if (meals.length === 0) {
          setLoading(true)
        }

        setError('')

        try {
          // -------------------------------------------------
          // RESTAURANT
          // -------------------------------------------------

          const restaurant =
            await getRestaurant()

          if (!restaurant?.id) {
            setError(
              t.restaurantNotFound ||
                'Restaurant not found.'
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
          // CATEGORIES
          // -------------------------------------------------

          const categoriesData =
            await getRestaurantCategories(
              id
            )

          const normalizedCategories =
            Array.isArray(
              categoriesData
            )
              ? categoriesData
              : []

          setCategories(
            normalizedCategories
          )

          saveCategoriesToCache(
            normalizedCategories
          )

          // -------------------------------------------------
          // MEALS
          // -------------------------------------------------

          const mealsData =
            await getRestaurantMeals(
              id
            )

          const normalizedMeals =
            Array.isArray(
              mealsData
            )
              ? mealsData
              : []

          setMeals(
            normalizedMeals
          )

          saveMealsToCache(
            normalizedMeals
          )
        } catch (err) {
          console.error(
            'Load meals/categories error:',
            err
          )

          setError(
            err?.response?.data
              ?.message ||
              err?.message ||
              t.loadMealsError ||
              'Failed to load meals.'
          )
        } finally {
          if (showRefreshLoading) {
            setRefreshing(false)
          } else {
            setLoading(false)
          }
        }
      },
      [
        meals.length,
        saveMealsToCache,
        saveCategoriesToCache,
        saveRestaurantToCache,
        t.restaurantNotFound,
        t.loadMealsError,
      ]
    )

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMeals(false)
    }, 0)

    return () => {
      clearTimeout(timer)
    }
  }, [loadMeals])

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = useCallback(
    async () => {
      await loadMeals(true)
    },
    [loadMeals]
  )

  // =====================================================
  // OPEN ADD / EDIT
  // =====================================================

  const handleOpen =
    useCallback(
      (meal = null) => {
        setEditing(meal)

        if (meal) {
          setForm({
            name:
              meal.name || '',

            description:
              meal.description ||
              '',

            price:
              meal.price ?? '',

            category_id:
              meal.category_id ??
              '',

            status:
              meal.status ||
              'active',

            featured:
              !!meal.featured,

            image:
              meal.image_url ||
              meal.image ||
              '',

            imageFile:
              null,
          })

          setImagePreview(
            meal.image_url ||
              meal.image ||
              ''
          )
        } else {
          setForm({
            ...emptyForm,
          })

          setImagePreview('')
        }

        setError('')
        setOpen(true)
      },
      []
    )

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleClose =
    useCallback(() => {
      if (saving) return

      setOpen(false)
      setEditing(null)

      setForm({
        ...emptyForm,
      })

      setImagePreview('')
    }, [saving])

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange =
    useCallback((e) => {
      const file =
        e.target.files?.[0]

      if (!file) return

      setForm((current) => ({
        ...current,
        imageFile: file,
        image: file.name,
      }))

      const previewUrl =
        URL.createObjectURL(file)

      setImagePreview(
        previewUrl
      )
    }, [])

  // =====================================================
  // SAVE MEAL
  // =====================================================

  const handleSave =
    useCallback(async () => {
      if (!restaurantId) {
        setError(
          t.restaurantNotFound ||
            'Restaurant not found.'
        )

        return
      }

      if (!form.name.trim()) {
        setError(
          t.mealNameRequired ||
            'Meal name is required.'
        )

        return
      }

      if (!form.category_id) {
        setError(
          t.categoryRequired ||
            'Please select a category.'
        )

        return
      }

      if (
        form.price === '' ||
        Number(form.price) < 0
      ) {
        setError(
          t.priceRequired ||
            'Price is required.'
        )

        return
      }

      setSaving(true)
      setError('')

      const data =
        new FormData()

      data.append(
        'category_id',
        String(
          form.category_id
        )
      )

      data.append(
        'name',
        form.name.trim()
      )

      data.append(
        'description',
        form.description || ''
      )

      data.append(
        'price',
        String(form.price)
      )

      data.append(
        'status',
        form.status || 'active'
      )

      data.append(
        'featured',
        form.featured
          ? '1'
          : '0'
      )

      if (form.imageFile) {
        data.append(
          'image',
          form.imageFile
        )
      }

      try {
        // -------------------------------------------------
        // UPDATE
        // -------------------------------------------------

        if (editing?.id) {
          const updatedMeal =
            await updateMeal(
              restaurantId,
              editing.id,
              data
            )

          setMeals((current) => {
            const updated =
              current.map(
                (meal) =>
                  meal.id ===
                  editing.id
                    ? updatedMeal
                    : meal
              )

            saveMealsToCache(
              updated
            )

            return updated
          })
        }

        // -------------------------------------------------
        // CREATE
        // -------------------------------------------------

        else {
          const newMeal =
            await createMeal(
              restaurantId,
              data
            )

          setMeals((current) => {
            const updated = [
              ...current,
              newMeal,
            ]

            saveMealsToCache(
              updated
            )

            return updated
          })
        }

        handleClose()
      } catch (err) {
        console.error(
          'Meal save error:',
          err?.response?.data ||
            err
        )

        setError(
          err?.response?.data
            ?.message ||
            err?.message ||
            t.saveMealError ||
            'Failed to save meal.'
        )
      } finally {
        setSaving(false)
      }
    }, [
      restaurantId,
      form,
      editing,
      saveMealsToCache,
      handleClose,
      t.restaurantNotFound,
      t.mealNameRequired,
      t.categoryRequired,
      t.priceRequired,
      t.saveMealError,
    ])

  // =====================================================
  // DELETE MEAL
  // =====================================================

  const handleDelete =
    useCallback(
      async (meal) => {
        if (
          !restaurantId ||
          !meal?.id
        ) {
          return
        }

        const mealName =
          meal.name ||
          t.meal ||
          'Meal'

        const confirmed =
          window.confirm(
            `${
              t.deleteMealConfirm ||
              'Delete meal'
            } "${mealName}"?`
          )

        if (!confirmed) return

        setDeletingId(
          meal.id
        )

        setError('')

        try {
          await deleteMeal(
            restaurantId,
            meal.id
          )

          setMeals((current) => {
            const updated =
              current.filter(
                (item) =>
                  item.id !==
                  meal.id
              )

            saveMealsToCache(
              updated
            )

            return updated
          })
        } catch (err) {
          console.error(
            'Meal delete error:',
            err?.response?.data ||
              err
          )

          setError(
            err?.response?.data
              ?.message ||
              err?.message ||
              t.deleteMealError ||
              'Failed to delete meal.'
          )
        } finally {
          setDeletingId(null)
        }
      },
      [
        restaurantId,
        saveMealsToCache,
        t.meal,
        t.deleteMealConfirm,
        t.deleteMealError,
      ]
    )

  // =====================================================
  // STATUS LABEL
  // =====================================================

  const getStatusLabel =
    useCallback(
      (status) => {
        const labels = {
          active:
            t.active ||
            'Active',

          inactive:
            t.inactive ||
            'Inactive',

          available:
            t.available ||
            'Available',

          unavailable:
            t.unavailable ||
            'Unavailable',
        }

        return (
          labels[status] ||
          status
        )
      },
      [
        t.active,
        t.inactive,
        t.available,
        t.unavailable,
      ]
    )

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass =
    useCallback((status) => {
      if (
        status === 'active' ||
        status === 'available'
      ) {
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
      }

      if (
        status === 'inactive' ||
        status === 'unavailable'
      ) {
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-300'
      }

      return 'bg-slate-500/10 text-slate-600 dark:text-slate-300'
    }, [])

  // =====================================================
  // MEAL CARDS
  // =====================================================

  const mealCards =
    useMemo(() => {
      return meals.map(
        (meal) => {
          const category =
            categories.find(
              (item) =>
                Number(
                  item.id
                ) ===
                Number(
                  meal.category_id
                )
            )

          const image =
            meal.image_url ||
            meal.image ||
            ''

          return (
            <div
              key={meal.id}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-card transition-colors dark:border-slate-800 dark:bg-slate-900"
            >
              {/* IMAGE */}

              <div className="h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                {image ? (
                  <img
                    src={image}
                    alt={
                      meal.name ||
                      'Meal'
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    {t.noImage ||
                      'No image'}
                  </div>
                )}
              </div>

              {/* CONTENT */}

              <div className="p-6">

                {/* TITLE + STATUS */}

                <div className="flex items-start justify-between gap-3">

                  <h2 className="min-w-0 flex-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {meal.name}
                  </h2>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                      meal.status
                    )}`}
                  >
                    {getStatusLabel(
                      meal.status
                    )}
                  </span>

                </div>

                {/* DESCRIPTION */}

                {meal.description && (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {meal.description}
                  </p>
                )}

                {/* CATEGORY + FEATURED */}

                <div className="mt-4 flex flex-wrap items-center gap-2">

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {category?.name ||
                      t.selectCategory ||
                      'Category'}
                  </span>

                  {meal.featured && (
                    <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-600 dark:text-sky-300">
                      {t.featured ||
                        'Featured'}
                    </span>
                  )}

                </div>

                {/* PRICE + ACTIONS */}

                <div className="mt-5 flex items-center justify-between gap-3">

                  <span className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    $
                    {Number(
                      meal.price ||
                        0
                    ).toFixed(2)}
                  </span>

                  <div className="flex gap-2">

                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={() =>
                        handleOpen(
                          meal
                        )
                      }
                      className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      <Pencil
                        size={16}
                      />

                      <span className="hidden sm:inline">
                        {t.editMeal ||
                          'Edit'}
                      </span>
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          meal
                        )
                      }
                      disabled={
                        deletingId ===
                        meal.id
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-950/50"
                      aria-label={
                        t.deleteMeal ||
                        'Delete'
                      }
                    >
                      <Trash2
                        size={16}
                        className={
                          deletingId ===
                          meal.id
                            ? 'animate-pulse'
                            : ''
                        }
                      />
                    </button>

                  </div>

                </div>

              </div>
            </div>
          )
        }
      )
    }, [
      meals,
      categories,
      t.noImage,
      t.selectCategory,
      t.featured,
      t.editMeal,
      t.deleteMeal,
      deletingId,
      getStatusClass,
      getStatusLabel,
      handleOpen,
      handleDelete,
    ])

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="text-slate-900 dark:text-slate-100">

      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-semibold">
            {t.meals ||
              'Meals'}
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t.mealsDescription ||
              'Manage your restaurant meals.'}
          </p>
        </div>

        <div className="flex gap-2">

          {/* REFRESH */}

          <button
            type="button"
            onClick={
              handleRefresh
            }
            disabled={
              refreshing
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCw
              size={17}
              className={
                refreshing
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

          <button
            type="button"
            onClick={() =>
              handleOpen()
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            <Plus size={18} />

            {t.addMeal ||
              'Add meal'}
          </button>

        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-5 flex items-start justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              setError('')
            }
            className="shrink-0 text-lg leading-none opacity-70 hover:opacity-100"
            aria-label={
              t.close ||
              'Close'
            }
          >
            ✕
          </button>

        </div>
      )}

      {/* LOADING */}

      {loading ? (

        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-card dark:border-slate-800 dark:bg-slate-900">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" />

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {t.loading ||
              'Loading...'}
          </p>

        </div>

      ) : meals.length === 0 ? (

        /* EMPTY */

        <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-card dark:border-slate-800 dark:bg-slate-900">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-500">
            <Utensils size={30} />
          </div>

          <h2 className="mt-5 text-xl font-semibold">
            {t.noMealsFound ||
              'No meals found'}
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t.noMealsDescription ||
              'Add your first meal to your menu.'}
          </p>

          <button
            type="button"
            onClick={() =>
              handleOpen()
            }
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            <Plus size={18} />

            {t.addMeal ||
              'Add meal'}
          </button>

        </div>

      ) : (

        /* MEALS */

        <div className="grid gap-5 lg:grid-cols-2">
          {mealCards}
        </div>

      )}

      {/* ADD / EDIT MODAL */}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">

          <div className="my-8 w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between gap-4">

              <div>
                <h2 className="text-xl font-semibold">
                  {editing
                    ? t.editMeal ||
                      'Edit meal'
                    : t.addMeal ||
                      'Add meal'}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {editing
                    ? t.editMealDescription ||
                      'Update meal information.'
                    : t.addMealDescription ||
                      'Add a new meal to your menu.'}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleClose
                }
                disabled={
                  saving
                }
                className="text-xl text-slate-400 hover:text-slate-700 disabled:opacity-50 dark:hover:text-slate-200"
                aria-label={
                  t.close ||
                  'Close'
                }
              >
                ✕
              </button>

            </div>

            {/* MODAL ERROR */}

            {error && (
              <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
                {error}
              </div>
            )}

            {/* FORM */}

            <div className="mt-6 grid gap-5">

              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t.mealName ||
                    'Meal name'}
                </label>

                <input
                  type="text"
                  value={
                    form.name
                  }
                  onChange={(e) =>
                    setForm(
                      (current) => ({
                        ...current,
                        name:
                          e.target
                            .value,
                      })
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  placeholder={
                    t.mealName ||
                    'Meal name'
                  }
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t.description ||
                    'Description'}
                </label>

                <textarea
                  rows="3"
                  value={
                    form.description
                  }
                  onChange={(e) =>
                    setForm(
                      (current) => ({
                        ...current,
                        description:
                          e.target
                            .value,
                      })
                    )
                  }
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  placeholder={
                    t.description ||
                    'Description'
                  }
                />
              </div>

              {/* PRICE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t.price ||
                    'Price'}
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    form.price
                  }
                  onChange={(e) =>
                    setForm(
                      (current) => ({
                        ...current,
                        price:
                          e.target
                            .value,
                      })
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  placeholder="0.00"
                />
              </div>

              {/* CATEGORY */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t.selectCategory ||
                    'Select category'}
                </label>

                <select
                  value={
                    form.category_id
                  }
                  onChange={(e) =>
                    setForm(
                      (current) => ({
                        ...current,
                        category_id:
                          e.target
                            .value,
                      })
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  <option value="">
                    {t.selectCategory ||
                      'Select category'}
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={
                          category.id
                        }
                        value={
                          category.id
                        }
                      >
                        {
                          category.name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* IMAGE */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t.image ||
                    'Image'}
                </label>

                <input
                  id="meal-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={
                    handleImageChange
                  }
                />

                <label
                  htmlFor="meal-image"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  {t.chooseImage ||
                    'Choose image'}
                </label>

                {form.imageFile && (
                  <p className="mt-2 truncate text-xs text-slate-500 dark:text-slate-400">
                    {
                      form
                        .imageFile
                        .name
                    }
                  </p>
                )}

                {imagePreview ? (
                  <img
                    src={
                      imagePreview
                    }
                    alt="Preview"
                    className="mt-3 h-32 w-full rounded-3xl object-cover"
                  />
                ) : (
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    {t.noFile ||
                      'No image selected'}
                  </p>
                )}

              </div>

              {/* STATUS */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t.status ||
                    'Status'}
                </label>

                <select
                  value={
                    form.status
                  }
                  onChange={(e) =>
                    setForm(
                      (current) => ({
                        ...current,
                        status:
                          e.target
                            .value,
                      })
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  <option value="active">
                    {t.active ||
                      'Active'}
                  </option>

                  <option value="inactive">
                    {t.inactive ||
                      'Inactive'}
                  </option>
                </select>

              </div>

              {/* FEATURED */}

              <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">

                <input
                  type="checkbox"
                  checked={
                    form.featured
                  }
                  onChange={(e) =>
                    setForm(
                      (current) => ({
                        ...current,
                        featured:
                          e.target
                            .checked,
                      })
                    )
                  }
                  className="h-5 w-5 rounded border-slate-300 bg-white text-sky-500 dark:border-slate-700 dark:bg-slate-950"
                />

                {t.featured ||
                  'Featured'}

              </label>

            </div>

            {/* MODAL FOOTER */}

            <div className="mt-7 flex justify-end gap-3">

              <button
                type="button"
                onClick={
                  handleClose
                }
                disabled={
                  saving
                }
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                {t.cancel ||
                  'Cancel'}
              </button>

              <button
                type="button"
                onClick={
                  handleSave
                }
                disabled={
                  saving
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {saving && (
                  <RefreshCw
                    size={16}
                    className="animate-spin"
                  />
                )}

                {saving
                  ? t.saving ||
                    'Saving...'
                  : editing
                    ? t.saveChanges ||
                      'Save changes'
                    : t.addMeal ||
                      'Add meal'}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default MealsPage
 
