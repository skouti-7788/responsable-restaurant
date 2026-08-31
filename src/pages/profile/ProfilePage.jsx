import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  getRestaurantProfile,
  updateRestaurantProfile,
} from '../../data/dataProfile'

import {
  updateProfile,
} from '../../store/restaurantSlice'

import translations from '../../i18n/translations'

import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

// =====================================================
// CACHE KEY
// =====================================================

const PROFILE_CACHE_KEY =
  'restaurant_profile_cache'

// =====================================================
// READ CACHE
// =====================================================

const readProfileCache = () => {
  try {
    const cached =
      localStorage.getItem(
        PROFILE_CACHE_KEY
      )

    if (!cached) {
      return null
    }

    return JSON.parse(cached)
  } catch (error) {
    console.error(
      'Failed to read profile cache:',
      error
    )

    return null
  }
}

// =====================================================
// SAVE CACHE
// =====================================================

const saveProfileCache = (data) => {
  try {
    localStorage.setItem(
      PROFILE_CACHE_KEY,
      JSON.stringify(data)
    )
  } catch (error) {
    console.error(
      'Failed to save profile cache:',
      error
    )
  }
}

// =====================================================
// NORMALIZE PROFILE
// =====================================================

const normalizeProfile = (
  restaurant
) => {
  if (!restaurant) {
    return null
  }

  return {
    id: restaurant.id || null,

    name:
      restaurant.name || '',

    email:
      restaurant.email || '',

    address:
      restaurant.address || '',

    phone:
      restaurant.phone || '',

    openingHours:
      Array.isArray(
        restaurant.opening_hours
      )
        ? restaurant.opening_hours
            .map(
              (item) =>
                `${item.day}: ${item.from}-${item.to}`
            )
            .join(', ')
        : restaurant.openingHours || '',

    logo:
      restaurant.logo_url ||
      restaurant.logo ||
      '',

    socials: {
      facebook:
        restaurant.social_links
          ?.facebook ||
        restaurant.socials
          ?.facebook ||
        '',

      instagram:
        restaurant.social_links
          ?.instagram ||
        restaurant.socials
          ?.instagram ||
        '',

      twitter:
        restaurant.social_links
          ?.twitter ||
        restaurant.socials
          ?.twitter ||
        '',
    },
  }
}

// =====================================================
// EMPTY FORM
// =====================================================

const emptyProfile = {
  id: null,
  name: '',
  email: '',
  address: '',
  phone: '',
  openingHours: '',
  logo: '',
  socials: {
    facebook: '',
    instagram: '',
    twitter: '',
  },
}

// =====================================================
// PROFILE PAGE
// =====================================================

const ProfilePage = () => {
  const dispatch = useDispatch()

  // ===================================================
  // LANGUAGE
  // ===================================================

  const { language } =
    useSelector(
      (state) => state.ui
    )

  // ===================================================
  // REDUX PROFILE
  // ===================================================

  const { profile } =
    useSelector(
      (state) =>
        state.restaurant
    )

  // ===================================================
  // TRANSLATIONS
  // ===================================================

  const t =
    translations[language] ||
    translations.en ||
    {}

  // ===================================================
  // INITIAL PROFILE
  //
  // localStorage أولاً
  // Redux ثانياً
  // empty ثالثاً
  // ===================================================

  const [form, setForm] =
    useState(() => {
      const cached =
        readProfileCache()

      if (cached) {
        return cached
      }

      if (profile) {
        return profile
      }

      return emptyProfile
    })

  // ===================================================
  // LOAD PROFILE
  // ===================================================

  useEffect(() => {
    const cached =
      readProfileCache()

    // -------------------------------------------------
    // CACHE موجود
    // -------------------------------------------------

    if (cached?.id) {
      dispatch(
        updateProfile(
          cached
        )
      )

      return
    }

    // -------------------------------------------------
    // API فقط إذا ما كاينش cache
    // -------------------------------------------------

    let cancelled = false

    const loadProfile =
      async () => {
        try {
          const restaurant =
            await getRestaurantProfile()

          if (
            cancelled ||
            !restaurant
          ) {
            return
          }

          const normalized =
            normalizeProfile(
              restaurant
            )

          if (!normalized) {
            return
          }

          // ------------------------------------------------
          // SAVE CACHE
          // ------------------------------------------------

          saveProfileCache(
            normalized
          )

          // ------------------------------------------------
          // UPDATE REDUX
          // ------------------------------------------------

          dispatch(
            updateProfile(
              normalized
            )
          )

          // ------------------------------------------------
          // UPDATE FORM
          //
          // داخل async callback
          // وليس مباشرة داخل effect
          // ------------------------------------------------

          setForm(
            normalized
          )
        } catch (error) {
          console.error(
            'Failed to load profile:',
            error
          )
        }
      }

    loadProfile()

    return () => {
      cancelled = true
    }
  }, [dispatch])

  // ===================================================
  // HANDLE FORM CHANGE
  // ===================================================

  const updateForm = (
    field,
    value
  ) => {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    )
  }

  // ===================================================
  // HANDLE SUBMIT
  // ===================================================

  const handleSubmit =
    async (e) => {
      e.preventDefault()

      const restaurantId =
        form?.id ||
        profile?.id ||
        readProfileCache()
          ?.id

      if (!restaurantId) {
        console.error(
          'Restaurant ID not found'
        )

        return
      }

      try {
        const formData =
          new FormData()

        // ------------------------------------------------
        // METHOD
        // ------------------------------------------------

        formData.append(
          '_method',
          'PUT'
        )

        // ------------------------------------------------
        // BASIC DATA
        // ------------------------------------------------

        formData.append(
          'name',
          form.name || ''
        )

        formData.append(
          'email',
          form.email || ''
        )

        formData.append(
          'phone',
          form.phone || ''
        )

        formData.append(
          'address',
          form.address || ''
        )

        // ------------------------------------------------
        // OPENING HOURS
        // ------------------------------------------------

        const openingHours =
          form.openingHours
            ? form.openingHours
                .split(',')
                .map(
                  (entry) => {
                    const [
                      day,
                      hours,
                    ] =
                      entry.split(
                        ':'
                      )

                    const [
                      from,
                      to,
                    ] =
                      (
                        hours ||
                        ''
                      ).split(
                        '-'
                      )

                    return {
                      day:
                        day?.trim() ||
                        '',

                      from:
                        from?.trim() ||
                        '',

                      to:
                        to?.trim() ||
                        '',
                    }
                  }
                )
            : []

        openingHours.forEach(
          (
            entry,
            index
          ) => {
            formData.append(
              `opening_hours[${index}][day]`,
              entry.day
            )

            formData.append(
              `opening_hours[${index}][from]`,
              entry.from
            )

            formData.append(
              `opening_hours[${index}][to]`,
              entry.to
            )
          }
        )

        // ------------------------------------------------
        // SOCIAL LINKS
        // ------------------------------------------------

        Object.entries(
          form.socials || {}
        ).forEach(
          (
            [key, value]
          ) => {
            formData.append(
              `social_links[${key}]`,
              value || ''
            )
          }
        )

        // ------------------------------------------------
        // COVER IMAGE
        // ------------------------------------------------

        if (
          form.coverFile
        ) {
          formData.append(
            'cover_image',
            form.coverFile
          )
        }

        // ------------------------------------------------
        // UPDATE API
        // ------------------------------------------------

        const response =
          await updateRestaurantProfile(
            restaurantId,
            formData
          )

        // ------------------------------------------------
        // NORMALIZE RESPONSE
        // ------------------------------------------------

        const normalized =
          normalizeProfile(
            response
          ) || {
            ...form,
            id: restaurantId,
          }

        // ------------------------------------------------
        // UPDATE REDUX
        // ------------------------------------------------

        dispatch(
          updateProfile(
            normalized
          )
        )

        // ------------------------------------------------
        // UPDATE LOCAL STORAGE
        // ------------------------------------------------

        saveProfileCache(
          normalized
        )

        // ------------------------------------------------
        // UPDATE FORM
        // ------------------------------------------------

        setForm(
          normalized
        )
      } catch (error) {
        console.error(
          'Update profile error:',
          error?.response
            ?.data ||
            error
        )
      }
    }

  // ===================================================
  // UI
  // ===================================================

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

          {/* Restaurant Name */}

          <Input
            label={
              t.restaurantName
            }
            value={
              form?.name ?? ''
            }
            onChange={(e) =>
              updateForm(
                'name',
                e.target.value
              )
            }
          />

          {/* Email */}

          <Input
            label={t.email}
            value={
              form?.email ?? ''
            }
            onChange={(e) =>
              updateForm(
                'email',
                e.target.value
              )
            }
            type="email"
          />

          {/* Phone */}

          <Input
            label={t.phone}
            value={
              form?.phone ?? ''
            }
            onChange={(e) =>
              updateForm(
                'phone',
                e.target.value
              )
            }
          />

          {/* Address */}

          <Input
            label={t.address}
            value={
              form?.address ?? ''
            }
            onChange={(e) =>
              updateForm(
                'address',
                e.target.value
              )
            }
          />

          {/* Opening Hours */}

          <Input
            label={
              t.openingHours
            }
            value={
              form?.openingHours ??
              ''
            }
            onChange={(e) =>
              updateForm(
                'openingHours',
                e.target.value
              )
            }
          />

          {/* Facebook */}

          <Input
            label="Facebook"
            value={
              form?.socials
                ?.facebook ?? ''
            }
            onChange={(e) =>
              setForm(
                (current) => ({
                  ...current,
                  socials: {
                    ...(current.socials ||
                      {}),
                    facebook:
                      e.target
                        .value,
                  },
                })
              )
            }
          />

          {/* Instagram */}

          <Input
            label="Instagram"
            value={
              form?.socials
                ?.instagram ?? ''
            }
            onChange={(e) =>
              setForm(
                (current) => ({
                  ...current,
                  socials: {
                    ...(current.socials ||
                      {}),
                    instagram:
                      e.target
                        .value,
                  },
                })
              )
            }
          />

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