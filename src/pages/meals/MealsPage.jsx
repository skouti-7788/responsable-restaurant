import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axiosClient from '../../api/axiosClient'
import {
  addMeal,
  fetchMealsFailure,
  fetchMealsStart,
  fetchMealsSuccess,
  removeMeal,
  updateMeal,
} from '../../store/mealSlice'
import translations from '../../i18n/translations'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
} from '../../store/categorySlice'

const MealsPage = () => {
  const dispatch = useDispatch()

  const { language } = useSelector((state) => state.ui)
  const categories = useSelector((state) => state.categories.items)
  const meals = useSelector((state) => state.meals.items)

  const t = translations[language]

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [restaurantId, setRestaurantId] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    status: 'active',
    featured: false,
    image: '',
    imageFile: null,
  })

  useEffect(() => {
    const loadData = async () => {
      dispatch(fetchMealsStart())
      dispatch(fetchCategoriesStart())

      try {
        const restaurantsResponse =
          await axiosClient.get('/restaurants')

        const restaurant =
          restaurantsResponse.data.data?.[0] ||
          restaurantsResponse.data?.[0] ||
          null

        if (!restaurant) {
          dispatch(fetchMealsSuccess([]))
          dispatch(fetchCategoriesSuccess([]))
          return
        }

        setRestaurantId(restaurant.id)

        // Load categories
        const categoriesResponse =
          await axiosClient.get(
            `/restaurants/${restaurant.id}/categories`
          )

        dispatch(
          fetchCategoriesSuccess(
            categoriesResponse.data.data ||
              categoriesResponse.data ||
              []
          )
        )

        // Load meals
        const mealsResponse =
          await axiosClient.get(
            `/restaurants/${restaurant.id}/meals`
          )

        dispatch(
          fetchMealsSuccess(
            mealsResponse.data.data ||
              mealsResponse.data ||
              []
          )
        )
      } catch (err) {
        console.error(
          'Load meals/categories error:',
          err
        )

        dispatch(
          fetchMealsFailure(
            err?.response?.data?.message ||
              err?.message ||
              'Unable to load meals'
          )
        )

        dispatch(
          fetchCategoriesFailure(
            err?.response?.data?.message ||
              err?.message ||
              'Unable to load categories'
          )
        )
      }
    }

    loadData()
  }, [dispatch])

  const handleOpen = (meal) => {
    setEditing(meal || null)

    setForm(
      meal
        ? {
            name: meal.name || '',
            description: meal.description || '',
            price: meal.price || '',
            category_id: meal.category_id || '',
            status: meal.status || 'active',
            featured: !!meal.featured,
            image:
              meal.image_url ||
              meal.image ||
              '',
            imageFile: null,
          }
        : {
            name: '',
            description: '',
            price: '',
            category_id: '',
            status: 'active',
            featured: false,
            image: '',
            imageFile: null,
          }
    )

    setImagePreview(
      meal?.image_url ||
        meal?.image ||
        ''
    )

    setOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !restaurantId) return

    if (!form.category_id) {
      dispatch(
        fetchMealsFailure(
          'Please select a category.'
        )
      )
      return
    }

    const data = new FormData()

    data.append(
      'category_id',
      String(form.category_id)
    )

    data.append('name', form.name)
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
      form.featured ? '1' : '0'
    )

    if (form.imageFile) {
      data.append(
        'image',
        form.imageFile
      )
    }

    try {
      let response

      if (editing) {
        data.append('_method', 'PUT')

        response = await axiosClient.post(
          `/restaurants/${restaurantId}/meals/${editing.id}`,
          data,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          }
        )

        dispatch(
          updateMeal(
            response.data.data ||
              response.data
          )
        )
      } else {
        response = await axiosClient.post(
          `/restaurants/${restaurantId}/meals`,
          data,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          }
        )

        dispatch(
          addMeal(
            response.data.data ||
              response.data
          )
        )
      }

      setOpen(false)
      setEditing(null)

      setForm({
        name: '',
        description: '',
        price: '',
        category_id: '',
        status: 'active',
        featured: false,
        image: '',
        imageFile: null,
      })

      setImagePreview('')
    } catch (err) {
      console.error(
        'Meal save error:',
        err.response?.data || err
      )

      dispatch(
        fetchMealsFailure(
          err?.response?.data?.message ||
            err?.message ||
            'Unable to save meal'
        )
      )
    }
  }

  const handleDelete = async (meal) => {
    if (!restaurantId || !meal?.id) {
      console.error(
        'Missing restaurantId or meal.id',
        {
          restaurantId,
          meal,
        }
      )

      return
    }

    try {
      await axiosClient.delete(
        `/restaurants/${restaurantId}/meals/${meal.id}`
      )

      dispatch(
        removeMeal(meal.id)
      )
    } catch (err) {
      console.error(
        'Meal delete error:',
        err.response?.data || err
      )

      dispatch(
        fetchMealsFailure(
          err?.response?.data?.message ||
            err?.message ||
            'Unable to delete meal'
        )
      )
    }
  }

  const mealCards = useMemo(
    () =>
      meals.map((meal) => {
        const category =
          categories.find(
            (category) =>
              Number(category.id) ===
              Number(meal.category_id)
          )

        return (
          <div
            key={meal.id}
            className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-card transition-colors dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Image */}
            <div className="h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
              {meal.image_url ||
              meal.image ? (
                <img
                  src={
                    meal.image_url ||
                    meal.image
                  }
                  alt={meal.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  No image
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">

              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {meal.name}
                </h2>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    meal.status === 'available'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-300'
                  }`}
                >
                  {t[meal.status] ||
                    meal.status}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {meal.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {category?.name ||
                    t.selectCategory}
                </span>

                {meal.featured && (
                  <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-600 dark:text-sky-300">
                    {t.featured}
                  </span>
                )}

              </div>

              <div className="mt-5 flex items-center justify-between">

                <span className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  ${Number(
                    meal.price || 0
                  ).toFixed(2)}
                </span>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      handleOpen(meal)
                    }
                  >
                    {t.editMeal}
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() =>
                      handleDelete(meal)
                    }
                  >
                    {t.deleteCategory}
                  </Button>
                </div>

              </div>
            </div>
          </div>
        )
      }),
    [meals, categories, t]
  )

  return (
    <div className="text-slate-900 dark:text-slate-100">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {t.meals}
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t.mealsDescription}
          </p>
        </div>

        <Button
          onClick={() =>
            handleOpen(null)
          }
        >
          {t.addMeal}
        </Button>

      </div>

      {/* Meals */}
      <div className="grid gap-5 lg:grid-cols-2">

        {mealCards.length ? (
          mealCards
        ) : (
          <p className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 lg:col-span-2">
            {t.noMealsFound}
          </p>
        )}

      </div>

      {/* Modal */}
      <Modal
        title={
          editing
            ? t.editMeal
            : t.addMeal
        }
        open={open}
        onClose={() =>
          setOpen(false)
        }
        footer={
          <div className="flex justify-end gap-3">

            <Button
              variant="secondary"
              onClick={() =>
                setOpen(false)
              }
            >
              {t.cancel}
            </Button>

            <Button
              onClick={handleSave}
            >
              {editing
                ? t.editMeal
                : t.addMeal}
            </Button>

          </div>
        }
      >

        <div className="grid gap-5">

          <Input
            label={t.mealName}
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <Input
            label={t.description}
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value,
              })
            }
          />

          <Input
            label={t.price}
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value,
              })
            }
          />

          {/* Image */}
          <div>
            < label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">
              {t.image}</label>
            {/* <Input
              label={t.image}
              value={form.image}
              onChange={(e) =>
                setForm({
                  ...form,
                  image: e.target.value,
                })
              }
              // placeholder="Image URL"
            /> */}

            <div className="mt-3">
            <input
              id="meal-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]

                if (!file) return

                setForm({
                  ...form,
                  imageFile: file,
                  image: file.name,
                })

                const previewUrl = URL.createObjectURL(file)

                setImagePreview(previewUrl)
              }}
            />

            <label
              htmlFor="meal-image"
              className="inline-flex cursor-pointer items-center rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {form.imageFile ? form.imageFile.name : t.chooseImage} 
            </label>
          </div>

            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-3 h-24 w-full rounded-3xl object-cover"
              />
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.noFile}
              </p>
            )}
          </div>

          {/* Category */}
          <label className="text-sm text-slate-700 dark:text-slate-200">

            <span className="mb-2 block text-slate-600 dark:text-slate-300">
              {t.selectCategory}
            </span>

            <select
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-100"
              value={form.category_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  category_id:
                    e.target.value,
                })
              }
            >
              <option value="">
                {t.selectCategory}
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                )
              )}
            </select>

          </label>

          {/* Status */}
          <label className="text-sm text-slate-700 dark:text-slate-200">

            <span className="mb-2 block text-slate-600 dark:text-slate-300">
              {t.status}
            </span>

            <select
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-100"
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status:
                    e.target.value,
                })
              }
            >
              <option value="active">
                  {t.active}

              </option>

              <option value="inactive">
                  {t.inactive}

              </option>
            </select>

          </label>

          {/* Featured */}
          <label className="inline-flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">

            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                setForm({
                  ...form,
                  featured:
                    e.target.checked,
                })
              }
              className="h-5 w-5 rounded border-slate-300 bg-white text-sky-400 dark:border-slate-700 dark:bg-slate-950"
            />

            {t.featured}

          </label>

        </div>

      </Modal>
    </div>
  )
}

export default MealsPage 
