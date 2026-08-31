import {
  useEffect,
  useState,
} from 'react'

import {
  useDispatch,
  useSelector,
} from 'react-redux'

import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
} from 'lucide-react'

import {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,

  addCategory,
  updateCategory,
  removeCategory,

  setCategorySaving,
  setCategoryDeleting,

  setCategoryError,
  clearCategoryError,
} from '../../store/categorySlice'

import {
  getCachedCategories,
  getCachedRestaurant,
  loadCategoriesData,
  createCategory,
  updateCategoryApi,
  deleteCategoryApi,
  saveCategoriesToCache,
} from '../../data/dataCategories'

import translations from '../../i18n/translations'

import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'


const CategoriesPage = () => {

  // =====================================================
  // REDUX
  // =====================================================

  const dispatch =
    useDispatch()

  const language =
    useSelector(
      (state) =>
        state.ui?.language ||
        'en'
    )

  const categories =
    useSelector(
      (state) =>
        state.categories?.items ||
        []
    )

  const loading =
    useSelector(
      (state) =>
        state.categories?.loading ||
        false
    )

  const saving =
    useSelector(
      (state) =>
        state.categories?.saving ||
        false
    )

  const deletingId =
    useSelector(
      (state) =>
        state.categories?.deletingId ||
        null
    )

  const reduxError =
    useSelector(
      (state) =>
        state.categories?.error ||
        null
    )

  // =====================================================
  // TRANSLATIONS
  // =====================================================

  const t =
    translations?.[language] ||
    translations?.en ||
    {}

  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [
    restaurantId,
    setRestaurantId,
  ] = useState(() => {

    const restaurant =
      getCachedRestaurant()

    return (
      restaurant?.id ||
      null
    )
  })

  const [
    isOpen,
    setIsOpen,
  ] = useState(false)

  const [
    editing,
    setEditing,
  ] = useState(null)

  const [
    form,
    setForm,
  ] = useState({
    name: '',
    description: '',
  })

  // =====================================================
  // LOAD CACHE ONLY
  // =====================================================

  useEffect(() => {

    const cachedCategories =
      getCachedCategories()

    if (
      cachedCategories.length > 0
    ) {

      dispatch(
        fetchCategoriesSuccess(
          cachedCategories
        )
      )

    }

  }, [
    dispatch,
  ])

  // =====================================================
  // ERROR
  // =====================================================

  const error =
    reduxError || ''

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {

    // Prevent multiple requests
    if (loading) {
      return
    }

    // Clear previous error
    dispatch(
      clearCategoryError()
    )

    // Start loading
    dispatch(
      fetchCategoriesStart()
    )

    try {

      // Always make a NEW API request
      const result =
        await loadCategoriesData()

      // Update restaurant ID
      if (
        result?.restaurant?.id
      ) {

        setRestaurantId(
          result.restaurant.id
        )

      }

      // Update Redux
      dispatch(
        fetchCategoriesSuccess(
          result?.categories || []
        )
      )

      // Update cache
      saveCategoriesToCache(
        result?.categories || []
      )

    } catch (error) {

      console.error(
        'Refresh categories error:',
        error?.response?.data ||
        error
      )

      dispatch(
        fetchCategoriesFailure(
          error?.response
            ?.data
            ?.message ||
          error?.message ||
          t.loadCategoriesError ||
          'Failed to load categories.'
        )
      )

    }

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

    dispatch(
      clearCategoryError()
    )

    setIsOpen(true)
  }

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleClose = () => {

    if (saving) {
      return
    }

    setIsOpen(false)

    setEditing(null)

    setForm({
      name: '',
      description: '',
    })

    dispatch(
      clearCategoryError()
    )
  }

  // =====================================================
  // SAVE CATEGORY
  // =====================================================

  const handleSave =
    async () => {

      if (!restaurantId) {

        dispatch(
          setCategoryError(
            t.restaurantNotFound ||
            'Restaurant not found.'
          )
        )

        return
      }

      if (
        !form.name.trim()
      ) {

        dispatch(
          setCategoryError(
            t.categoryNameRequired ||
            'Category name is required.'
          )
        )

        return
      }

      dispatch(
        setCategorySaving(true)
      )

      dispatch(
        clearCategoryError()
      )

      try {

        // =================================================
        // EDIT
        // =================================================

        if (editing) {

          const updatedCategory =
            await updateCategoryApi({
              restaurantId,

              categoryId:
                editing.id,

              name:
                form.name,

              description:
                form.description,
            })

          dispatch(
            updateCategory(
              updatedCategory
            )
          )

          const currentCategories =
            categories.map(
              (category) =>
                category.id ===
                updatedCategory.id
                  ? updatedCategory
                  : category
            )

          saveCategoriesToCache(
            currentCategories
          )

        }

        // =================================================
        // CREATE
        // =================================================

        else {

          const newCategory =
            await createCategory({
              restaurantId,

              name:
                form.name,

              description:
                form.description,
            })

          dispatch(
            addCategory(
              newCategory
            )
          )

          const updatedCategories = [
            ...categories,
            newCategory,
          ]

          saveCategoriesToCache(
            updatedCategories
          )

        }

        // =================================================
        // CLOSE
        // =================================================

        setIsOpen(false)

        setEditing(null)

        setForm({
          name: '',
          description: '',
        })

      } catch (error) {

        console.error(
          'Save category error:',
          error?.response?.data ||
          error
        )

        dispatch(
          setCategoryError(
            error?.response
              ?.data
              ?.message ||
            error?.message ||
            t.saveCategoryError ||
            'Failed to save category.'
          )
        )

      } finally {

        dispatch(
          setCategorySaving(false)
        )

      }

    }

  // =====================================================
  // DELETE CATEGORY
  // =====================================================

  const handleDelete =
    async (
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
          `${
            t.deleteCategoryConfirm ||
            'Delete category'
          } "${categoryName}"?`
        )

      if (!confirmed) {
        return
      }

      dispatch(
        setCategoryDeleting(
          category.id
        )
      )

      dispatch(
        clearCategoryError()
      )

      try {

        await deleteCategoryApi({
          restaurantId,

          categoryId:
            category.id,
        })

        dispatch(
          removeCategory(
            category.id
          )
        )

        const updatedCategories =
          categories.filter(
            (item) =>
              item.id !==
              category.id
          )

        saveCategoriesToCache(
          updatedCategories
        )

      } catch (error) {

        console.error(
          'Delete category error:',
          error?.response?.data ||
          error
        )

        dispatch(
          setCategoryError(
            error?.response
              ?.data
              ?.message ||
            error?.message ||
            t.deleteCategoryError ||
            'Failed to delete category.'
          )
        )

      } finally {

        dispatch(
          setCategoryDeleting(
            null
          )
        )

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
            disabled={
              loading
            }
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
              handleOpen(
                null
              )
            }
          >

            <span className="flex items-center gap-2">

              <Plus
                size={17}
              />

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

      {loading &&
      categories.length === 0 ? (

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

            <Plus
              size={30}
            />

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
              handleOpen(
                null
              )
            }
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
          >

            <Plus
              size={18}
            />

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
            label={
              t.name
            }
            value={
              form.name
            }
            onChange={(
              e
            ) =>
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
            onChange={(
              e
            ) =>
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
 
