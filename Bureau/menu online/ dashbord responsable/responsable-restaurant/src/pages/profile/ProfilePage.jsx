import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axiosClient from '../../api/axiosClient'
import { updateProfile } from '../../store/restaurantSlice'
import translations from '../../i18n/translations'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const ProfilePage = () => {
  const dispatch = useDispatch()

  const { language } = useSelector((state) => state.ui)
  const { profile } = useSelector((state) => state.restaurant)

  const t = translations[language]

  const [form, setForm] = useState(profile)
  const [restaurantId, setRestaurantId] = useState(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await axiosClient.get('/restaurants')
         const restaurant =
          response.data.data?.[0] ||
          response.data?.[0] ||
          null

        if (!restaurant) return

        setRestaurantId(restaurant.id)

        const normalized = {
          name: restaurant.name || '',
          email: restaurant.email || '',
          address: restaurant.address || '',
          phone: restaurant.phone || '',

          openingHours: Array.isArray(
            restaurant.opening_hours
          )
            ? restaurant.opening_hours
                .map(
                  (item) =>
                    `${item.day}: ${item.from}-${item.to}`
                )
                .join(', ')
            : '',

          logo: restaurant.logo_url || '',
          // cover: restaurant.cover_image || '',

          socials:
            restaurant.social_links || {
              facebook: '',
              instagram: '',
              twitter: '',
            },
        }

        setForm(normalized)
        dispatch(updateProfile(normalized))
      } catch (err) {
        console.error(err)
      }
    }

    loadProfile()
  }, [dispatch])
 
   const handleSubmit = async (e) => {
  e.preventDefault()
  if (!restaurantId) return

  try {
    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('name', form.name || '')
    formData.append('email', form.email || '')
    formData.append('phone', form.phone || '')
    formData.append('address', form.address || '')

    const openingHours = form.openingHours
      ? form.openingHours.split(',').map((entry) => {
          const [day, hours] = entry.split(':')
          const [from, to] = (hours || '').split('-')
          return { day: day?.trim() || '', from: from?.trim() || '', to: to?.trim() || '' }
        })
      : []

    openingHours.forEach((entry, i) => {
      formData.append(`opening_hours[${i}][day]`, entry.day)
      formData.append(`opening_hours[${i}][from]`, entry.from)
      formData.append(`opening_hours[${i}][to]`, entry.to)
    })

    Object.entries(form.socials || {}).forEach(([key, value]) => {
      formData.append(`social_links[${key}]`, value || '')
    })

    if (form.coverFile) {
      formData.append('cover_image', form.coverFile)
    }

    await axiosClient.post(`/restaurants/${restaurantId}`, formData)
    // ...rest unchanged
  } catch (err) {
    console.error('Update profile error:', err.response?.data || err)
  }
}
  return (
    <div className="text-slate-900 dark:text-slate-100">

      {/* Profile Card */}
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card transition-colors dark:border-slate-800 dark:bg-slate-900/95">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {t.profile}
            </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t.manageRestaurantDetails}
               </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid gap-5 lg:grid-cols-2"
        >

          <Input
            label={t.restaurantName}
            value={form?.name ?? ''}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <Input
            label={t.email}
            value={form?.email ?? ''}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            type="email"
          />

          <Input
            label={t.phone}
            value={form?.phone ?? ''}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
          />

          <Input
            label={t.address}
            value={form?.address ?? ''}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
          />

          <Input
            label={t.openingHours}
            value={form?.openingHours ?? ''}
            onChange={(e) =>
              setForm({
                ...form,
                openingHours: e.target.value,
              })
            }
          />

          {/* <Input
            label={t.uploadLogo}
            value={form?.logo || ''}
            onChange={(e) =>
              setForm({
                ...form,
                logo: e.target.value,
              })
            }
            placeholder="Logo URL"
          /> */}

           {/* <div> */}
           {/*  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t.uploadCover}
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]

                if (!file) return

                setForm({
                  ...form,
                  coverFile: file,
                  coverPreview: URL.createObjectURL(file),
                })
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
            /> */}

            {/* {form?.coverPreview && (
              <img
                src={form.coverPreview}
                alt="Cover preview"
                className="mt-3 h-40 w-full rounded-2xl object-cover"
              />
            )}
          </div> */}

          <Input
            label="Facebook"
            value={form?.socials.facebook|| ''}
            onChange={(e) =>
              setForm({
                ...form,
                socials: {
                  ...form.socials,
                  facebook: e.target.value,
                },
              })
            }
          />

          <Input
            label="Instagram"
            value={form?.socials.instagram || ''}
            onChange={(e) =>
              setForm({
                ...form,
                socials: {
                  ...form.socials,
                  instagram: e.target.value,
                },
              })
            }
          />

          {/* <Input
            label="Twitter"
            value={form?.socials.twitter}
            onChange={(e) =>
              setForm({
                ...form,
                socials: {
                  ...form.socials,
                  twitter: e.target.value,
                },
              })
            }
          /> */}

          {/* Save */}
          <div className="col-span-full flex justify-end border-t border-slate-200 pt-5 dark:border-slate-800">
            <Button type="submit">
              {t.saveChanges}
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default ProfilePage 
