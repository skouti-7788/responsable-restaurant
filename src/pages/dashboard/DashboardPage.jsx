import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Activity,
  BarChart2,
  Layers,
  ShoppingBag,
  RefreshCw,
} from 'lucide-react'

import axiosClient from '../../api/axiosClient'
import translations from '../../i18n/translations'

const DashboardPage = () => {
  const { language } = useSelector((state) => state.ui)

  const t =
    translations[language] ||
    translations.en ||
    {}

  // =====================================================
  // CACHE KEYS
  // =====================================================

  const DASHBOARD_CACHE_KEY =
    'restaurant_dashboard_cache'

  const RESTAURANT_CACHE_KEY =
    'restaurant_current_cache'

  // =====================================================
  // RESTAURANT
  // =====================================================

  // const [restaurantId, setRestaurantId] =
    useState(() => {
      try {
        const cached =
          localStorage.getItem(
            RESTAURANT_CACHE_KEY
          )

        const restaurant = cached
          ? JSON.parse(cached)
          : null

        return restaurant?.id || null
      } catch {
        return null
      }
    })

  // =====================================================
  // DASHBOARD CACHE
  // =====================================================

  const [dashboard, setDashboard] =
    useState(() => {
      try {
        const cached =
          localStorage.getItem(
            DASHBOARD_CACHE_KEY
          )

        if (!cached) {
          return {
            totalMeals: 0,
            totalCategories: 0,
            totalOrders: 0,
            menuViews: 0,
            popularMeals: [],
            activities: [],
          }
        }

        return JSON.parse(cached)
      } catch {
        return {
          totalMeals: 0,
          totalCategories: 0,
          totalOrders: 0,
          menuViews: 0,
          popularMeals: [],
          activities: [],
        }
      }
    })

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] =
    useState(() => {
      try {
        return !localStorage.getItem(
          DASHBOARD_CACHE_KEY
        )
      } catch {
        return true
      }
    })

  const [error, setError] = useState('')

  // =====================================================
  // SAVE DASHBOARD CACHE
  // =====================================================

  const saveDashboardToCache = (
    data
  ) => {
    try {
      localStorage.setItem(
        DASHBOARD_CACHE_KEY,
        JSON.stringify(data)
      )
    } catch (err) {
      console.error(
        'Save dashboard cache error:',
        err
      )
    }
  }

  // =====================================================
  // SAVE RESTAURANT CACHE
  // =====================================================

  const saveRestaurantToCache = (
    restaurant
  ) => {
    try {
      localStorage.setItem(
        RESTAURANT_CACHE_KEY,
        JSON.stringify({
          id: restaurant?.id || null,
          slug:
            restaurant?.slug || null,
        })
      )
    } catch (err) {
      console.error(
        'Save restaurant cache error:',
        err
      )
    }
  }

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  const loadDashboardData =
    useCallback(async () => {
      setError('')

      try {
        // -------------------------------------------------
        // GET RESTAURANT
        // -------------------------------------------------

        const restaurantsResponse =
          await axiosClient.get(
            '/restaurants'
          )

        const restaurantsData =
          restaurantsResponse.data?.data ||
          restaurantsResponse.data ||
          []

        const restaurant =
          restaurantsData[0] || null

        if (!restaurant?.id) {
          setError(
            t.restaurantNotFound ||
              'Restaurant not found.'
          )

          return
        }

        const id = restaurant.id

        // setRestaurantId(id)

        saveRestaurantToCache(
          restaurant
        )

        // -------------------------------------------------
        // GET DATA
        // -------------------------------------------------

        const [
          categoriesResponse,
          mealsResponse,
          ordersResponse,
        ] = await Promise.all([
          axiosClient.get(
            `/restaurants/${id}/categories`
          ),

          axiosClient.get(
            `/restaurants/${id}/meals`
          ),

          axiosClient.get(
            `/restaurants/${id}/orders`
          ),
        ])

        const categories =
          categoriesResponse.data?.data ||
          categoriesResponse.data ||
          []

        const meals =
          mealsResponse.data?.data ||
          mealsResponse.data ||
          []

        const orders =
          ordersResponse.data?.data ||
          ordersResponse.data ||
          []

        const normalizedCategories =
          Array.isArray(categories)
            ? categories
            : []

        const normalizedMeals =
          Array.isArray(meals)
            ? meals
            : []

        const normalizedOrders =
          Array.isArray(orders)
            ? orders
            : []

        // -------------------------------------------------
        // POPULAR MEALS
        // -------------------------------------------------
        //
        // إذا الـAPI ما فيهش popularity،
        // نرتبو meals حسب عدد الطلبات.
        //

        const mealOrderCount = {}

        normalizedOrders.forEach(
          (order) => {
            const items =
              Array.isArray(
                order.items
              )
                ? order.items
                : []

            items.forEach((item) => {
              const mealId =
                item.meal_id ||
                item.meal?.id

              if (!mealId) return

              const quantity =
                Number(
                  item.quantity
                ) || 1

              mealOrderCount[
                mealId
              ] =
                (mealOrderCount[
                  mealId
                ] || 0) + quantity
            })
          }
        )

        const sortedMeals =
          [...normalizedMeals]
            .map((meal) => ({
              ...meal,
              orderCount:
                mealOrderCount[
                  meal.id
                ] || 0,
            }))
            .sort(
              (a, b) =>
                b.orderCount -
                a.orderCount
            )

        const topMeals =
          sortedMeals.slice(0, 4)

        const maxOrders =
          topMeals.length > 0
            ? Math.max(
                ...topMeals.map(
                  (meal) =>
                    meal.orderCount
                )
              )
            : 0

        const popularMeals =
          topMeals.map((meal) => ({
            name:
              meal.name ||
              'Unnamed meal',

            percent:
              maxOrders > 0
                ? Math.round(
                    (meal.orderCount /
                      maxOrders) *
                      100
                  )
                : 0,

            orderCount:
              meal.orderCount,
          }))

        // -------------------------------------------------
        // RECENT ACTIVITIES
        // -------------------------------------------------

        const recentOrders =
          [...normalizedOrders]
            .sort(
              (a, b) =>
                new Date(
                  b.created_at || 0
                ) -
                new Date(
                  a.created_at || 0
                )
            )
            .slice(0, 4)

        const activities =
          recentOrders.map(
            (order) => ({
              event:
                `${t.newOrderReceived || 'New order received'} #${order.id}`,

              time:
                formatRelativeTime(
                  order.created_at,
                  language
                ),
            })
          )

        // -------------------------------------------------
        // FINAL DATA
        // -------------------------------------------------

        const newDashboard = {
          totalMeals:
            normalizedMeals.length,

          totalCategories:
            normalizedCategories.length,

          totalOrders:
            normalizedOrders.length,

          /*
           * ما عندناش endpoint حقيقي ديال
           * menu views حاليا.
           *
           * نخليو القيمة الموجودة فالcache
           * باش ما تضيعش.
           */
          menuViews:
            Number(
              dashboard.menuViews
            ) || 0,

          popularMeals,

          activities,
        }

        // -------------------------------------------------
        // UPDATE STATE
        // -------------------------------------------------

        setDashboard(
          newDashboard
        )

        // -------------------------------------------------
        // UPDATE CACHE
        // -------------------------------------------------

        saveDashboardToCache(
          newDashboard
        )
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
         * cache/data القديمة تبقى ظاهرة.
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
    }, [
      dashboard.menuViews,
      language,
      t.loadDashboardError,
      t.newOrderReceived,
      t.restaurantNotFound,
    ])

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
      setLoading(true)

      /*
       * مهم:
       * ما نديروش setDashboard([])
 * ولا نمسحو cache.
       *
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
                              width: `${meal.percent}%`,
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
                        key={`${activity.event}-${index}`}
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

// =====================================================
// RELATIVE TIME
// =====================================================

const formatRelativeTime = (
  date,
  language
) => {
  if (!date) {
    return ''
  }

  const timestamp =
    new Date(date).getTime()

  if (Number.isNaN(timestamp)) {
    return ''
  }

  const diff =
    Date.now() - timestamp

  const minutes = Math.floor(
    diff / 60000
  )

  const hours = Math.floor(
    minutes / 60
  )

  const days = Math.floor(
    hours / 24
  )

  if (language === 'ar') {
    if (minutes < 1)
      return 'الآن'

    if (minutes < 60)
      return `منذ ${minutes} دقيقة`

    if (hours < 24)
      return `منذ ${hours} ساعة`

    return `منذ ${days} يوم`
  }

  if (language === 'fr') {
    if (minutes < 1)
      return "À l'instant"

    if (minutes < 60)
      return `Il y a ${minutes} min`

    if (hours < 24)
      return `Il y a ${hours} h`

    return `Il y a ${days} j`
  }

  if (minutes < 1)
    return 'Just now'

  if (minutes < 60)
    return `${minutes}m ago`

  if (hours < 24)
    return `${hours}h ago`

  return `${days}d ago`
}

export default DashboardPage
 
