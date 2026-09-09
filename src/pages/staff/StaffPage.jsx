import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useSelector } from 'react-redux'

import axiosClient from '../../api/axiosClient'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import translations from '../../i18n/translations'

// =====================================================
// PERMISSIONS
// =====================================================

const PERMISSIONS = [
  'dashboard.view',

  'orders.view',
  'orders.add',
  'orders.update',
  'orders.delete',

  'meals.view',
  'meals.add',
  'meals.update',
  'meals.delete',

  'categories.view',
  'categories.add',
  'categories.update',
  'categories.delete',

  'tables.view',
  'tables.add',
  'tables.update',
  'tables.delete',

  'appearance.view',
  'appearance.update',
  'appearance.delete',

  'staff.view',
  'staff.add',
  'staff.update',
  'staff.delete',

  'qrcode.view',

  'profile.view',
  'profile.update',
]

// =====================================================
// PERMISSION GROUPS
// =====================================================

const PERMISSION_GROUPS = [
  {
    key: 'dashboard',
    permissions: ['dashboard.view'],
  },
  {
    key: 'orders',
    permissions: [
      'orders.view',
      'orders.add',
      'orders.update',
      'orders.delete',
    ],
  },
  {
    key: 'meals',
    permissions: [
      'meals.view',
      'meals.add',
      'meals.update',
      'meals.delete',
    ],
  },
  {
    key: 'categories',
    permissions: [
      'categories.view',
      'categories.add',
      'categories.update',
      'categories.delete',
    ],
  },
  {
    key: 'tables',
    permissions: [
      'tables.view',
      'tables.add',
      'tables.update',
      'tables.delete',
    ],
  },
  {
    key: 'appearance',
    permissions: [
      'appearance.view',
      'appearance.update',
      'appearance.delete',
    ],
  },
  {
    key: 'staff',
    permissions: [
      'staff.view',
      'staff.add',
      'staff.update',
      'staff.delete',
    ],
  },
  {
    key: 'qrcode',
    permissions: ['qrcode.view'],
  },
  {
    key: 'profile',
    permissions: [
      'profile.view',
      'profile.update',
    ],
  },
]

// =====================================================
// CACHE
// =====================================================

const STAFF_CACHE_PREFIX =
  'restaurant_staff_cache_'

const STAFF_CACHE_TTL =
  5 * 60 * 1000 // 5 minutes

const getStaffCacheKey = (
  restaurantId,
) =>
  `${STAFF_CACHE_PREFIX}${restaurantId}`

const getStaffFromCache = (
  restaurantId,
) => {
  if (!restaurantId) {
    return null
  }

  try {
    const raw =
      localStorage.getItem(
        getStaffCacheKey(
          restaurantId,
        ),
      )

    if (!raw) {
      return null
    }

    const cached =
      JSON.parse(raw)

    if (
      !cached ||
      !Array.isArray(
        cached.staff,
      ) ||
      !cached.timestamp
    ) {
      localStorage.removeItem(
        getStaffCacheKey(
          restaurantId,
        ),
      )

      return null
    }

    const expired =
      Date.now() -
        cached.timestamp >
      STAFF_CACHE_TTL

    if (expired) {
      localStorage.removeItem(
        getStaffCacheKey(
          restaurantId,
        ),
      )

      return null
    }

    return cached.staff
  } catch (error) {
    console.error(
      'Read staff cache error:',
      error,
    )

    return null
  }
}

const saveStaffToCache = (
  restaurantId,
  staff,
) => {
  if (
    !restaurantId ||
    !Array.isArray(staff)
  ) {
    return
  }

  try {
    localStorage.setItem(
      getStaffCacheKey(
        restaurantId,
      ),
      JSON.stringify({
        staff,
        timestamp: Date.now(),
      }),
    )
  } catch (error) {
    console.error(
      'Save staff cache error:',
      error,
    )
  }
}

// =====================================================
// PERMISSION LABEL
// =====================================================

const getPermissionLabel = (
  permission,
  t,
) => {
  const labels = {
    'dashboard.view':
      t.permissionDashboardView,

    'orders.view':
      t.permissionOrdersView,
    'orders.add':
      t.permissionOrdersAdd,
    'orders.update':
      t.permissionOrdersUpdate,
    'orders.delete':
      t.permissionOrdersDelete,

    'meals.view':
      t.permissionMealsView,
    'meals.add':
      t.permissionMealsAdd,
    'meals.update':
      t.permissionMealsUpdate,
    'meals.delete':
      t.permissionMealsDelete,

    'categories.view':
      t.permissionCategoriesView,
    'categories.add':
      t.permissionCategoriesAdd,
    'categories.update':
      t.permissionCategoriesUpdate,
    'categories.delete':
      t.permissionCategoriesDelete,

    'tables.view':
      t.permissionTablesView,
    'tables.add':
      t.permissionTablesAdd,
    'tables.update':
      t.permissionTablesUpdate,
    'tables.delete':
      t.permissionTablesDelete,

    'appearance.view':
      t.permissionAppearanceView,
    'appearance.update':
      t.permissionAppearanceUpdate,
    'appearance.delete':
      t.permissionAppearanceDelete,

    'staff.view':
      t.permissionStaffView,
    'staff.add':
      t.permissionStaffAdd,
    'staff.update':
      t.permissionStaffUpdate,
    'staff.delete':
      t.permissionStaffDelete,

    'qrcode.view':
      t.permissionQrCodeView,

    'profile.view':
      t.permissionProfileView,
    'profile.update':
      t.permissionProfileUpdate,
  }

  return (
    labels[permission] ||
    permission
  )
}

// =====================================================
// GROUP LABEL
// =====================================================

const getGroupLabel = (
  key,
  t,
) => {
  const labels = {
    dashboard: t.dashboard,
    orders: t.orders,
    meals: t.meals,
    categories: t.categories,
    tables: t.tables,
    appearance: t.appearance,
    staff: t.staff,
    qrcode: t.qrCode,
    profile: t.profile,
  }

  return labels[key] || key
}

// =====================================================
// STAFF PAGE
// =====================================================

const StaffPage = () => {
  // ===================================================
  // REDUX
  // ===================================================

  const language = useSelector(
    (state) =>
      state.ui?.language || 'en',
  )

  const user = useSelector(
    (state) =>
      state.auth?.user,
  )

  const restaurantId =
    user?.restaurant_id

  // ===================================================
  // TRANSLATIONS
  // ===================================================

  const t = useMemo(
    () =>
      translations?.[language] ||
      translations?.en ||
      {},
    [language],
  )

  const isArabic =
    language === 'ar'

  // ===================================================
  // INITIAL CACHE
  // ===================================================

  /*
   * The cache is read during state initialization.
   *
   * This avoids calling setState synchronously
   * from useEffect and fixes:
   *
   * react-hooks/set-state-in-effect
   */

  const initialCachedStaff =
    getStaffFromCache(
      restaurantId,
    )

  // ===================================================
  // STATE
  // ===================================================

  const [staff, setStaff] =
    useState(
      () =>
        initialCachedStaff ||
        [],
    )

  const [loading, setLoading] =
    useState(
      () =>
        !initialCachedStaff,
    )

  const [creating, setCreating] =
    useState(false)

  const [deletingId, setDeletingId] =
    useState(null)

  const [
    loadingPermissionsId,
    setLoadingPermissionsId,
  ] = useState(null)

  const [
    savingPermissions,
    setSavingPermissions,
  ] = useState(false)

  const [form, setForm] =
    useState({
      name: '',
      email: '',
      password: '',
    })

  const [error, setError] =
    useState(null)

  const [modal, setModal] =
    useState({
      open: false,
      staff: null,
      chosen: {},
    })

  // ===================================================
  // LOAD STAFF FROM API
  // ===================================================

  useEffect(() => {
    if (!restaurantId) {
      return
    }

    /*
     * If valid cache exists, the data has already
     * been rendered immediately through useState().
     *
     * No API request is necessary during the TTL.
     */
    const cachedStaff =
      getStaffFromCache(
        restaurantId,
      )

    if (cachedStaff) {
      return
    }

    let cancelled = false

    const fetchStaff =
      async () => {
        try {
          const response =
            await axiosClient.get(
              '/staff',
            )

          if (cancelled) {
            return
          }

          const staffData =
            response.data
              ?.staff || []

          setStaff(
            staffData,
          )

          saveStaffToCache(
            restaurantId,
            staffData,
          )
        } catch (err) {
          if (cancelled) {
            return
          }

          console.error(
            'Load staff error:',
            err,
          )

          setError(
            err?.message ||
              err?.response?.data
                ?.message ||
              t.loadStaffError ||
              'Unable to load staff.',
          )
        } finally {
          if (!cancelled) {
            setLoading(false)
          }
        }
      }

    fetchStaff()

    return () => {
      cancelled = true
    }
  }, [
    restaurantId,
    t.loadStaffError,
  ])

  // ===================================================
  // FORM CHANGE
  // ===================================================

  const handleChange = (
    e,
  ) => {
    const {
      name,
      value,
    } = e.target

    setForm(
      (current) => ({
        ...current,
        [name]: value,
      }),
    )
  }

  // ===================================================
  // CREATE STAFF
  // ===================================================

  const handleCreate =
    async (e) => {
      e.preventDefault()

      setError(null)

      const name =
        form.name.trim()

      const email =
        form.email.trim()

      const password =
        form.password

      if (!name) {
        setError(
          t.staffNameRequired ||
            'Staff name is required.',
        )
        return
      }

      if (!email) {
        setError(
          t.staffEmailRequired ||
            'Staff email is required.',
        )
        return
      }

      if (!password) {
        setError(
          t.staffPasswordRequired ||
            'Staff password is required.',
        )
        return
      }

      if (
        password.length < 8
      ) {
        setError(
          t.staffPasswordMin ||
            'Password must contain at least 8 characters.',
        )
        return
      }

      setCreating(true)

      try {
        const response =
          await axiosClient.post(
            '/staff',
            {
              name,
              email,
              password,
            },
          )

        const createdStaff =
          response.data?.staff

        if (createdStaff) {
          setStaff(
            (current) => {
              const updatedStaff =
                [
                  createdStaff,
                  ...current,
                ]

              saveStaffToCache(
                restaurantId,
                updatedStaff,
              )

              return updatedStaff
            },
          )
        }

        setForm({
          name: '',
          email: '',
          password: '',
        })
      } catch (err) {
        console.error(
          'Create staff error:',
          err,
        )

        const validationErrors =
          err?.response?.data
            ?.errors

        if (
          validationErrors
        ) {
          const firstError =
            Object.values(
              validationErrors,
            )
              .flat()
              .find(Boolean)

          setError(
            firstError ||
              t.createStaffError ||
              'Unable to create staff.',
          )
        } else {
          setError(
            err?.message ||
              err?.response?.data
                ?.message ||
              t.createStaffError ||
              'Unable to create staff.',
          )
        }
      } finally {
        setCreating(false)
      }
    }

  // ===================================================
  // DELETE STAFF
  // ===================================================

  const handleDelete =
    async (id) => {
      const confirmed =
        window.confirm(
          t.deleteStaffConfirm ||
            'Are you sure you want to delete this staff member?',
        )

      if (!confirmed) {
        return
      }

      setDeletingId(id)
      setError(null)

      try {
        await axiosClient.delete(
          `/staff/${id}`,
        )

        setStaff(
          (current) => {
            const updatedStaff =
              current.filter(
                (member) =>
                  member.id !== id,
              )

            saveStaffToCache(
              restaurantId,
              updatedStaff,
            )

            return updatedStaff
          },
        )
      } catch (err) {
        console.error(
          'Delete staff error:',
          err,
        )

        setError(
          err?.message ||
            err?.response?.data
              ?.message ||
            t.deleteStaffError ||
            'Unable to delete staff.',
        )
      } finally {
        setDeletingId(null)
      }
    }

  // ===================================================
  // OPEN PERMISSIONS
  // ===================================================

  const handleOpenPermissions =
    async (
      staffMember,
    ) => {
      setLoadingPermissionsId(
        staffMember.id,
      )

      setError(null)

      try {
        const response =
          await axiosClient.get(
            `/staff/${staffMember.id}/permissions`,
          )

        const permissions =
          response.data
            ?.permissions ||
          []

        const chosen = {}

        PERMISSIONS.forEach(
          (permission) => {
            chosen[permission] =
              permissions.includes(
                permission,
              )
          },
        )

        setModal({
          open: true,
          staff: staffMember,
          chosen,
        })
      } catch (err) {
        console.error(
          'Load permissions error:',
          err,
        )

        setError(
          err?.message ||
            err?.response?.data
              ?.message ||
            t.loadPermissionsError ||
            'Unable to load permissions.',
        )
      } finally {
        setLoadingPermissionsId(
          null,
        )
      }
    }

  // ===================================================
  // CLOSE MODAL
  // ===================================================

  const closeModal = () => {
    if (
      savingPermissions
    ) {
      return
    }

    setModal({
      open: false,
      staff: null,
      chosen: {},
    })
  }

  // ===================================================
  // TOGGLE PERMISSION
  // ===================================================

  const togglePerm = (
    permission,
  ) => {
    setModal(
      (current) => ({
        ...current,
        chosen: {
          ...current.chosen,
          [permission]:
            !current.chosen[
              permission
            ],
        },
      }),
    )
  }

  // ===================================================
  // SELECT ALL
  // ===================================================

  const selectAllPermissions =
    () => {
      const chosen = {}

      PERMISSIONS.forEach(
        (permission) => {
          chosen[permission] =
            true
        },
      )

      setModal(
        (current) => ({
          ...current,
          chosen,
        }),
      )
    }

  // ===================================================
  // UNSELECT ALL
  // ===================================================

  const unselectAllPermissions =
    () => {
      const chosen = {}

      PERMISSIONS.forEach(
        (permission) => {
          chosen[permission] =
            false
        },
      )

      setModal(
        (current) => ({
          ...current,
          chosen,
        }),
      )
    }

  // ===================================================
  // SAVE PERMISSIONS
  // ===================================================

  const savePermissions =
    async () => {
      if (!modal.staff) {
        return
      }

      setSavingPermissions(
        true,
      )

      setError(null)

      const permissions =
        PERMISSIONS.filter(
          (permission) =>
            Boolean(
              modal.chosen[
                permission
              ],
            ),
        )

      try {
        await axiosClient.put(
          `/staff/${modal.staff.id}/permissions`,
          {
            permissions,
          },
        )

        setStaff(
          (current) => {
            const updatedStaff =
              current.map(
                (member) =>
                  member.id ===
                  modal.staff.id
                    ? {
                        ...member,
                        permissions,
                      }
                    : member,
              )

            saveStaffToCache(
              restaurantId,
              updatedStaff,
            )

            return updatedStaff
          },
        )

        closeModal()
      } catch (err) {
        console.error(
          'Save permissions error:',
          err,
        )

        setError(
          err?.message ||
            err?.response?.data
              ?.message ||
            t.savePermissionsError ||
            'Unable to save permissions.',
        )
      } finally {
        setSavingPermissions(
          false,
        )
      }
    }

  // ===================================================
  // SELECTED PERMISSIONS COUNT
  // ===================================================

  const selectedPermissionsCount =
    useMemo(
      () =>
        Object.values(
          modal.chosen,
        ).filter(Boolean)
          .length,
      [modal.chosen],
    )

  // ===================================================
  // UI
  // ===================================================

  return (
    <div
      dir={
        isArabic
          ? 'rtl'
          : 'ltr'
      }
      className="text-slate-900 dark:text-slate-100"
    >
      <div className="space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {t.staff || 'Staff'}
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t.staffDescription ||
              'Manage your restaurant staff and their permissions.'}
          </p>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {/* =================================================
            ADD STAFF
        ================================================= */}

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card transition-colors dark:border-slate-800 dark:bg-slate-900/95">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t.addStaff ||
                'Add staff'}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {t.addStaffDescription ||
                'Create a staff account for your restaurant.'}
            </p>
          </div>

          <form
            onSubmit={handleCreate}
            className="grid gap-5 md:grid-cols-3"
          >
            <Input
              label={
                t.name || 'Name'
              }
              name="name"
              value={form.name}
              onChange={
                handleChange
              }
              disabled={
                creating
              }
            />

            <Input
              label={
                t.email || 'Email'
              }
              name="email"
              type="email"
              value={
                form.email
              }
              onChange={
                handleChange
              }
              disabled={
                creating
              }
            />

            <Input
              label={
                t.password ||
                'Password'
              }
              name="password"
              type="password"
              value={
                form.password
              }
              onChange={
                handleChange
              }
              disabled={
                creating
              }
            />

            <div className="md:col-span-3">
              <Button
                type="submit"
                disabled={
                  creating
                }
              >
                {creating
                  ? t.creatingStaff ||
                    'Creating...'
                  : t.addStaff ||
                    'Add staff'}
              </Button>
            </div>
          </form>
        </div>

        {/* =================================================
            STAFF LIST
        ================================================= */}

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card transition-colors dark:border-slate-800 dark:bg-slate-900/95">

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t.staffList ||
                'Staff list'}
            </h2>

            {!loading && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {staff.length}
              </span>
            )}
          </div>

          {loading ? (
            <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              {t.loading ||
                'Loading...'}
            </div>
          ) : staff.length ===
            0 ? (
            <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              {t.noStaff ||
                'No staff members yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full min-w-[1050px] table-auto border-collapse">
                <thead>
                  <tr
                    className={`border-b border-slate-200 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 ${
                      isArabic
                        ? 'text-right'
                        : 'text-left'
                    }`}
                  >
                    <th className="whitespace-nowrap p-4 font-medium">
                      {t.name ||
                        'Name'}
                    </th>

                    <th className="whitespace-nowrap p-4 px-20 font-medium">
                      {t.email ||
                        'Email'}
                    </th>

                    <th className="whitespace-nowrap p-4 px-20 font-medium">
                      {t.role ||
                        'Role'}
                    </th>

                    <th className="whitespace-nowrap p-4 px-20 font-medium">
                      {t.permissions ||
                        'Permissions'}
                    </th>

                    <th className="min-w-[320px] whitespace-nowrap p-4 px-20 font-medium">
                      {t.actions ||
                        'Actions'}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {staff.map(
                    (
                      member,
                    ) => {
                      const permissions =
                        Array.isArray(
                          member.permissions,
                        )
                          ? member.permissions
                          : []

                      return (
                        <tr
                          key={
                            member.id
                          }
                          className="border-b border-slate-200 last:border-b-0 dark:border-slate-800"
                        >
                          {/* Name */}

                          <td className="p-4 align-middle">
                            <div
                              className="max-w-[220px] truncate font-medium text-slate-900 dark:text-slate-100"
                              title={
                                member.name
                              }
                            >
                              {
                                member.name
                              }
                            </div>
                          </td>

                          {/* Email */}

                          <td className="p-4 px-20 align-middle">
                            <div
                              dir="ltr"
                              className="max-w-[260px] truncate text-slate-600 dark:text-slate-300"
                              title={
                                member.email
                              }
                            >
                              {
                                member.email
                              }
                            </div>
                          </td>

                          {/* Role */}

                          <td className="whitespace-nowrap p-4 px-20 align-middle">
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              {
                                member.role
                              }
                            </span>
                          </td>

                          {/* Permissions */}

                          <td className="whitespace-nowrap p-4 px-20 align-middle">
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                              {
                                permissions.length
                              }

                              <span className="mx-1">
                                /
                              </span>

                              {
                                PERMISSIONS.length
                              }
                            </span>
                          </td>

                          {/* Actions */}

                          <td className="min-w-[320px] p-4 px-20 align-middle">
                            <div className="flex items-center gap-3">
                              <Button
                                type="button"
                                variant="ghost"
                                disabled={
                                  loadingPermissionsId ===
                                  member.id
                                }
                                onClick={() =>
                                  handleOpenPermissions(
                                    member,
                                  )
                                }
                                className="whitespace-nowrap"
                              >
                                {loadingPermissionsId ===
                                member.id
                                  ? t.loading ||
                                    'Loading...'
                                  : t.managePermissions ||
                                    'Manage permissions'}
                              </Button>

                              <Button
                                type="button"
                                variant="ghost"
                                disabled={
                                  deletingId ===
                                  member.id
                                }
                                onClick={() =>
                                  handleDelete(
                                    member.id,
                                  )
                                }
                                className="whitespace-nowrap"
                              >
                                {deletingId ===
                                member.id
                                  ? t.deleting ||
                                    'Deleting...'
                                  : t.delete ||
                                    'Delete'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    },
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* =================================================
          PERMISSIONS MODAL
      ================================================= */}

      {modal.open &&
        modal.staff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px] dark:bg-black/70">
            <div
              className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900/95"
              role="dialog"
              aria-modal="true"
            >

              {/* Modal Header */}

              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {t.managePermissions ||
                      'Manage permissions'}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {
                      modal
                        .staff
                        .name
                    }
                  </p>

                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    {
                      selectedPermissionsCount
                    }{' '}
                    /{' '}
                    {
                      PERMISSIONS.length
                    }
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  disabled={
                    savingPermissions
                  }
                  className="rounded-xl px-3 py-2 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Select / Unselect */}

              <div className="mb-6 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={
                    selectAllPermissions
                  }
                  disabled={
                    savingPermissions
                  }
                >
                  {t.selectAll ||
                    'Select all'}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={
                    unselectAllPermissions
                  }
                  disabled={
                    savingPermissions
                  }
                >
                  {t.unselectAll ||
                    'Unselect all'}
                </Button>
              </div>

              {/* Permission Groups */}

              <div className="space-y-5">
                {PERMISSION_GROUPS.map(
                  (group) => (
                    <div
                      key={
                        group.key
                      }
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-800/60"
                    >
                      <div className="mb-4">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          {getGroupLabel(
                            group.key,
                            t,
                          )}
                        </h4>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {group.permissions
                          .filter(
                            (
                              permission,
                            ) =>
                              PERMISSIONS.includes(
                                permission,
                              ),
                          )
                          .map(
                            (
                              permission,
                            ) => (
                              <label
                                key={
                                  permission
                                }
                                className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:bg-slate-800"
                              >
                                <input
                                  type="checkbox"
                                  checked={Boolean(
                                    modal
                                      .chosen[
                                      permission
                                    ],
                                  )}
                                  onChange={() =>
                                    togglePerm(
                                      permission,
                                    )
                                  }
                                  disabled={
                                    savingPermissions
                                  }
                                  className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                                />

                                <div className="min-w-0">
                                  <p className="font-medium text-slate-800 dark:text-slate-100">
                                    {getPermissionLabel(
                                      permission,
                                      t,
                                    )}
                                  </p>

                                  <p className="mt-1 break-all text-xs text-slate-400 dark:text-slate-500">
                                    {
                                      permission
                                    }
                                  </p>
                                </div>
                              </label>
                            ),
                          )}
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* Modal Footer */}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={
                    closeModal
                  }
                  disabled={
                    savingPermissions
                  }
                >
                  {t.cancel ||
                    'Cancel'}
                </Button>

                <Button
                  type="button"
                  onClick={
                    savePermissions
                  }
                  disabled={
                    savingPermissions
                  }
                >
                  {savingPermissions
                    ? t.saving ||
                      'Saving...'
                    : t.savePermissions ||
                      'Save permissions'}
                </Button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default StaffPage
 