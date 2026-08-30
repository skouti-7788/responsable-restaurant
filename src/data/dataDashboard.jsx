import axiosClient from '../api/axiosClient'

// =====================================================
// CACHE KEYS
// =====================================================

const DASHBOARD_CACHE_KEY =
  'restaurant_dashboard_cache'

const RESTAURANT_CACHE_KEY =
  'restaurant_current_cache'

// =====================================================
// INITIAL DASHBOARD
// =====================================================

const getEmptyDashboard = () => ({
  totalMeals: 0,
  totalCategories: 0,
  totalOrders: 0,
  menuViews: 0,
  popularMeals: [],
  activities: [],
})

// =====================================================
// GET DASHBOARD CACHE
// =====================================================

export const getDashboardCache = () => {
  try {
    const cached =
      localStorage.getItem(
        DASHBOARD_CACHE_KEY
      )

    if (!cached) {
      return getEmptyDashboard()
    }

    return {
      ...getEmptyDashboard(),
      ...JSON.parse(cached),
    }
  } catch (error) {
    console.error(
      'Get dashboard cache error:',
      error
    )

    return getEmptyDashboard()
  }
}

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
  } catch (error) {
    console.error(
      'Save dashboard cache error:',
      error
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
  } catch (error) {
    console.error(
      'Save restaurant cache error:',
      error
    )
  }
}

// =====================================================
// GET MENU VIEWS FROM CACHE
// =====================================================

const getCachedMenuViews = () => {
  try {
    const cached =
      localStorage.getItem(
        DASHBOARD_CACHE_KEY
      )

    if (!cached) {
      return 0
    }

    const dashboard =
      JSON.parse(cached)

    return (
      Number(
        dashboard?.menuViews
      ) || 0
    )
  } catch {
    return 0
  }
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

// =====================================================
// FETCH DASHBOARD DATA
// =====================================================

export const fetchDashboardData =
  async ({
    language = 'en',
    translations = {},
  } = {}) => {

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
      Array.isArray(
        restaurantsData
      )
        ? restaurantsData[0]
        : null

    if (!restaurant?.id) {
      throw new Error(
        translations.restaurantNotFound ||
          'Restaurant not found.'
      )
    }

    const id =
      restaurant.id

    saveRestaurantToCache(
      restaurant
    )

    // -------------------------------------------------
    // GET CATEGORIES / MEALS / ORDERS
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

    // -------------------------------------------------
    // NORMALIZE API DATA
    // -------------------------------------------------

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

          if (!mealId) {
            return
          }

          const quantity =
            Number(
              item.quantity
            ) || 1

          mealOrderCount[
            mealId
          ] =
            (
              mealOrderCount[
                mealId
              ] || 0
            ) + quantity
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
        id: meal.id,

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
          id: order.id,

          event:
            `${translations.newOrderReceived || 'New order received'} #${order.id}`,

          time:
            formatRelativeTime(
              order.created_at,
              language
            ),
        })
      )

    // -------------------------------------------------
    // MENU VIEWS
    // -------------------------------------------------

    const menuViews =
      getCachedMenuViews()

    // -------------------------------------------------
    // FINAL DASHBOARD
    // -------------------------------------------------

    const newDashboard = {
      totalMeals:
        normalizedMeals.length,

      totalCategories:
        normalizedCategories.length,

      totalOrders:
        normalizedOrders.length,

      menuViews,

      popularMeals,

      activities,
    }

    // -------------------------------------------------
    // SAVE CACHE
    // -------------------------------------------------

    saveDashboardToCache(
      newDashboard
    )

    return newDashboard
  }
 
