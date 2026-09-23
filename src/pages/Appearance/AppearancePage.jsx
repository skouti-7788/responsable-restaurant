import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  useDispatch,
  useSelector,
} from 'react-redux'

import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  Palette,
  Trash2,
  Upload,
} from 'lucide-react'

import axiosClient from '../../api/axiosClient'

import Button from '../../components/ui/Button'

import translations from '../../i18n/translations'

import {
  DEFAULT_APPEARANCE,
  getCachedAppearance,
  getRestaurantAppearance,
  saveRestaurantAppearance,
} from '../../data/dataAppearance'

import {
  setRestaurant,
} from '../../store/restaurantSlice'

// =========================================================
// FONTS
// =========================================================

const FONT_OPTIONS = [
  'Inter',
  'Poppins',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Lato',
  'Playfair Display',
  'Merriweather',
]

// =========================================================
// PUBLIC MENU
// =========================================================

const PUBLIC_MENU_ORIGIN = (
  import.meta.env.VITE_PUBLIC_MENU_URL ||
  'https://menu-online.vercel.app'
).replace(/\/+$/, '')

// =========================================================
// IMAGE LIMITS
// =========================================================

const IMAGE_LIMITS = {
  logo: 2 * 1024 * 1024,
  header_image: 4 * 1024 * 1024,
  // background_image: 4 * 1024 * 1024,
}

// =========================================================
// IMAGE -> DATA URL
// =========================================================

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader =
      new FileReader()

    reader.onload = () =>
      resolve(reader.result)

    reader.onerror = () =>
      reject(
        new Error(
          'Could not read image file.'
        )
      )

    reader.readAsDataURL(file)
  })

// =========================================================
// IMAGE UPLOADER
// =========================================================

const ImageUploader = ({
  label,
  previewUrl,
  loading,
  fileError,
  onSelect,
  onRemove,
  uploadText,
  replaceText,
  removeText,
}) => {
  const inputRef =
    useRef(null)

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">

      <div className="mb-4 flex items-center justify-between gap-3">

        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {label}
          </p>
        </div>

      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

        <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-900">

          {previewUrl ? (
            <img
              src={previewUrl}
              alt={label}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
              <ImagePlus className="h-6 w-6" />
            </div>
          )}

        </div>

        <div className="flex flex-1 flex-wrap items-center gap-2">

          <Button
            type="button"
            variant="secondary"
            className="min-w-[120px]"
            onClick={() =>
              inputRef.current?.click()
            }
            disabled={loading}
          >
            <Upload className="mr-2 h-4 w-4" />

            {previewUrl
              ? replaceText
              : uploadText}
          </Button>

          {previewUrl && (
            <Button
              type="button"
              variant="ghost"
              className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
              onClick={onRemove}
              disabled={loading}
            >
              <Trash2 className="mr-2 h-4 w-4" />

              {removeText}
            </Button>
          )}

        </div>

      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onSelect}
      />

      {fileError && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">
          {fileError}
        </p>
      )}

    </div>
  )
}

// =========================================================
// STATIC IFRAME
// =========================================================

const MenuPreviewFrame = ({
  iframeRef,
  menuUrl,
  onLoad,
}) => {
  return (
    <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-slate-100 shadow-inner dark:border-slate-800 dark:bg-slate-950">

      <iframe
        ref={iframeRef}
        title="Public menu preview"
        src={menuUrl}
        onLoad={onLoad}
        className="h-[700px] w-full bg-white"
        loading="eager"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />

    </div>
  )
}

// =========================================================
// APPEARANCE PAGE
// =========================================================

const AppearancePage = () => {
  const dispatch =
    useDispatch()

  const { language } =
    useSelector(
      (state) => state.ui
    )

  const restaurant =
    useSelector(
      (state) =>
        state.restaurant.profile
    )

  const t =
    translations[language] ||
    translations.en ||
    {}

  // =======================================================
  // CACHE
  // =======================================================

  const cachedAppearance =
    useMemo(
      () => getCachedAppearance(),
      []
    )

  // =======================================================
  // FORM
  // =======================================================

  const [form, setForm] =
    useState(() => ({
      ...DEFAULT_APPEARANCE,
      ...(cachedAppearance || {}),
    }))

  // =======================================================
  // FILES
  // =======================================================

  const [imageFiles, setImageFiles] =
    useState({
      logo: null,
      header_image: null,
      // background_image: null,
    })

  // =======================================================
  // REMOVE FLAGS
  // =======================================================

  const [removeFlags, setRemoveFlags] =
    useState({
      logo: false,
      header_image: false,
      // background_image: false,
    })

  // =======================================================
  // STATES
  // =======================================================

  const [saving, setSaving] =
    useState(false)

  // IMPORTANT:
  // If cache exists, do not show full-page loading.
  const [loading, setLoading] =
    useState(!cachedAppearance)

  const [previewLoading, setPreviewLoading] =
    useState(true)

  const [status, setStatus] =
    useState({
      type: '',
      message: '',
    })

  const [errors, setErrors] =
    useState({})

  // =======================================================
  // IFRAME
  // =======================================================

  const iframeRef =
    useRef(null)

  const iframeLoadedRef =
    useRef(false)

  const previewTimerRef =
    useRef(null)

  // =======================================================
  // MENU URL
  //
  // IMPORTANT:
  // form changes DO NOT change iframe src.
  // =======================================================

  const menuPreviewUrl =
    useMemo(() => {
      if (!restaurant?.slug) {
        return `${PUBLIC_MENU_ORIGIN}/menu?preview=true`
      }

      return `${PUBLIC_MENU_ORIGIN}/menu/${restaurant.slug}?preview=true`
    }, [restaurant?.slug])

  // =======================================================
  // LOAD RESTAURANT
  // =======================================================

  useEffect(() => {
    const loadRestaurant =
      async () => {
        try {
          const response =
            await axiosClient.get(
              '/restaurants'
            )

          const restaurants =
            response.data?.data ||
            response.data ||
            []

          if (
            Array.isArray(
              restaurants
            ) &&
            restaurants.length > 0
          ) {
            dispatch(
              setRestaurant(
                restaurants[0]
              )
            )
          }
        } catch (error) {
          console.error(
            'Failed to load restaurant:',
            error
          )
        }
      }

    if (!restaurant) {
      loadRestaurant()
    }
  }, [
    dispatch,
    restaurant,
  ])

  // =======================================================
  // LOAD APPEARANCE
  //
  // If cache exists:
  // - page displays cache immediately
  // - API refreshes in background
  //
  // If no cache:
  // - full loading is displayed
  // =======================================================

  useEffect(() => {
    let mounted = true

    const loadAppearance =
      async () => {
        try {
          const response =
            await getRestaurantAppearance()

          if (!mounted) {
            return
          }

          const freshAppearance = {
            ...DEFAULT_APPEARANCE,
            ...response,
          }

          setForm(
            freshAppearance
          )

        } catch (error) {
          if (!mounted) {
            return
          }

          console.error(
            'Failed to load appearance:',
            error
          )

          // Only show error if there is no cached data
          if (!cachedAppearance) {
            setStatus({
              type: 'error',
              message:
                error?.message ||
                t.errorSavingChanges ||
                'Unable to load appearance.',
            })
          }

        } finally {
          if (mounted) {
            setLoading(false)
          }
        }
      }

    loadAppearance()

    return () => {
      mounted = false
    }
  }, [
    cachedAppearance,
    t.errorSavingChanges,
  ])

  // =======================================================
  // SEND PREVIEW
  // =======================================================

  const sendPreview = () => {
    const iframe =
      iframeRef.current

    if (
      !iframe ||
      !iframe.contentWindow ||
      !iframeLoadedRef.current
    ) {
      return
    }

    iframe.contentWindow.postMessage(
      {
        type:
          'MENU_ONLINE_APPEARANCE_PREVIEW',

        appearance: {
          ...form,

          font_family:
            form.font_family ||
            'Inter',
        },
      },

      PUBLIC_MENU_ORIGIN
    )
  }

  // =======================================================
  // IFRAME LOAD
  // =======================================================

  const handlePreviewLoad =
    () => {
      iframeLoadedRef.current =
        true

      setPreviewLoading(false)

      sendPreview()
    }

  // =======================================================
  // LIVE PREVIEW UPDATE
  //
  // form changes:
  // color
  // font
  // logo
  // header
  // background
  //
  // => postMessage only
  // => NO iframe reload
  // =======================================================

  useEffect(() => {
    if (
      !iframeLoadedRef.current
    ) {
      return
    }

    if (
      previewTimerRef.current
    ) {
      window.clearTimeout(
        previewTimerRef.current
      )
    }

    previewTimerRef.current =
      window.setTimeout(() => {
        sendPreview()
      }, 30)

    return () => {
      if (
        previewTimerRef.current
      ) {
        window.clearTimeout(
          previewTimerRef.current
        )
      }
    }
  }, [form])

  // =======================================================
  // CLEANUP
  // =======================================================

  useEffect(() => {
    return () => {
      if (
        previewTimerRef.current
      ) {
        window.clearTimeout(
          previewTimerRef.current
        )
      }
    }
  }, [])

  // =======================================================
  // APPEARANCE CHANGE
  // =======================================================

  const handleAppearanceChange = (
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    setErrors((current) => ({
      ...current,
      [field]: '',
    }))
  }

  // =======================================================
  // IMAGE SELECT
  // =======================================================

  const handleImageSelect =
    async (
      field,
      event
    ) => {
      const file =
        event.target.files?.[0]

      if (!file) {
        return
      }

      const maxSize =
        IMAGE_LIMITS[field] ||
        4 * 1024 * 1024

      // ===================================================
      // SIZE
      // ===================================================

      if (file.size > maxSize) {
        setErrors((current) => ({
          ...current,

          [field]:
            `This image is too large. Please use a file under ${Math.round(
              maxSize /
                1024 /
                1024
            )} MB.`,
        }))

        event.target.value = ''

        return
      }

      // ===================================================
      // TYPE
      // ===================================================

      if (
        !file.type.startsWith(
          'image/'
        )
      ) {
        setErrors((current) => ({
          ...current,

          [field]:
            'Please select a valid image file.',
        }))

        event.target.value = ''

        return
      }

      // ===================================================
      // READ FILE
      // ===================================================

      try {
        const previewUrl =
          await readFileAsDataUrl(
            file
          )

        // Store actual file
        setImageFiles(
          (current) => ({
            ...current,
            [field]: file,
          })
        )

        // Cancel remove
        setRemoveFlags(
          (current) => ({
            ...current,
            [field]: false,
          })
        )

        // Preview
        setForm(
          (current) => ({
            ...current,
            [field]: previewUrl,
          })
        )

        setErrors(
          (current) => ({
            ...current,
            [field]: '',
          })
        )

      } catch (error) {
        setErrors(
          (current) => ({
            ...current,

            [field]:
              error?.message ||
              'Unable to read the selected image.',
          })
        )

      } finally {
        event.target.value = ''
      }
    }

  // =======================================================
  // IMAGE REMOVE
  // =======================================================

  const handleImageRemove =
    (field) => {
      setImageFiles(
        (current) => ({
          ...current,
          [field]: null,
        })
      )

      setRemoveFlags(
        (current) => ({
          ...current,
          [field]: true,
        })
      )

      setForm(
        (current) => ({
          ...current,
          [field]: null,
        })
      )

      setErrors(
        (current) => ({
          ...current,
          [field]: '',
        })
      )
    }

  // =======================================================
  // SAVE
  // =======================================================

  const handleSubmit =
    async (event) => {
      event.preventDefault()

      if (saving) {
        return
      }

      setSaving(true)

      setStatus({
        type: '',
        message: '',
      })

      try {
        const payload = {
          ...form,

          logoFile:
            imageFiles.logo,

          header_imageFile:
            imageFiles.header_image,

          // background_imageFile:
          //   imageFiles.background_image,

          remove_logo:
            removeFlags.logo,

          remove_header_image:
            removeFlags.header_image,

          // remove_background_image:
          //   removeFlags.background_image,
        }

        const updatedAppearance =
          await saveRestaurantAppearance(
            payload
          )

        const newAppearance = {
          ...DEFAULT_APPEARANCE,
          ...updatedAppearance,
        }

        setForm(
          newAppearance
        )

        setImageFiles({
          logo: null,
          header_image: null,
          // background_image: null,
        })

        setRemoveFlags({
          logo: false,
          header_image: false,
          // background_image: false,
        })

        setStatus({
          type: 'success',

          message:
            t.changesSavedSuccessfully ||
            'Changes saved successfully',
        })

      } catch (error) {
        console.error(
          'Failed to save appearance:',
          error
        )

        setStatus({
          type: 'error',

          message:
            error?.message ||
            t.errorSavingChanges ||
            'Error saving changes',
        })

      } finally {
        setSaving(false)
      }
    }

  // =======================================================
  // INITIAL LOADING
  //
  // ONLY appears when there is no cache.
  // =======================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">

        <div className="flex flex-col items-center gap-3">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" />

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.loading ||
              'loading...'}
          </p>

        </div>

      </div>
    )
  }

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6 flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">

            <Palette className="h-5 w-5" />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">

              {t.appearance ||
                'Appearance'}

            </h1>

          </div>

        </div>

        {/* =================================================
            STATUS
        ================================================= */}

        {status.message && (
          <div
            className={`mb-6 flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm ${
              status.type ===
              'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300'
            }`}
          >

            {status.type ===
            'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}

            <span>
              {status.message}
            </span>

          </div>
        )}

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">

          {/* =================================================
              SETTINGS
          ================================================= */}

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-6"
          >

            {/* =================================================
                IMAGES
            ================================================= */}

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">

              <h2 className="mb-5 text-lg font-semibold text-slate-900 dark:text-slate-100">

                {t.Images}

              </h2>

              <div className="space-y-5">

                <ImageUploader
                  label={
                    t.logo ||
                    'Logo'
                  }
                  previewUrl={
                    form.logo ||
                    ''
                  }
                  loading={
                    saving
                  }
                  fileError={
                    errors.logo
                  }
                  onSelect={(
                    event
                  ) =>
                    handleImageSelect(
                      'logo',
                      event
                    )
                  }
                  onRemove={() =>
                    handleImageRemove(
                      'logo'
                    )
                  }
                  uploadText={
                    t.upload ||
                    'Upload'
                  }
                  replaceText={
                    t.replace ||
                    'Replace'
                  }
                  removeText={
                    t.remove ||
                    'Remove'
                  }
                />

                <ImageUploader
                  label={
                    t.headerImage ||
                    'Header image'
                  }
                  previewUrl={
                    form.header_image ||
                    ''
                  }
                  loading={
                    saving
                  }
                  fileError={
                    errors.header_image
                  }
                  onSelect={(
                    event
                  ) =>
                    handleImageSelect(
                      'header_image',
                      event
                    )
                  }
                  onRemove={() =>
                    handleImageRemove(
                      'header_image'
                    )
                  }
                  uploadText={
                    t.upload ||
                    'Upload'
                  }
                  replaceText={
                    t.replace ||
                    'Replace'
                  }
                  removeText={
                    t.remove ||
                    'Remove'
                  }
                />

                {/* <ImageUploader
                  label={
                    t.backgroundImage ||
                    'Background image'
                  }
                  previewUrl={
                    form.background_image ||
                    ''
                  }
                  loading={
                    saving
                  }
                  fileError={
                    errors.background_image
                  }
                  onSelect={(
                    event
                  ) =>
                    handleImageSelect(
                      'background_image',
                      event
                    )
                  }
                  onRemove={() =>
                    handleImageRemove(
                      'background_image'
                    )
                  }
                  uploadText={
                    t.upload ||
                    'Upload'
                  }
                  replaceText={
                    t.replace ||
                    'Replace'
                  }
                  removeText={
                    t.remove ||
                    'Remove'
                  }
                /> */}

              </div>

            </div>

            {/* =================================================
                COLORS
            ================================================= */}

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">

              <h2 className="mb-5 text-lg font-semibold text-slate-900 dark:text-slate-100">

                {t.colors ||
                  'Colors'}

              </h2>

              <div className="grid gap-4 md:grid-cols-2">

                {[
                  [
                    'primary_color',
                    t.primaryColor ||
                      'Primary color',
                  ],

                  [
                    'secondary_color',
                    t.secondaryColor ||
                      'Secondary color',
                  ], 
                  
                  [
                    'text_color',
                    t.textColor ||
                      'Text color',
                  ],

                  [
                    'background_color',
                    t.backgroundColor ||
                      'Background color',
                  ],
                ].map(
                  ([field, label]) => (
                    <label
                      key={field}
                      className="block rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
                    >

                      <span className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">

                        {label}

                      </span>

                      <div className="flex items-center gap-3">

                        <input
                          type="color"
                          value={
                            form[field] ||
                            '#D97706'
                          }
                          onChange={(
                            event
                          ) =>
                            handleAppearanceChange(
                              field,
                              event
                                .target
                                .value
                            )
                          }
                          className="h-11 w-12 cursor-pointer rounded-xl border border-slate-200 bg-transparent p-1 dark:border-slate-700"
                        />

                        <span className="font-mono text-sm text-slate-700 dark:text-slate-300">

                          {form[field] ||
                            '#D97706'}

                        </span>

                      </div>

                    </label>
                  )
                )}

              </div>

            </div>

            {/* =================================================
                FONT
            ================================================= */}

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">

              <h2 className="mb-5 text-lg font-semibold text-slate-900 dark:text-slate-100">

                {t.font ||
                  'Font'}

              </h2>

              <select
                value={
                  form.font_family ||
                  'Inter'
                }
                onChange={(
                  event
                ) =>
                  handleAppearanceChange(
                    'font_family',
                    event.target.value
                  )
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              >

                {FONT_OPTIONS.map(
                  (font) => (
                    <option
                      key={font}
                      value={font}
                    >
                      {font}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* =================================================
                SAVE
            ================================================= */}

            <div className="flex justify-end">

              <Button
                type="submit"
                className="min-w-[180px]"
                disabled={saving}
              >

                {saving
                  ? t.saving ||
                    'Saving...'
                  : t.saveChanges ||
                    'Save Changes'}

              </Button>

            </div>

          </form>

          {/* =================================================
              LIVE PREVIEW
          ================================================= */}

          <div>

            <div className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 sm:p-5">

              <div className="mb-4 flex items-center justify-between gap-3">

                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">

                  {t.livePreview ||
                    'Live preview'}

                </h2>

                {previewLoading && (
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">

                    <div className="mx-auto h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" />

                    <span>
                      {t.loading ||
                        'Loading ...'}
                    </span>

                  </div>
                )}

              </div>

              <div className="relative">

                <MenuPreviewFrame
                  iframeRef={
                    iframeRef
                  }
                  menuUrl={
                    menuPreviewUrl
                  }
                  onLoad={
                    handlePreviewLoad
                  }
                />

                {previewLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[26px] bg-white/70 backdrop-blur-sm dark:bg-slate-950/70">

                    <div className="flex flex-col items-center gap-3">

                      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" />

                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">

                        {t.loadingPreview ||
                          'Loading preview...'}

                      </span>

                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default AppearancePage