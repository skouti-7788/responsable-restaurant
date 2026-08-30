import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  useDispatch,
  useSelector,
} from 'react-redux'

import {
  RefreshCw,
} from 'lucide-react'

import {
  getRestaurants,
  getRestaurantOrders,
  getRestaurantMeals,
  getRestaurantTables,
  updateOrderStatus,
  deleteOrder,
} from '../../data/dataOrders'

import {
  fetchOrdersSuccess,
  // fetchOrdersFailure,
  updateOrder,
  removeOrder,
} from '../../store/orderSlice'

import translations from '../../i18n/translations'
import Button from '../../components/ui/Button'

import jsPDF from 'jspdf'
import AmiriRegular from '../../assets/fonts/Amiri-Regular'

import arabicReshaper from 'arabic-persian-reshaper'
import bidiFactory from 'bidi-js'

// =====================================================
// CACHE KEYS
// =====================================================

const ORDERS_CACHE_KEY =
  'restaurant_orders_cache'

const RESTAURANTS_CACHE_KEY =
  'restaurant_restaurants_cache'

const MEALS_CACHE_KEY =
  'restaurant_meals_cache'

const TABLES_CACHE_KEY =
  'restaurant_tables_cache'

// =====================================================
// STATUS CLASSES
// =====================================================

const statusClasses = {
  pending:
    'bg-amber-500/15 text-amber-600 dark:text-amber-300',

  preparing:
    'bg-sky-500/15 text-sky-600 dark:text-sky-300',

  ready:
    'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',

  completed:
    'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',

  cancelled:
    'bg-rose-500/15 text-rose-600 dark:text-rose-300',
}

// =====================================================
// STATUS TRANSLATIONS
// =====================================================

const statusTranslations = {
  ar: {
    pending: 'في الانتظار',
    preparing: 'قيد التحضير',
    ready: 'جاهز',
    completed: 'مكتمل',
    cancelled: 'ملغى',
  },

  fr: {
    pending: 'En attente',
    preparing: 'En préparation',
    ready: 'Prêt',
    completed: 'Terminé',
    cancelled: 'Annulé',
  },

  en: {
    pending: 'Pending',
    preparing: 'Preparing',
    ready: 'Ready',
    completed: 'Completed',
    cancelled: 'Cancelled',
  },
}

// =====================================================
// BIDI
// =====================================================

const bidi = bidiFactory()

// =====================================================
// CACHE READ
// =====================================================

const readCache = (
  key,
  fallback
) => {
  try {
    const cached =
      localStorage.getItem(key)

    if (!cached) {
      return fallback
    }

    const parsed =
      JSON.parse(cached)

    return parsed ?? fallback
  } catch (error) {
    console.error(
      `Cache read error: ${key}`,
      error
    )

    return fallback
  }
}

// =====================================================
// CACHE SAVE
// =====================================================

const saveCache = (
  key,
  data
) => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(data)
    )
  } catch (error) {
    console.error(
      `Cache save error: ${key}`,
      error
    )
  }
}

// =====================================================
// STATUS TRANSLATION
// =====================================================

const getStatusTranslation = (
  status,
  language,
  t
) => {
  if (
    t &&
    typeof t[status] === 'string' &&
    t[status].trim() !== ''
  ) {
    return t[status]
  }

  return (
    statusTranslations[language]?.[
      status
    ] ||
    statusTranslations.en[
      status
    ] ||
    status
  )
}

// =====================================================
// DRAW ARABIC
// =====================================================

const drawArabic = (
  doc,
  text,
  x,
  y,
  options = {}
) => {
  const value =
    String(text ?? '')

  if (!value) return

  try {
    const reshaped =
      arabicReshaper.reshape(
        value
      )

    const embedding =
      bidi.getEmbeddingLevels(
        reshaped
      )

    const reordered =
      bidi.getReorderedString(
        reshaped,
        embedding
      )

    doc.text(
      reordered,
      x,
      y,
      {
        align: 'right',
        ...options,
      }
    )
  } catch (error) {
    console.error(
      'Arabic PDF error:',
      error
    )

    doc.text(
      value,
      x,
      y,
      {
        align: 'right',
        ...options,
      }
    )
  }
}

// =====================================================
// DRAW NORMAL
// =====================================================

const drawText = (
  doc,
  text,
  x,
  y,
  options = {}
) => {
  doc.text(
    String(text ?? ''),
    x,
    y,
    options
  )
}

// =====================================================
// PDF LABEL
// =====================================================

const getPdfLabel = (
  translation,
  language,
  fallbacks
) => {
  if (
    translation &&
    typeof translation === 'string'
  ) {
    return translation
  }

  return (
    fallbacks[language] ||
    fallbacks.en ||
    ''
  )
}

// =====================================================
// ORDERS PAGE
// =====================================================

const OrdersPage = () => {
  const dispatch =
    useDispatch()

  // ===================================================
  // LANGUAGE
  // ===================================================

  const { language } =
    useSelector(
      (state) => state.ui
    )

  // ===================================================
  // ORDERS
  // ===================================================

  const orders =
    useSelector(
      (state) =>
        state.orders.items
    )

  // ===================================================
  // TRANSLATIONS
  // ===================================================

  const t =
    translations[language] ||
    translations.en ||
    {}

  // ===================================================
  // INITIAL CACHE
  // ===================================================

  const cachedOrders =
    readCache(
      ORDERS_CACHE_KEY,
      []
    )

  const cachedRestaurants =
    readCache(
      RESTAURANTS_CACHE_KEY,
      []
    )

  const cachedMeals =
    readCache(
      MEALS_CACHE_KEY,
      []
    )

  const cachedTables =
    readCache(
      TABLES_CACHE_KEY,
      []
    )

  // ===================================================
  // STATE
  // ===================================================

  const [
    restaurants,
    setRestaurants,
  ] = useState(
    cachedRestaurants
  )

  const [
    meals,
    setMeals,
  ] = useState(
    cachedMeals
  )

  const [
    tables,
    setTables,
  ] = useState(
    cachedTables
  )

  // ===================================================
  // PAGE LOADING
  // ===================================================

  const [
    loading,
    setLoading,
  ] = useState(
    cachedOrders.length === 0
  )

  // ===================================================
  // REFRESH LOADING
  // ===================================================

  const [
    refreshing,
    setRefreshing,
  ] = useState(false)

  // ===================================================
  // ERROR
  // ===================================================

  const [
    error,
    setError,
  ] = useState('')

  // =====================================================
  // LOAD RESTAURANT DATA
  // =====================================================

  const loadRestaurantData =
    useCallback(
      async (
        useCache = true
      ) => {
        try {
          // =============================================
          // CACHE
          // =============================================

          if (useCache) {
            const restaurantsCache =
              readCache(
                RESTAURANTS_CACHE_KEY,
                []
              )

            const mealsCache =
              readCache(
                MEALS_CACHE_KEY,
                []
              )

            const tablesCache =
              readCache(
                TABLES_CACHE_KEY,
                []
              )

            if (
              restaurantsCache.length
            ) {
              setRestaurants(
                restaurantsCache
              )
            }

            if (
              mealsCache.length
            ) {
              setMeals(
                mealsCache
              )
            }

            if (
              tablesCache.length
            ) {
              setTables(
                tablesCache
              )
            }
          }

          // =============================================
          // RESTAURANTS
          // =============================================

          const restaurantsData =
            await getRestaurants()

          setRestaurants(
            restaurantsData
          )

          saveCache(
            RESTAURANTS_CACHE_KEY,
            restaurantsData
          )

          const restaurant =
            restaurantsData[0]

          if (!restaurant?.id) {
            setMeals([])
            setTables([])

            saveCache(
              MEALS_CACHE_KEY,
              []
            )

            saveCache(
              TABLES_CACHE_KEY,
              []
            )

            return null
          }

          // =============================================
          // MEALS + TABLES
          // =============================================

          const [
            mealsData,
            tablesData,
          ] = await Promise.all([
            getRestaurantMeals(
              restaurant.id
            ),
            getRestaurantTables(
              restaurant.id
            ),
          ])

          setMeals(
            mealsData
          )

          setTables(
            tablesData
          )

          saveCache(
            MEALS_CACHE_KEY,
            mealsData
          )

          saveCache(
            TABLES_CACHE_KEY,
            tablesData
          )

          return restaurant
        } catch (err) {
          console.error(
            'Restaurant data error:',
            err
          )

          throw err
        }
      },
      []
    )

  // =====================================================
  // CHECK ORDERS
  // =====================================================

  const checkOrders =
    useCallback(
      async (
        showPageLoading = false
      ) => {
        if (
          showPageLoading
        ) {
          setLoading(true)
        }

        try {
          const restaurant =
            await loadRestaurantData(
              true
            )

          if (!restaurant?.id) {
            dispatch(
              fetchOrdersSuccess(
                []
              )
            )

            saveCache(
              ORDERS_CACHE_KEY,
              []
            )

            return
          }

          const freshOrders =
            await getRestaurantOrders(
              restaurant.id
            )

          // =============================================
          // UPDATE REDUX
          // =============================================

          dispatch(
            fetchOrdersSuccess(
              freshOrders
            )
          )

          // =============================================
          // UPDATE CACHE
          // =============================================

          saveCache(
            ORDERS_CACHE_KEY,
            freshOrders
          )

          setError('')
        } catch (err) {
          console.error(
            'Orders check error:',
            err
          )

          const oldOrders =
            readCache(
              ORDERS_CACHE_KEY,
              []
            )

          if (
            oldOrders.length
          ) {
            dispatch(
              fetchOrdersSuccess(
                oldOrders
              )
            )
          } else {
            setError(
              err?.response
                ?.data?.message ||
              err?.message ||
              'Unable to load orders'
            )
          }
        } finally {
          if (
            showPageLoading
          ) {
            setLoading(false)
          }
        }
      },
      [
        dispatch,
        loadRestaurantData,
      ]
    )

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    let cancelled = false

    const initialize =
      async () => {
        // ===============================================
        // SHOW CACHE IMMEDIATELY
        // ===============================================

        const ordersCache =
          readCache(
            ORDERS_CACHE_KEY,
            []
          )

        if (
          ordersCache.length
        ) {
          dispatch(
            fetchOrdersSuccess(
              ordersCache
            )
          )

          setLoading(false)
        }

        if (cancelled) {
          return
        }

        // ===============================================
        // BACKGROUND CHECK
        // ===============================================

        await checkOrders(
          ordersCache.length === 0
        )
      }

    initialize()

    return () => {
      cancelled = true
    }
  }, [
    dispatch,
    checkOrders,
  ])

  // =====================================================
  // REFRESH BUTTON
  // =====================================================

  const handleRefresh =
    async () => {
      if (refreshing) {
        return
      }

      setRefreshing(true)
      setError('')

      try {
        await checkOrders(
          false
        )
      } finally {
        setRefreshing(false)
      }
    }

  // =====================================================
  // GET TABLE NUMBER
  // =====================================================

  const getTableNumber = (
    tableId
  ) => {
    if (!tableId) {
      return null
    }

    const table =
      tables.find(
        (item) =>
          Number(item.id) ===
          Number(tableId)
      )

    return (
      table?.number ??
      null
    )
  }

  // =====================================================
  // CHANGE STATUS
  // =====================================================

  const changeStatus =
    async (
      order,
      status
    ) => {
      try {
        const updatedOrder =
          await updateOrderStatus(
            order.id,
            status
          )

        dispatch(
          updateOrder(
            updatedOrder
          )
        )

        const currentOrders =
          readCache(
            ORDERS_CACHE_KEY,
            []
          )

        const updatedOrders =
          currentOrders.map(
            (item) =>
              Number(item.id) ===
              Number(order.id)
                ? updatedOrder
                : item
          )

        saveCache(
          ORDERS_CACHE_KEY,
          updatedOrders
        )
      } catch (err) {
        console.error(
          'Status update error:',
          err
        )

        setError(
          err?.response
            ?.data?.message ||
          err?.message ||
          'Unable to update order status'
        )
      }
    }

  // =====================================================
  // DELETE ORDER
  // =====================================================

  const handleDeleteOrder =
    async (
      order
    ) => {
      try {
        await deleteOrder(
          order.id
        )

        dispatch(
          removeOrder(
            order.id
          )
        )

        const currentOrders =
          readCache(
            ORDERS_CACHE_KEY,
            []
          )

        const updatedOrders =
          currentOrders.filter(
            (item) =>
              Number(item.id) !==
              Number(order.id)
          )

        saveCache(
          ORDERS_CACHE_KEY,
          updatedOrders
        )
      } catch (err) {
        console.error(
          'Delete order error:',
          err
        )

        setError(
          err?.response
            ?.data?.message ||
          err?.message ||
          'Unable to delete order'
        )
      }
    }

  // =====================================================
  // DOWNLOAD INVOICE
  // =====================================================

  const handleDownloadInvoice =
    (order) => {
      const doc =
        new jsPDF({
          orientation:
            'portrait',
          unit: 'mm',
          format: 'a4',
        })

      doc.addFileToVFS(
        'Amiri-Regular.ttf',
        AmiriRegular
      )

      doc.addFont(
        'Amiri-Regular.ttf',
        'Amiri',
        'normal'
      )

      doc.setFont(
        'Amiri',
        'normal'
      )

      const restaurantName =
        restaurants[0]?.name ||
        'Restaurant'

      const customerName =
        order.customer_name ||
        order.customerName ||
        '-'

      const tableNumber =
        getTableNumber(
          order.table_id
        )

      const tableDisplay =
        tableNumber !== null
          ? `${tableNumber}`
          : '---'

      const locale =
        language === 'fr'
          ? 'fr-FR'
          : language === 'en'
            ? 'en-US'
            : 'ar-MA'

      const orderDate =
        order.created_at
          ? new Date(
              order.created_at
            ).toLocaleString(
              locale
            )
          : new Date().toLocaleString(
              locale
            )

      const orderItems =
        order.items || []

      const orderTotal =
        Number(
          order.total || 0
        )

      const invoiceLabel =
        getPdfLabel(
          t.invoice,
          language,
          {
            ar: 'الفاتورة',
            fr: 'Facture',
            en: 'Invoice',
          }
        )

      const orderNumberLabel =
        getPdfLabel(
          t.orderNumber,
          language,
          {
            ar: 'رقم الطلب',
            fr: 'Numéro de commande',
            en: 'Order number',
          }
        )

      const customerLabel =
        getPdfLabel(
          t.customer ||
            t.customerName,
          language,
          {
            ar: 'العميل',
            fr: 'Client',
            en: 'Customer',
          }
        )

      const tableLabel =
        getPdfLabel(
          t.table,
          language,
          {
            ar: 'الطاولة',
            fr: 'Table',
            en: 'Table',
          }
        )

      const dateLabel =
        getPdfLabel(
          t.date,
          language,
          {
            ar: 'التاريخ',
            fr: 'Date',
            en: 'Date',
          }
        )

      const itemsLabel =
        getPdfLabel(
          t.items,
          language,
          {
            ar: 'العناصر',
            fr: 'Articles',
            en: 'Items',
          }
        )

      const quantityLabel =
        getPdfLabel(
          t.quantity,
          language,
          {
            ar: 'الكمية',
            fr: 'Quantité',
            en: 'Quantity',
          }
        )

      const unitPriceLabel =
        getPdfLabel(
          t.unitPrice,
          language,
          {
            ar: 'سعر الوحدة',
            fr: 'Prix unitaire',
            en: 'Unit price',
          }
        )

      const totalLabel =
        getPdfLabel(
          t.total,
          language,
          {
            ar: 'المجموع',
            fr: 'Total',
            en: 'Total',
          }
        )

      const isArabic =
        language === 'ar'

      let y = 20

      doc.setFontSize(22)

      if (isArabic) {
        drawArabic(
          doc,
          invoiceLabel,
          105,
          y,
          {
            align: 'center',
          }
        )
      } else {
        drawText(
          doc,
          invoiceLabel,
          105,
          y,
          {
            align: 'center',
          }
        )
      }

      y += 16

      doc.setFontSize(16)

      drawText(
        doc,
        restaurantName,
        20,
        y
      )

      y += 12

      doc.setFontSize(11)

      if (isArabic) {
        drawArabic(
          doc,
          orderNumberLabel,
          190,
          y
        )

        drawText(
          doc,
          `#${order.id}`,
          145,
          y
        )

        y += 8

        drawArabic(
          doc,
          customerLabel,
          190,
          y
        )

        drawText(
          doc,
          customerName,
          145,
          y
        )

        y += 8

        drawArabic(
          doc,
          tableLabel,
          190,
          y
        )

        drawText(
          doc,
          tableDisplay,
          145,
          y
        )

        y += 8

        drawArabic(
          doc,
          dateLabel,
          190,
          y
        )

        drawText(
          doc,
          orderDate,
          145,
          y
        )
      } else {
        drawText(
          doc,
          `${orderNumberLabel} #${order.id}`,
          20,
          y
        )

        y += 8

        drawText(
          doc,
          `${customerLabel} ${customerName}`,
          20,
          y
        )

        y += 8

        drawText(
          doc,
          `${tableLabel} ${tableDisplay}`,
          20,
          y
        )

        y += 8

        drawText(
          doc,
          `${dateLabel} ${orderDate}`,
          20,
          y
        )
      }

      y += 15

      doc.line(
        20,
        y,
        190,
        y
      )

      y += 10

      doc.setFontSize(10)

      if (isArabic) {
        drawArabic(
          doc,
          itemsLabel,
          190,
          y
        )

        drawArabic(
          doc,
          quantityLabel,
          135,
          y
        )

        drawArabic(
          doc,
          unitPriceLabel,
          100,
          y
        )

        drawArabic(
          doc,
          totalLabel,
          60,
          y
        )
      } else {
        drawText(
          doc,
          itemsLabel,
          20,
          y
        )

        drawText(
          doc,
          quantityLabel,
          95,
          y
        )

        drawText(
          doc,
          unitPriceLabel,
          125,
          y
        )

        drawText(
          doc,
          totalLabel,
          165,
          y
        )
      }

      y += 9

      orderItems.forEach(
        (orderItem) => {
          const meal =
            meals.find(
              (item) =>
                Number(item.id) ===
                Number(
                  orderItem.meal_id
                )
            )

          const name =
            orderItem.name ||
            orderItem.meal?.name ||
            meal?.name ||
            `Meal ${
              orderItem.meal_id || ''
            }`

          const quantity =
            Number(
              orderItem.quantity || 1
            )

          const unitPrice =
            Number(
              orderItem.unit_price ??
              orderItem.price ??
              meal?.price ??
              0
            )

          const totalPrice =
            Number(
              orderItem.total_price ??
              unitPrice *
                quantity
            )

          if (isArabic) {
            drawArabic(
              doc,
              String(
                name
              ).substring(
                0,
                30
              ),
              190,
              y
            )

            drawText(
              doc,
              String(
                quantity
              ),
              135,
              y
            )

            drawText(
              doc,
              `$${unitPrice.toFixed(
                2
              )}`,
              100,
              y
            )

            drawText(
              doc,
              `$${totalPrice.toFixed(
                2
              )}`,
              60,
              y
            )
          } else {
            drawText(
              doc,
              String(
                name
              ).substring(
                0,
                30
              ),
              20,
              y
            )

            drawText(
              doc,
              String(
                quantity
              ),
              95,
              y
            )

            drawText(
              doc,
              `$${unitPrice.toFixed(
                2
              )}`,
              125,
              y
            )

            drawText(
              doc,
              `$${totalPrice.toFixed(
                2
              )}`,
              165,
              y
            )
          }

          y += 9

          if (y > 270) {
            doc.addPage()

            doc.setFont(
              'Amiri',
              'normal'
            )

            y = 20
          }
        }
      )

      y += 5

      doc.line(
        20,
        y,
        190,
        y
      )

      y += 13

      doc.setFontSize(14)

      if (isArabic) {
        drawArabic(
          doc,
          totalLabel,
          150,
          y
        )

        drawText(
          doc,
          `$${orderTotal.toFixed(
            2
          )}`,
          190,
          y,
          {
            align: 'right',
          }
        )
      } else {
        drawText(
          doc,
          totalLabel,
          145,
          y
        )

        drawText(
          doc,
          `$${orderTotal.toFixed(
            2
          )}`,
          190,
          y,
          {
            align: 'right',
          }
        )
      }

      doc.save(
        `invoice-order-${order.id}.pdf`
      )
    }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="text-slate-900 dark:text-slate-100">

      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {t.orders ||
              'Orders'}
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t.ordersDescription ||
              'Manage your restaurant orders.'}
          </p>
        </div>

        {/* REFRESH */}

        <button
          type="button"
          onClick={
            handleRefresh
          }
          disabled={
            refreshing
          }
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <RefreshCw
            size={17}
            className={
              refreshing
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

      {/* ERROR */}

      {error && (
        <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
          {error}
        </div>
      )}

      {/* FIRST LOAD ONLY */}

      {loading ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-card dark:border-slate-800 dark:bg-slate-900">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" />

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {t.loading ||
              'Loading...'}
          </p>

        </div>
      ) : (

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {orders.length === 0 ? (

            <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-card dark:border-slate-800 dark:bg-slate-900 md:col-span-2">

              <p className="text-slate-500 dark:text-slate-400">
                {t.noOrdersAvailable ||
                  'No orders available'}
              </p>

            </div>

          ) : (

            orders.map(
              (order) => {

                const translatedStatus =
                  getStatusTranslation(
                    order.status,
                    language,
                    t
                  )

                const tableNumber =
                  getTableNumber(
                    order.table_id
                  )

                const tableDisplay =
                  tableNumber !== null
                    ? `${tableNumber}`
                    : '---'

                return (
                  <div
                    key={
                      order.id
                    }
                    className="flex flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card transition-colors dark:border-slate-800 dark:bg-slate-900"
                  >

                    {/* ORDER HEADER */}

                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">

                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {t.orderNumber ||
                            'Order'}{' '}
                          #{order.id}
                        </p>

                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                          {t.customerName ||
                            'Customer'}
                        </p>

                        <h2 className="mt-1 truncate text-xl font-semibold text-slate-900 dark:text-slate-100">
                          {order.customer_name ||
                            order.customerName ||
                            '-'}
                        </h2>

                      </div>

                      <span
                        className={`shrink-0 rounded-2xl px-3 py-2 text-xs font-semibold ${
                          statusClasses[
                            order.status
                          ] ||
                          ''
                        }`}
                      >
                        {
                          translatedStatus
                        }
                      </span>

                    </div>

                    {/* TABLE */}

                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/60">

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t.table ||
                          'Table'}
                      </p>

                      <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {
                          tableDisplay
                        }
                      </p>

                    </div>

                    {/* ITEMS + TOTAL */}

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">

                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {t.items ||
                            'Items'}
                        </p>

                        <ul className="mt-3 space-y-2 text-slate-700 dark:text-slate-200">

                          {(
                            order.items ||
                            []
                          ).map(
                            (
                              orderItem,
                              index
                            ) => {

                              const meal =
                                meals.find(
                                  (
                                    item
                                  ) =>
                                    Number(
                                      item.id
                                    ) ===
                                    Number(
                                      orderItem.meal_id
                                    )
                                )

                              const name =
                                orderItem.name ||
                                orderItem.meal?.name ||
                                meal?.name ||
                                `Meal ${
                                  orderItem.meal_id ||
                                  ''
                                }`

                              const quantity =
                                Number(
                                  orderItem.quantity ||
                                    1
                                )

                              return (
                                <li
                                  key={`${orderItem.meal_id || name || index}`}
                                  className="rounded-2xl bg-white px-3 py-2 shadow-sm dark:bg-slate-950/70"
                                >
                                  {
                                    name
                                  }

                                  {quantity
                                    ? ` × ${quantity}`
                                    : ''}
                                </li>
                              )
                            }
                          )}

                        </ul>

                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {t.totalPrice ||
                            'Total'}
                        </p>

                        <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                          $
                          {Number(
                            order.total ||
                              0
                          ).toFixed(
                            2
                          )}
                        </p>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="mt-6 flex flex-wrap gap-3">

                      {/* ACCEPT */}

                      <Button
                        onClick={() =>
                          changeStatus(
                            order,
                            'preparing'
                          )
                        }
                      >
                        {t.accept ||
                          'Accept'}
                      </Button>

                      {/* CANCEL */}

                      <Button
                        variant="danger"
                        onClick={() =>
                          changeStatus(
                            order,
                            'cancelled'
                          )
                        }
                      >
                        {t.cancel ||
                          'Cancel'}
                      </Button>

                      {/* INVOICE */}

                      {order.status ===
                        'preparing' && (

                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleDownloadInvoice(
                              order
                            )
                          }
                        >
                          {t.downloadInvoice ||
                            'Invoice'}
                        </Button>

                      )}

                      {/* DELETE */}

                      <Button
                        variant="ghost"
                        onClick={() =>
                          handleDeleteOrder(
                            order
                          )
                        }
                      >
                        {t.deleteCategory ||
                          'Delete'}
                      </Button>

                    </div>

                  </div>
                )
              }
            )
          )}

        </div>
      )}

    </div>
  )
}

export default OrdersPage
 
