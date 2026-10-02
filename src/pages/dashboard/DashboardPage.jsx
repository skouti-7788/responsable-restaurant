import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useDispatch, useSelector } from 'react-redux'

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
import {
  getCurrentRestaurantId,
  getRestaurantCacheKey,
} from '../../utils/restaurantCache'

import translations from '../../i18n/translations'

const DashboardPage = () => {
  const dispatch = useDispatch()
  const { language } =
    useSelector(
      (state) => state.ui
    )

  const t = useMemo(
    () =>
      translations[language] ||
      translations.en ||
      {},
    [language]
  )

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
      const restaurantId = getCurrentRestaurantId()
      const cacheKey = getRestaurantCacheKey(
        'restaurant_dashboard_cache',
        restaurantId
      )

      return !cacheKey || !localStorage.getItem(cacheKey)
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
              dispatch,
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
        dispatch,
        language,
        t,
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
        'bg-[#fff1d9] text-brand dark:bg-[#18353d] dark:text-[#ffb347]',
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
        'bg-[#f9eadf] text-ink dark:bg-[#18353d] dark:text-[#f3d7b2]',
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
        'bg-[#fff7e9] text-[#b45309] dark:bg-[#18353d] dark:text-[#f5c35a]',
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
        'bg-[#fdf3e7] text-brand-dark dark:bg-[#18353d] dark:text-[#ffb347]',
    },
  ]

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="text-ink dark:text-white">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-ink dark:text-white">
            {t.dashboard ||
              'Dashboard'}
          </h1>

          <p className="mt-1 text-sm text-muted dark:text-[#dfe7eb]">
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
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-line bg-white px-4 text-sm font-medium text-ink transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#234b58] dark:bg-[#18353d] dark:text-white dark:hover:bg-[#234b58]"
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
        <div className="rounded-[2rem] border border-line bg-white p-10 text-center shadow-card dark:border-[#234b58] dark:bg-[#18353d]">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand" />

          <p className="mt-4 text-sm text-muted dark:text-[#dfe7eb]">
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
                    className="rounded-[2rem] border border-line bg-white p-6 shadow-card transition-colors dark:border-[#234b58] dark:bg-[#18353d]"
                  >

                    <div
                      className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-3xl ${item.color}`}
                    >
                      <Icon
                        size={22}
                      />
                    </div>

                    <p className="text-sm text-muted dark:text-[#dfe7eb]">
                      {t[
                        item.labelKey
                      ] ||
                        item.labelKey}
                    </p>

                    <p className="mt-2 text-3xl font-semibold text-ink dark:text-white">
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

                <span className="rounded-2xl bg-sand px-3 py-2 text-sm text-ink dark:bg-[#234b58] dark:text-[#dfe7eb]">
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

                        <div className="flex items-center justify-between text-sm text-ink dark:text-white">

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

                        <div className="h-3 overflow-hidden rounded-full bg-[#f4e9d8] dark:bg-[#234b58]">

                          <div
                            className="h-full rounded-full bg-brand transition-all duration-500"
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
                        className="rounded-3xl border border-line bg-sand p-4 transition-colors dark:border-[#234b58] dark:bg-[#0f1d22]"
                      >

                        <p className="text-sm text-ink dark:text-white">
                          {
                            activity.event
                          }
                        </p>

                        <p className="mt-2 text-xs text-muted">
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
 
