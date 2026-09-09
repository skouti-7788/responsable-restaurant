import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  getRestaurantProfile,
  updateRestaurantProfile,
  getCachedProfile,
  saveCachedProfile,
} from '../../data/dataProfile'

import { updateProfile } from '../../store/restaurantSlice'

import translations from '../../i18n/translations'

import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

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
  socials: {
    facebook: '',
  },
}

// =====================================================
// NORMALIZE PROFILE
// =====================================================

const normalizeProfile = (restaurant) => {
  if (!restaurant) {
    return null
  }

  return {
    id: restaurant.id || null,

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
      : restaurant.openingHours || '',

    socials: {
      facebook:
        restaurant.social_links?.facebook ||
        restaurant.socials?.facebook ||
        '',
    },
  }
}

// =====================================================
// PROFILE PAGE
// =====================================================

const ProfilePage = () => {
  const dispatch = useDispatch()

  // ===================================================
  // LANGUAGE
  // ===================================================

  const { language } = useSelector(
    (state) => state.ui
  )

  // ===================================================
  // REDUX PROFILE
  // ===================================================

  const { profile } = useSelector(
    (state) => state.restaurant
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
  // ===================================================

  const [form, setForm] = useState(() => {
    const cached = getCachedProfile()

    if (cached) {
      return {
        ...emptyProfile,
        ...cached,
        socials: {
          ...emptyProfile.socials,
          ...(cached.socials || {}),
        },
      }
    }

    if (profile) {
      return {
        ...emptyProfile,
        ...profile,
        socials: {
          ...emptyProfile.socials,
          ...(profile.socials || {}),
        },
      }
    }

    return emptyProfile
  })

  // ===================================================
  // LOAD PROFILE
  // ===================================================

  useEffect(() => {
    let cancelled = false

    const loadProfile = async () => {
      try {
        // -------------------------------------------------
        // CACHE
        // -------------------------------------------------

        const cached = getCachedProfile()

        if (cached?.id) {
          if (cancelled) {
            return
          }

          const normalized = {
            ...emptyProfile,
            ...cached,
            socials: {
              ...emptyProfile.socials,
              ...(cached.socials || {}),
            },
          }

          dispatch(
            updateProfile(normalized)
          )

          return
        }

        // -------------------------------------------------
        // API
        // -------------------------------------------------

        const restaurant =
          await getRestaurantProfile()

        if (
          cancelled ||
          !restaurant
        ) {
          return
        }

        // -------------------------------------------------
        // NORMALIZE
        // -------------------------------------------------

        const normalized =
          normalizeProfile(
            restaurant
          )

        if (!normalized) {
          return
        }

        // -------------------------------------------------
        // SAVE CACHE
        // -------------------------------------------------

        saveCachedProfile(
          normalized
        )

        // -------------------------------------------------
        // UPDATE REDUX
        // -------------------------------------------------

        dispatch(
          updateProfile(
            normalized
          )
        )

        // -------------------------------------------------
        // UPDATE FORM
        // -------------------------------------------------

        setForm(
          normalized
        )
      } catch (error) {
        if (!cancelled) {
          console.error(
            'Failed to load profile:',
            error
          )
        }
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
  // HANDLE FACEBOOK CHANGE
  // ===================================================

  const updateFacebook = (value) => {
    setForm(
      (current) => ({
        ...current,
        socials: {
          ...(current.socials || {}),
          facebook: value,
        },
      })
    )
  }

  // ===================================================
  // HANDLE SUBMIT
  // ===================================================

  const handleSubmit = async (e) => {
    e.preventDefault()

    const restaurantId =
      form?.id ||
      profile?.id ||
      getCachedProfile()?.id

    if (!restaurantId) {
      console.error(
        'Restaurant ID not found'
      )

      return
    }

    try {
      // -------------------------------------------------
      // FORM DATA
      // -------------------------------------------------

      const formData =
        new FormData()

      // -------------------------------------------------
      // METHOD SPOOFING
      // -------------------------------------------------

      formData.append(
        '_method',
        'PUT'
      )

      // -------------------------------------------------
      // BASIC DATA
      // -------------------------------------------------

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

      // -------------------------------------------------
      // OPENING HOURS
      // -------------------------------------------------

      const openingHours =
        form.openingHours
          ? form.openingHours
              .split(',')
              .map((entry) => {
                const [
                  day,
                  hours,
                ] = entry.split(':')

                const [
                  from,
                  to,
                ] = (
                  hours || ''
                ).split('-')

                return {
                  day:
                    day?.trim() || '',

                  from:
                    from?.trim() || '',

                  to:
                    to?.trim() || '',
                }
              })
              .filter(
                (entry) =>
                  entry.day ||
                  entry.from ||
                  entry.to
              )
          : []

      openingHours.forEach(
        (entry, index) => {
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

      // -------------------------------------------------
      // FACEBOOK
      // -------------------------------------------------

      formData.append(
        'social_links[facebook]',
        form.socials?.facebook || ''
      )

      // -------------------------------------------------
      // UPDATE API
      // -------------------------------------------------

      const response =
        await updateRestaurantProfile(
          restaurantId,
          formData
        )

      // -------------------------------------------------
      // NORMALIZE RESPONSE
      // -------------------------------------------------

      const normalized =
        normalizeProfile(
          response
        ) || {
          ...form,
          id: restaurantId,
        }

      // -------------------------------------------------
      // UPDATE REDUX
      // -------------------------------------------------

      dispatch(
        updateProfile(
          normalized
        )
      )

      // -------------------------------------------------
      // UPDATE CACHE
      // -------------------------------------------------

      saveCachedProfile(
        normalized
      )

      // -------------------------------------------------
      // UPDATE FORM
      // -------------------------------------------------

      setForm(
        normalized
      )
    } catch (error) {
      console.error(
        'Update profile error:',
        error?.response?.data ||
          error
      )
    }
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="text-slate-900 dark:text-slate-100">

      {/* =================================================
          PROFILE CARD
      ================================================= */}

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card transition-colors dark:border-slate-800 dark:bg-slate-900/95">

        {/* =================================================
            HEADER
        ================================================= */}

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

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 lg:grid-cols-2"
        >

          {/* Restaurant Name */} <Input label={t.restaurantName} placeholder={t.restaurantNamePlaceholder} value={form?.name ?? ''} onChange={(e) => updateForm( 'name', e.target.value ) } /> 
          {/* Email */} <Input label={t.email} placeholder={t.emailPlaceholder} type="email" value={form?.email ?? ''} onChange={(e) => updateForm( 'email', e.target.value ) } /> 
          {/* Phone */} <Input label={t.phone} placeholder={t.phonePlaceholder} value={form?.phone ?? ''} onChange={(e) => updateForm( 'phone', e.target.value ) } /> 
          {/* Address */} <Input label={t.address} placeholder={t.addressPlaceholder} value={form?.address ?? ''} onChange={(e) => updateForm( 'address', e.target.value ) } /> 
          {/* Opening Hours */} <Input label={t.openingHours} placeholder={t.openingHoursPlaceholder} value={form?.openingHours ?? ''} onChange={(e) => updateForm( 'openingHours', e.target.value ) } /> 
          {/* Facebook */} <Input label="Facebook" placeholder={t.facebookPlaceholder} value={form?.socials?.facebook ?? ''} onChange={(e) => updateFacebook( e.target.value ) } />

          {/* =================================================
              SAVE
          ================================================= */}

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
 