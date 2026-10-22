import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  getRestaurantProfile,
  updateRestaurantProfile,
  getCachedProfile,
  saveCachedProfile,
  changePassword,
} from '../../data/dataProfile'

import { updateProfile } from '../../store/restaurantSlice'

import translations from '../../i18n/translations'

import Input from '../../components/ui/Input'

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
// =====================================================
// STATE CHANGER LE MOT DE PASSE  
// =====================================================
  const [passwordForm, setPasswordForm] = useState({
  current_password: '',
  password: '',
  password_confirmation: '',
})

const [passwordLoading, setPasswordLoading] = useState(false)

const [passwordMessage, setPasswordMessage] = useState({
  type: '',
  text: '',
})
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
  //============================================
  //FUNCTION CHANGER LE MOT DE PASSE  
  //============================================
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    setPasswordMessage({ type: '', text: '' })

    if (
      !passwordForm.current_password ||
      !passwordForm.password ||
      !passwordForm.password_confirmation
    ) {
      setPasswordMessage({
        type: 'error',
        text: 'Veuillez remplir tous les champs.',
      })
      return
    }

    if (passwordForm.password.length < 8) {
      setPasswordMessage({
        type: 'error',
        text: 'Le mot de passe doit contenir au moins 8 caractères.',
      })
      return
    }

    if (
      passwordForm.password !==
      passwordForm.password_confirmation
    ) {
      setPasswordMessage({
        type: 'error',
        text: 'Les mots de passe ne correspondent pas.',
      })
      return
    }

    setPasswordLoading(true)

    try {
      const response = await changePassword(passwordForm)

      setPasswordForm({
        current_password: '',
        password: '',
        password_confirmation: '',
      })

      setPasswordMessage({
        type: 'success',
        text: response?.message || 'Mot de passe modifié avec succès.',
      })
    } catch (error) {
      const data = error?.response?.data

      setPasswordMessage({
        type: 'error',
        text:
          data?.errors?.current_password?.[0] ||
          data?.errors?.password?.[0] ||
          data?.message ||
          'Impossible de modifier le mot de passe.',
      })
    } finally {
      setPasswordLoading(false)
    }
  }

  // ===================================================
  // UI
  // ===================================================
  
  return (
    <div className="text-ink dark:text-slate-100">

      {/* =================================================
          PROFILE CARD
      ================================================= */}

      <div className="rounded-[2rem] border border-line bg-white p-6 shadow-card dark:border-[#234b58] dark:bg-[#18353d]">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-2xl font-semibold text-ink dark:text-white">
              {t.profile}
            </h1>

            <p className="mt-1 text-sm text-muted dark:text-slate-400">
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

          <div className="col-span-full flex justify-end border-t border-line pt-5 dark:border-[#234b58]">

            <button
            className="inline-flex h-11 min-w-[180px] cursor-pointer items-center justify-center gap-2 rounded-2xl bg-brand px-5 text-sm font-semibold text-white   hover:bg-brand-dark"

             type="submit">
              {t.saveChanges}
            </button>

          </div>

        </form>
         
      </div>
      
      <div className="mt-8 rounded-[2rem] border border-line bg-white p-6 shadow-card dark:border-[#234b58] dark:bg-[#18353d]">
        <h2 className="mb-2 text-xl font-semibold text-ink dark:text-white">
          Changer le mot de passe
        </h2>

        <p className="mb-6 text-sm text-muted dark:text-slate-400">
          Sécurisez votre compte en modifiant votre mot de passe.
        </p>

        <form
          onSubmit={handlePasswordSubmit}
          className="grid gap-5 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium dark:text-slate-200">
              Mot de passe actuel
            </label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={passwordForm.current_password}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  current_password: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-line bg-white p-3 outline-none focus:border-brand dark:border-[#315660] dark:bg-[#102a32] dark:text-white"
              placeholder="Mot de passe actuel"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium dark:text-slate-200">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={passwordForm.password}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-line bg-white p-3 outline-none focus:border-brand dark:border-[#315660] dark:bg-[#102a32] dark:text-white"
              placeholder="Minimum 8 caractères"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium dark:text-slate-200">
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={passwordForm.password_confirmation}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  password_confirmation: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-line bg-white p-3 outline-none focus:border-brand dark:border-[#315660] dark:bg-[#102a32] dark:text-white"
              placeholder="Confirmer le mot de passe"
            />
          </div>

          {passwordMessage.text && (
            <p
              role="alert"
              className="text-sm text-red-500 md:col-span-2"
            >
              {passwordMessage.text}
            </p>
          )}

          <div className="flex justify-end border-t border-line pt-5 md:col-span-2 dark:border-[#234b58]">
            <button
              type="submit"
              disabled={passwordLoading}
              className="h-11 rounded-2xl bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {passwordLoading
                ? 'Modification...'
                : 'Changer le mot de passe'}
            </button>
          </div>
        </form>
      </div>

    </div>
  )
}

export default ProfilePage
 