import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { useSelector } from 'react-redux'

import {
  Activity,
  BarChart2,
  Layers,
  ShoppingBag,
  RefreshCw,
} from 'lucide-react'

import {
  fetchDashboardData,
  getDashboardCache,
} from '../../data/dataDashboard'

import translations from '../../i18n/translations'

const DashboardPage = () => {
  const { language } =
    useSelector(
      (state) => state.ui
    )

  const t =
    translations[language] ||
    translations.en ||
    {}

  // =====================================================
  // DASHBOARD CACHE
  // =====================================================

  const [
    dashboard,
    setDashboard,
  ] = useState(
    getDashboardCache
  )

  // =====================================================
  // LOADING
  // =====================================================

  const [
    loading,
    setLoading,
  ] = useState(() => {
    try {
      return !localStorage.getItem(
        'restaurant_dashboard_cache'
      )
    } catch {
      return true
    }
  })

  // =====================================================
  // ERROR
  // =====================================================

  const [
    error,
    setError,
  ] = useState('')

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  const loadDashboardData =
    useCallback(
      async () => {
        setError('')

        try {
          setLoading(true)

          const data =
            await fetchDashboardData({
              language,
              translations: t,
            })

          setDashboard(data)
        } catch (err) {
          console.error(
            'Load dashboard error:',
            err
          )

          /*
           * مهم:
           * ما نمسحوش dashboard القديم.
           *
           * إذا API فشل:
           * البيانات القديمة تبقى ظاهرة.
           */

          setError(
            err?.response?.data
              ?.message ||
              err?.message ||
              t.loadDashboardError ||
              'Failed to load dashboard.'
          )
        } finally {
          setLoading(false)
        }
      },
      [
        language,
        t.loadDashboardError,
        t.newOrderReceived,
        t.restaurantNotFound,
      ]
    )

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const timer =
      setTimeout(() => {
        loadDashboardData()
      }, 0)

    return () => {
      clearTimeout(timer)
    }
  }, [loadDashboardData])

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh =
    async () => {
      /*
       * البيانات القديمة كتبقى باينة
       * حتى تجي data الجديدة.
       */

      await loadDashboardData()
    }

  // =====================================================
  // STATS
  // =====================================================

  const stats = [
    {
      labelKey:
        'totalMeals',

      value:
        String(
          dashboard.totalMeals
        ),

      icon: Layers,

      color:
        'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300',
    },

    {
      labelKey:
        'totalCategories',

      value:
        String(
          dashboard.totalCategories
        ),

      icon: BarChart2,

      color:
        'bg-violet-500/10 text-violet-600 dark:text-violet-300',
    },

    {
      labelKey:
        'totalOrders',

      value:
        String(
          dashboard.totalOrders
        ),

      icon: ShoppingBag,

      color:
        'bg-amber-500/10 text-amber-600 dark:text-amber-300',
    },

    {
      labelKey:
        'menuViews',

      value:
        String(
          dashboard.menuViews
        ),

      icon: Activity,

      color:
        'bg-sky-500/10 text-sky-600 dark:text-sky-300',
    },
  ]

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
            {t.dashboard ||
              'Dashboard'}
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t.dashboardDescription ||
              'Overview of your restaurant.'}
          </p>
        </div>

        {/* REFRESH */}

        <button
          type="button"
          onClick={
            handleRefresh
          }
          disabled={loading}
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
      dashboard.totalMeals ===
        0 &&
      dashboard.totalCategories ===
        0 &&
      dashboard.totalOrders ===
        0 ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-card dark:border-slate-800 dark:bg-slate-900">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" />

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {t.loading ||
              'Loading...'}
          </p>

        </div>
      ) : (
        <>
          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            {stats.map(
              (item) => {
                const Icon =
                  item.icon

                return (
                  <div
                    key={
                      item.labelKey
                    }
                    className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card transition-colors dark:border-slate-800 dark:bg-slate-900"
                  >

                    <div
                      className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-3xl ${item.color}`}
                    >
                      <Icon
                        size={22}
                      />
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {t[
                        item.labelKey
                      ] ||
                        item.labelKey}
                    </p>

                    <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                      {
                        item.value
                      }
                    </p>

                  </div>
                )
              }
            )}

          </div>

          {/* =================================================
              BOTTOM
          ================================================= */}

          <section className="mt-5 grid gap-5 xl:grid-cols-2">

            {/* =================================================
                POPULAR MEALS
            ================================================= */}

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card transition-colors dark:border-slate-800 dark:bg-slate-900">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t.popularMeals ||
                      'Popular meals'}
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {t.weeklyPerformance ||
                      'Weekly performance'}
                  </h2>
                </div>

                <span className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {t.live ||
                    'Live'}
                </span>

              </div>

              <div className="mt-8 space-y-5">

                {dashboard
                  .popularMeals
                  ?.length ? (

                  dashboard.popularMeals.map(
                    (meal) => (
                      <div
                        key={
                          meal.id ||
                          meal.name
                        }
                        className="space-y-3"
                      >

                        <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-200">

                          <span>
                            {
                              meal.name
                            }
                          </span>

                          <span>
                            {
                              meal.percent
                            }
                            %
                          </span>

                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">

                          <div
                            className="h-full rounded-full bg-sky-400 transition-all duration-500"
                            style={{
                              width: `${Math.max(
                                0,
                                Math.min(
                                  100,
                                  Number(
                                    meal.percent
                                  ) || 0
                                )
                              )}%`,
                            }}
                          />

                        </div>

                      </div>
                    )
                  )

                ) : (

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-400">
                    {t.noData ||
                      'No data available.'}
                  </div>

                )}

              </div>

            </div>

            {/* =================================================
                RECENT ACTIVITY
            ================================================= */}

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card transition-colors dark:border-slate-800 dark:bg-slate-900">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t.recentActivity ||
                      'Recent activity'}
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {t.updatesStream ||
                      'Updates stream'}
                  </h2>
                </div>

              </div>

              <div className="mt-8 space-y-4">

                {dashboard
                  .activities
                  ?.length ? (

                  dashboard.activities.map(
                    (
                      activity,
                      index
                    ) => (
                      <div
                        key={
                          activity.id ||
                          `${activity.event}-${index}`
                        }
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-950/80"
                      >

                        <p className="text-sm text-slate-900 dark:text-slate-100">
                          {
                            activity.event
                          }
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                          {
                            activity.time
                          }
                        </p>

                      </div>
                    )
                  )

                ) : (

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-400">
                    {t.noActivity ||
                      'No recent activity.'}
                  </div>

                )}

              </div>

            </div>

          </section>
        </>
      )}

    </div>
  )
}

export default DashboardPage
 
