// import { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import axiosClient from '../../api/axiosClient'
// import { addCategory, fetchCategoriesFailure, fetchCategoriesStart, fetchCategoriesSuccess, removeCategory, updateCategory } from '../../store/categorySlice'
// import translations from '../../i18n/translations'
// import Button from '../../components/ui/Button'
// import Input from '../../components/ui/Input'
// import Modal from '../../components/ui/Modal'

// const CategoriesPage = () => {
//   const dispatch = useDispatch()
//   const { language } = useSelector((state) => state.ui)
//   const categories = useSelector((state) => state.categories.items)
//   const t = translations[language]
//   const [isOpen, setIsOpen] = useState(false)
//   const [editing, setEditing] = useState(null)
//   const [restaurantId, setRestaurantId] = useState(null)
//   const [form, setForm] = useState({ name: '', description: '' })

//   useEffect(() => {
//     const loadCategories = async () => {
//       dispatch(fetchCategoriesStart())
//       try {
//         const restaurantsResponse = await axiosClient.get('/restaurants')
//         const restaurant = restaurantsResponse.data.data?.[0] || restaurantsResponse.data?.[0] || null

//         if (!restaurant) {
//           dispatch(fetchCategoriesSuccess([]))
//           return
//         }

//         setRestaurantId(restaurant.id)
//         const categoriesResponse = await axiosClient.get(`/restaurants/${restaurant.id}/categories`)
//         dispatch(fetchCategoriesSuccess(categoriesResponse.data.data || categoriesResponse.data || []))
//       } catch (err) {
//         dispatch(fetchCategoriesFailure(err?.message || 'Unable to load categories'))
//       }
//     }

//     loadCategories()
//   }, [dispatch])

//   const handleOpen = (category) => {
//     setEditing(category || null)
//     setForm(category || { name: '', description: '' })
//     setIsOpen(true)
//   }

//   // const handleSave = async () => {
//   //   if (!form.name || !restaurantId) return

//   //   try {
//   //     if (editing) {
//   //       const response = await axiosClient.put(`/categories/${editing.id}`, { name: form.name, status: 'active' })
//   //       dispatch(updateCategory(response.data))
//   //     } else {
//   //       const response = await axiosClient.post(`/restaurants/${restaurantId}/categories`, { name: form.name, status: 'active' })
//   //       dispatch(addCategory(response.data))
//   //     }
//   //     setIsOpen(false)
//   //   } catch (err) {
//   //     dispatch(fetchCategoriesFailure(err?.message || 'Unable to save category'))
//   //   }
//   // }

//   // const handleDelete = async (category) => {
//   //   try {
//   //     await axiosClient.delete(`/categories/${category.id}`)
//   //     dispatch(removeCategory(category.id))
//   //   } catch (err) {
//   //     dispatch(fetchCategoriesFailure(err?.message || 'Unable to delete category'))
//   //   }
//   // }
//   const handleSave = async () => {
//     if (!form.name || !restaurantId) return

//     try {
//       if (editing) {
//         const response = await axiosClient.put(
//           `/restaurants/${restaurantId}/categories/${editing.id}`,
//           {
//             name: form.name,
//             description: form.description,
//             status: 'active',
//           }
//         )

//         dispatch(updateCategory(response.data.data || response.data))
//       } else {
//         const response = await axiosClient.post(
//           `/restaurants/${restaurantId}/categories`,
//           {
//             name: form.name,
//             description: form.description,
//             status: 'active',
//           }
//         )

//         dispatch(addCategory(response.data.data || response.data))
//       }

//       setIsOpen(false)
//     } catch (err) {
//       dispatch(
//         fetchCategoriesFailure(
//           err?.response?.data?.message ||
//           err?.message ||
//           'Unable to save category'
//         )
//       )
//     }
//   }

//   const handleDelete = async (category) => {
//     if (!restaurantId) return

//     try {
//       await axiosClient.delete(
//         `/restaurants/${restaurantId}/categories/${category.id}`
//       )

//       dispatch(removeCategory(category.id))
//     } catch (err) {
//       dispatch(
//         fetchCategoriesFailure(
//           err?.response?.data?.message ||
//           err?.message ||
//           'Unable to delete category'
//         )
//       )
//     }
//   }
//   console.log(categories)
//   return (
//     <div className="space-y-8">
//       <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold text-slate-100">{t.categories}</h1>
//           <p className="mt-2 max-w-2xl text-sm text-slate-400">Create categories and organize your menu by cuisine and collection.</p>
//         </div>
//         <Button onClick={() => handleOpen(null)}>{t.addCategory}</Button>
//       </div>

//       <div className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/95 shadow-card">
//         <table className="min-w-full divide-y divide-slate-800 text-sm">
//           <thead className="bg-slate-950/80 text-slate-400">
//             <tr>
//               <th className="px-6 py-4 text-left">{t.name}</th>
//               <th className="px-6 py-4 text-left">{t.description}</th>
//               <th className="px-6 py-4 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-800">
//             {categories.length === 0 ? (
//               <tr>
//                 <td colSpan="3" className="px-6 py-8 text-center text-slate-400">
//                   No categories added yet.
//                 </td>
//               </tr>
//             ) : (
//               categories.map((category) => (
//                 <tr key={category.id} className="bg-slate-950/60">
//                   <td className="px-6 py-4 text-slate-100">{category.name}</td>
//                   <td className="px-6 py-4 text-slate-400">{category.description || 'description'}</td>
//                   <td className="px-6 py-4 text-right">
//                     <div className="inline-flex items-center gap-2">
//                       <button onClick={() => handleOpen(category)} className="rounded-2xl bg-slate-800 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-700">
//                         {t.editCategory}
//                       </button>
//                       <button onClick={() => handleDelete(category)} className="rounded-2xl bg-rose-500 px-3 py-2 text-sm text-white transition hover:bg-rose-400">
//                         {t.deleteCategory}
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       <Modal title={editing ? t.editCategory : t.addCategory} open={isOpen} onClose={() => setIsOpen(false)} footer={
//         <div className="flex justify-end gap-3">
//           <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
//           <Button onClick={handleSave}>{editing ? t.editCategory : t.addCategory}</Button>
//         </div>
//       }>
//         <div className="grid gap-5">
//           <Input label={t.name} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
//           <Input label={t.description} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
//         </div>
//       </Modal>
//     </div>
//   )
// }

// export default CategoriesPage
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axiosClient from '../../api/axiosClient'
import {
  addCategory,
  fetchCategoriesFailure,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  removeCategory,
  updateCategory,
} from '../../store/categorySlice'
import translations from '../../i18n/translations'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'

const CategoriesPage = () => {
  const dispatch = useDispatch()

  const { language } = useSelector((state) => state.ui)
  const categories = useSelector((state) => state.categories.items)

  const t = translations[language]

  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [restaurantId, setRestaurantId] = useState(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    const loadCategories = async () => {
      dispatch(fetchCategoriesStart())

      try {
        const restaurantsResponse =
          await axiosClient.get('/restaurants')

        const restaurant =
          restaurantsResponse.data.data?.[0] ||
          restaurantsResponse.data?.[0] ||
          null

        if (!restaurant) {
          dispatch(fetchCategoriesSuccess([]))
          return
        }

        setRestaurantId(restaurant.id)

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
      } catch (err) {
        dispatch(
          fetchCategoriesFailure(
            err?.message || 'Unable to load categories'
          )
        )
      }
    }

    loadCategories()
  }, [dispatch])

  const handleOpen = (category) => {
    setEditing(category || null)

    setForm(
      category || {
        name: '',
        description: '',
      }
    )

    setIsOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !restaurantId) return

    try {
      if (editing) {
        const response = await axiosClient.put(
          `/restaurants/${restaurantId}/categories/${editing.id}`,
          {
            name: form.name,
            description: form.description,
            status: 'active',
          }
        )

        dispatch(
          updateCategory(
            response.data.data || response.data
          )
        )
      } else {
        const response = await axiosClient.post(
          `/restaurants/${restaurantId}/categories`,
          {
            name: form.name,
            description: form.description,
            status: 'active',
          }
        )

        dispatch(
          addCategory(
            response.data.data || response.data
          )
        )
      }

      setIsOpen(false)
    } catch (err) {
      dispatch(
        fetchCategoriesFailure(
          err?.response?.data?.message ||
            err?.message ||
            'Unable to save category'
        )
      )
    }
  }

  const handleDelete = async (category) => {
    if (!restaurantId) return

    try {
      await axiosClient.delete(
        `/restaurants/${restaurantId}/categories/${category.id}`
      )

      dispatch(removeCategory(category.id))
    } catch (err) {
      dispatch(
        fetchCategoriesFailure(
          err?.response?.data?.message ||
            err?.message ||
            'Unable to delete category'
        )
      )
    }
  }

  return (
    <div className="text-slate-900 dark:text-slate-100">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {t.categories}
          </h1>

            <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.categoriesDescription} 
             </p>
        </div>

        <Button onClick={() => handleOpen(null)}>
          {t.addCategory}
        </Button>

      </div>

      {/* Table */}
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

              {categories.length === 0 ? (

                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-8 text-center text-slate-500 dark:text-slate-400"
                  >
                  {t.noCategoriesAdded}
                  </td>
                </tr>

              ) : (

                categories.map((category) => (

                  <tr
                    key={category.id}
                    className="bg-white transition-colors hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/50"
                  >

                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                      {category.name}
                    </td>

                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {category.description || 'description'}
                    </td>

                    <td className="px-6 py-4 text-right">

                      <div className="inline-flex items-center gap-2">

                        <button
                          onClick={() => handleOpen(category)}
                          className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                          {t.editCategory}
                        </button>

                        <button
                          onClick={() => handleDelete(category)}
                          className="rounded-2xl bg-rose-500 px-3 py-2 text-sm text-white transition hover:bg-rose-400"
                        >
                          {t.deleteCategory}
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title={
          editing
            ? t.editCategory
            : t.addCategory
        }
        open={isOpen}
        onClose={() => setIsOpen(false)}
        footer={
          <div className="flex justify-end gap-3">

            <Button
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
               {t.cancel}
            </Button>

            <Button onClick={handleSave}>
              {editing
                ? t.editCategory
                : t.addCategory}
            </Button>

          </div>
        }
      >

        <div className="grid gap-5">

          <Input
            label={t.name}
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
                description: e.target.value,
              })
            }
          />

        </div>

      </Modal>

    </div>
  )
}

export default CategoriesPage