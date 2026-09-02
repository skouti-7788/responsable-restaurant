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
  Search,
  X,
  // Eye,
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

  // completed:
  //   'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',

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
    statusTranslations[language]?.[status] ||
    statusTranslations.en[status] ||
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

  if (!value) {
    return
  }

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
  // REFRESHING
  // ===================================================

  const [
    refreshing,
    setRefreshing,
  ] = useState(false)


  // ===================================================
  // ACTION LOADING
  // ===================================================

  const [
    actionLoading,
    setActionLoading,
  ] = useState(null)


  // ===================================================
  // DELETE ALL LOADING
  // ===================================================

  const [
    deletingAll,
    setDeletingAll,
  ] = useState(false)


  // ===================================================
  // ERROR
  // ===================================================

  const [
    error,
    setError,
  ] = useState('')


  // ===================================================
  // SEARCH
  // ===================================================

  const [
    searchTerm,
    setSearchTerm,
  ] = useState('')


  // ===================================================
  // STATUS FILTER
  // ===================================================

  const [
    statusFilter,
    setStatusFilter,
  ] = useState('all')


  // ===================================================
  // SELECTED ORDER
  // ===================================================

  const [
    selectedOrder,
    setSelectedOrder,
  ] = useState(null)


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
          // USE CACHE FIRST
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
          // GET RESTAURANTS
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


          // =============================================
          // NO RESTAURANT
          // =============================================

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
          // GET MEALS + TABLES
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
  // CHECK ORDERS / REFRESH
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

          // =============================================
          // LOAD RESTAURANT
          // =============================================

          const restaurant =
            await loadRestaurantData(
              true
            )


          // =============================================
          // NO RESTAURANT
          // =============================================

          if (!restaurant?.id) {
            dispatch(
              fetchOrdersSuccess([])
            )

            saveCache(
              ORDERS_CACHE_KEY,
              []
            )

            return
          }


          // =============================================
          // GET FRESH ORDERS
          // =============================================

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


          // =============================================
          // KEEP OLD CACHE
          // =============================================

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
        // AUTO REFRESH
        // ===============================================

        setRefreshing(true)

        try {
          await checkOrders(
            false
          )
        } finally {
          if (!cancelled) {
            setRefreshing(false)
          }
        }
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

      if (
        refreshing ||
        deletingAll
      ) {
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
  // FILTER ORDERS
  // SEARCH + STATUS
  // =====================================================

  const normalizedSearch =
    searchTerm
      .trim()
      .toLowerCase()


  const filteredOrders =
    orders.filter(
      (order) => {

        // =============================================
        // STATUS MATCH
        // =============================================

        const matchesStatus =
          statusFilter === 'all' ||
          order.status ===
            statusFilter


        if (!matchesStatus) {
          return false
        }


        // =============================================
        // SEARCH
        // =============================================

        if (!normalizedSearch) {
          return true
        }


        const orderId =
          String(
            order.id ?? ''
          ).toLowerCase()


        const customerName =
          String(
            order.customer_name ||
            order.customerName ||
            ''
          ).toLowerCase()


        const tableNumber =
          String(
            getTableNumber(
              order.table_id
            ) ?? ''
          ).toLowerCase()


        const mealNames =
          (
            order.items || []
          )
            .map(
              (orderItem) => {

                const meal =
                  meals.find(
                    (item) =>
                      Number(
                        item.id
                      ) ===
                      Number(
                        orderItem.meal_id
                      )
                  )

                return (
                  orderItem.name ||
                  orderItem.meal?.name ||
                  meal?.name ||
                  ''
                )
              }
            )
            .join(' ')
            .toLowerCase()


        return (
          orderId.includes(
            normalizedSearch
          ) ||

          customerName.includes(
            normalizedSearch
          ) ||

          tableNumber.includes(
            normalizedSearch
          ) ||

          mealNames.includes(
            normalizedSearch
          )
        )
      }
    )


  // =====================================================
  // STATISTICS
  // =====================================================

  const totalOrders =
    orders.length

  const pendingOrders =
    orders.filter(
      (order) =>
        order.status ===
        'pending'
    ).length

  const preparingOrders =
    orders.filter(
      (order) =>
        order.status ===
        'preparing'
    ).length

  const completedOrders =
    orders.filter(
      (order) =>
        order.status ===
        'completed'
    ).length


  // =====================================================
  // STATISTICS LABELS
  // =====================================================

  const statisticsLabels = {
    total:
      language === 'ar'
        ? 'مجموع الطلبات'
        : language === 'fr'
          ? 'Total des commandes'
          : 'Total Orders',

    pending:
      language === 'ar'
        ? 'في الانتظار'
        : language === 'fr'
          ? 'En attente'
          : 'Pending',

    preparing:
      language === 'ar'
        ? 'قيد التحضير'
        : language === 'fr'
          ? 'En préparation'
          : 'Preparing',

    completed:
      language === 'ar'
        ? 'مكتملة'
        : language === 'fr'
          ? 'Terminées'
          : 'Completed',
  }


  // =====================================================
  // CHANGE STATUS
  // =====================================================

  const changeStatus =
    async (
      order,
      status
    ) => {

      const actionKey =
        `${order.id}-${status}`

      try {

        setActionLoading(
          actionKey
        )

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


        // =============================================
        // UPDATE CACHE
        // =============================================

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


        // =============================================
        // UPDATE SELECTED ORDER
        // =============================================

        if (
          selectedOrder &&
          Number(
            selectedOrder.id
          ) ===
            Number(order.id)
        ) {
          setSelectedOrder(
            updatedOrder
          )
        }

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

      } finally {
        setActionLoading(null)
      }
    }


  // =====================================================
  // DELETE ORDER
  // =====================================================

  const handleDeleteOrder =
    async (
      order
    ) => {

      const actionKey =
        `${order.id}-delete`

      try {

        setActionLoading(
          actionKey
        )

        await deleteOrder(
          order.id
        )

        dispatch(
          removeOrder(
            order.id
          )
        )


        // =============================================
        // UPDATE CACHE
        // =============================================

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


        // =============================================
        // CLOSE MODAL
        // =============================================

        if (
          selectedOrder &&
          Number(
            selectedOrder.id
          ) ===
            Number(order.id)
        ) {
          setSelectedOrder(null)
        }

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

      } finally {
        setActionLoading(null)
      }
    }


  // =====================================================
  // DELETE ALL ORDERS
  // =====================================================

  const handleDeleteAllOrders =
    async () => {

      if (
        deletingAll ||
        refreshing
      ) {
        return
      }

      if (
        orders.length === 0
      ) {
        return
      }


      const confirmed =
        window.confirm(
          language === 'ar'
            ? 'هل أنت متأكد من حذف جميع الطلبات؟'
            : language === 'fr'
              ? 'Êtes-vous sûr de vouloir supprimer toutes les commandes ?'
              : 'Are you sure you want to delete all orders?'
        )


      if (!confirmed) {
        return
      }


      try {

        setDeletingAll(true)
        setError('')


        // =============================================
        // DELETE ALL FROM BACKEND
        // =============================================

        await Promise.all(
          orders.map(
            (order) =>
              deleteOrder(
                order.id
              )
          )
        )


        // =============================================
        // CLEAR REDUX
        // =============================================

        dispatch(
          fetchOrdersSuccess([])
        )


        // =============================================
        // CLEAR CACHE
        // =============================================

        saveCache(
          ORDERS_CACHE_KEY,
          []
        )


        // =============================================
        // CLOSE MODAL
        // =============================================

        setSelectedOrder(null)

      } catch (err) {

        console.error(
          'Delete all orders error:',
          err
        )

        setError(
          err?.response
            ?.data?.message ||
          err?.message ||
          'Unable to delete all orders'
        )


        // =============================================
        // REFRESH AFTER PARTIAL FAILURE
        // =============================================

        try {
          await checkOrders(
            false
          )
        } catch (
          refreshError
        ) {
          console.error(
            'Refresh after delete all error:',
            refreshError
          )
        }

      } finally {
        setDeletingAll(false)
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
              String(name).substring(
                0,
                30
              ),
              190,
              y
            )

            drawText(
              doc,
              String(quantity),
              135,
              y
            )

            drawText(
              doc,
              `$${unitPrice.toFixed(2)}`,
              100,
              y
            )

            drawText(
              doc,
              `$${totalPrice.toFixed(2)}`,
              60,
              y
            )

          } else {

            drawText(
              doc,
              String(name).substring(
                0,
                30
              ),
              20,
              y
            )

            drawText(
              doc,
              String(quantity),
              95,
              y
            )

            drawText(
              doc,
              `$${unitPrice.toFixed(2)}`,
              125,
              y
            )

            drawText(
              doc,
              `$${totalPrice.toFixed(2)}`,
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
          `$${orderTotal.toFixed(2)}`,
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
          `$${orderTotal.toFixed(2)}`,
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
  // ORDER ITEM NAME
  // =====================================================

  const getOrderItemName =
    (orderItem) => {

      const meal =
        meals.find(
          (item) =>
            Number(item.id) ===
            Number(
              orderItem.meal_id
            )
        )

      return (
        orderItem.name ||
        orderItem.meal?.name ||
        meal?.name ||
        `Meal ${
          orderItem.meal_id || ''
        }`
      )
    }


  // =====================================================
  // ORDER DATE
  // =====================================================

  const formatOrderDate =
    (date) => {

      if (!date) {
        return '-'
      }

      const locale =
        language === 'fr'
          ? 'fr-FR'
          : language === 'en'
            ? 'en-US'
            : 'ar-MA'

      try {
        return new Date(
          date
        ).toLocaleString(
          locale
        )
      } catch {
        return '-'
      }
    }


  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="text-slate-900 dark:text-slate-100">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

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


        {/* =================================================
            HEADER BUTTONS
        ================================================= */}

        <div className="flex flex-wrap items-center gap-3">

          {/* =================================================
              STATUS FILTER
          ================================================= */}

          <div className="relative">

            <select
              value={
                statusFilter
              }
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="h-11 min-w-[180px] appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-500"
            >

              <option value="all">
                {language === 'ar'
                  ? 'كل الحالات'
                  : language === 'fr'
                    ? 'Tous les statuts'
                    : 'All statuses'}
              </option>

              <option value="pending">
                {language === 'ar'
                  ? 'في الانتظار'
                  : language === 'fr'
                    ? 'En attente'
                    : 'Pending'}
              </option>

              <option value="preparing">
                {language === 'ar'
                  ? 'قيد التحضير'
                  : language === 'fr'
                    ? 'En préparation'
                    : 'Preparing'}
              </option>

              {/* <option value="ready">
                {language === 'ar'
                  ? 'جاهز'
                  : language === 'fr'
                    ? 'Prêt'
                    : 'Ready'}
              </option> */}

              {/* <option value="completed">
                {language === 'ar'
                  ? 'مكتمل'
                  : language === 'fr'
                    ? 'Terminé'
                    : 'Completed'}
              </option> */}

              <option value="cancelled">
                {language === 'ar'
                  ? 'ملغى'
                  : language === 'fr'
                    ? 'Annulé'
                    : 'Cancelled'}
              </option>

            </select>


            {/* <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">

              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="currentColor"
              >

                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01.02 1.06l-4.25 4.5a.75.75 0 01-1.08-1.04l3.71-3.938L5.23 8.27a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />

              </svg>

            </div> */}

          </div>


          {/* =================================================
              REFRESH
          ================================================= */}

          <button
            type="button"
            onClick={
              handleRefresh
            }
            disabled={
              refreshing ||
              deletingAll
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

            <span>
              {t.refresh ||
                'Refresh'}
            </span>

          </button>


          {/* =================================================
              DELETE ALL
          ================================================= */}

          <button
            type="button"
            onClick={
              handleDeleteAllOrders
            }
            disabled={
              deletingAll ||
              refreshing
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 text-sm font-medium text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-950/50"
          >

            {deletingAll
              ? language === 'ar'
                ? 'جاري حذف الكل...'
                : language === 'fr'
                  ? 'Suppression...'
                  : 'Deleting all...'
              : language === 'ar'
                ? 'حذف الكل'
                : language === 'fr'
                  ? 'Supprimer tout'
                  : 'Delete all'}

          </button>

        </div>

      </div>


      {/* =================================================
          STATISTICS CARDS
      ================================================= */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL */}

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">

          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {statisticsLabels.total}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {totalOrders}
          </p>

        </div>


        {/* PENDING */}

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">

          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {statisticsLabels.pending}
          </p>

          <p className="mt-2 text-3xl font-bold  text-slate-900">
            {pendingOrders}
          </p>

        </div>


        {/* PREPARING */}

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">

          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {statisticsLabels.preparing}
          </p>

          <p className="mt-2 text-3xl font-bold  text-slate-900">
            {preparingOrders}
          </p>

        </div>


        {/* COMPLETED */}

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">

          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {statisticsLabels.completed}
          </p>

          <p className="mt-2 text-3xl font-bold  text-slate-900">
            {completedOrders}
          </p>

        </div>

      </div>


      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="mb-6">

        <div className="relative">

          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={
              searchTerm
            }
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            placeholder={
              language === 'ar'
                ? 'ابحث برقم الطلب، العميل، الطاولة أو الوجبة...'
                : language === 'fr'
                  ? 'Rechercher par commande, client, table ou article...'
                  : 'Search by order, customer, table or meal...'
            }
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-slate-500"
          />


          {searchTerm && (

            <button
              type="button"
              onClick={() =>
                setSearchTerm('')
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >

              <X size={17} />

            </button>

          )}

        </div>

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
          RESULT COUNT
      ================================================= */}

      {orders.length > 0 && (

        <div className="mb-4 flex items-center justify-between">

          <p className="text-sm text-slate-500 dark:text-slate-400">

            {language === 'ar'
              ? `${filteredOrders.length} طلب`
              : language === 'fr'
                ? `${filteredOrders.length} commande${filteredOrders.length !== 1 ? 's' : ''}`
                : `${filteredOrders.length} order${filteredOrders.length !== 1 ? 's' : ''}`}

          </p>

        </div>

      )}


      {/* =================================================
          ORDERS
      ================================================= */}

      <div className="space-y-5">

        {/* =================================================
            NO ORDERS
        ================================================= */}

        {filteredOrders.length === 0 ? (

          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-card dark:border-slate-800 dark:bg-slate-900">

            <p className="text-slate-500 dark:text-slate-400">

              {loading ? (

                language === 'ar'
                  ? 'جاري تحميل الطلبات...'
                  : language === 'fr'
                    ? 'Chargement des commandes...'
                    : 'Loading orders...'

              ) : orders.length > 0 ? (

                searchTerm.trim() ? (

                  language === 'ar'
                    ? 'لا توجد طلبات تطابق البحث'
                    : language === 'fr'
                      ? 'Aucune commande ne correspond à votre recherche'
                      : 'No orders match your search'

                ) : (

                  language === 'ar'
                    ? 'لا توجد طلبات بهذه الحالة'
                    : language === 'fr'
                      ? 'Aucune commande avec ce statut'
                      : 'No orders with this status'

                )

              ) : (

                t.noOrdersAvailable ||
                'No orders available'

              )}

            </p>

          </div>

        ) : (

          filteredOrders.map(
            (order) => {

              const translatedStatus =
                getStatusTranslation(
                  order.status,
                  language,
                  t
                )


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


              const acceptKey =
                `${order.id}-preparing`

              const cancelKey =
                `${order.id}-cancelled`

              const deleteKey =
                `${order.id}-delete`


              const isAccepting =
                actionLoading ===
                acceptKey

              const isCancelling =
                actionLoading ===
                cancelKey

              const isDeleting =
                actionLoading ===
                deleteKey


              return (

                <div
                  key={order.id}
                  className="w-full max-w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-card transition-colors dark:border-slate-800 dark:bg-slate-900"
                >

                  <div className="w-full max-w-full">

                    {/* =================================
                        ORDER TOP
                    ================================= */}

                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">

                      <div>

                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">

                          {t.orderNumber ||
                            'Order'}{' '}

                          #{order.id}

                        </p>

                      </div>

                    </div>


                    {/* =================================
                        HORIZONTAL ORDER DATA
                    ================================= */}

                    <div className="flex items-stretch">

                      {/* =================================
                          CUSTOMER
                      ================================= */}

                      <div className="min-w-[190px] flex-1 px-6 py-5">

                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">

                          {t.customerName ||
                            'Customer'}

                        </p>

                        <h3 className="mt-2 truncate text-lg font-semibold text-slate-900 dark:text-slate-100">

                          {customerName}

                        </h3>

                      </div>


                      {/* =================================
                          TABLE
                      ================================= */}

                      <div className="min-w-[130px] border-l border-slate-200 px-6 py-5 dark:border-slate-800">

                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">

                          {t.table ||
                            'Table'}

                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">

                          {tableDisplay}

                        </p>

                      </div>


                      {/* =================================
                          ITEMS
                      ================================= */}

                      <div className="min-w-[300px] flex-[1.5] border-l border-slate-200 px-6 py-5 dark:border-slate-800">

                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">

                          {t.items ||
                            'Items'}

                        </p>

                        <div className="mt-2 flex max-w-[400px] flex-wrap gap-2">

                          {(order.items || []).map(
                            (
                              orderItem,
                              index
                            ) => {

                              const name =
                                getOrderItemName(
                                  orderItem
                                )


                              const quantity =
                                Number(
                                  orderItem.quantity ||
                                  1
                                )


                              return (

                                <div
                                  key={`${order.id}-${orderItem.meal_id || name || index}`}
                                  className="rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-950/70"
                                >

                                  <span className="text-sm text-slate-700 dark:text-slate-200">

                                    {name}

                                  </span>

                                  <span className="ml-2 text-sm font-semibold text-slate-500 dark:text-slate-400">

                                    ×{' '}

                                    {quantity}

                                  </span>

                                </div>

                              )
                            }
                          )}

                        </div>

                      </div>


                      {/* =================================
                          TOTAL
                      ================================= */}

                      <div className="min-w-[150px] border-l border-slate-200 px-6 py-5 dark:border-slate-800">

                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">

                          {t.totalPrice ||
                            'Total'}

                        </p>

                        <p className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">

                          $

                          {Number(
                            order.total ||
                            0
                          ).toFixed(2)}

                        </p>

                      </div>


                      {/* =================================
                          STATUS
                      ================================= */}

                      <div className="min-w-[160px] border-l border-slate-200 px-6 py-5 dark:border-slate-800">

                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">

                          {language === 'ar'
                            ? 'الحالة'
                            : language === 'fr'
                              ? 'Statut'
                              : 'Status'}

                        </p>

                        <span
                          className={`mt-2 inline-flex rounded-2xl px-3 py-2 text-xs font-semibold ${
                            statusClasses[
                              order.status
                            ] || ''
                          }`}
                        >

                          {translatedStatus}

                        </span>

                      </div>


                      

                       

                    </div>
                    {/* =================================
                          ACTIONS
                      ================================= */}

                      <div className="border-l border-slate-200 px-40 py-5 dark:border-slate-800">

                        {/* <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">

                          {language === 'ar'
                            ? 'الإجراءات'
                            : language === 'fr'
                              ? 'Actions'
                              : 'Actions'}

                        </p> */}


                        <div className="mt-3 flex flex-wrap gap-10">

                          {/* =================================
                              DETAILS
                          ================================= */}

                          <Button
                            variant="secondary"
                            onClick={() =>
                              setSelectedOrder(
                                order
                              )
                            }
                            disabled={
                              deletingAll
                            }
                          >

                            <span className="inline-flex items-center gap-2">

                              
                              {language === 'ar'
                                ? 'التفاصيل'
                                : language === 'fr'
                                  ? 'Détails'
                                  : 'Details'}

                            </span>

                          </Button>


                          {/* =================================
                              ACCEPT
                          ================================= */}

                          <Button
                            onClick={() =>
                              changeStatus(
                                order,
                                'preparing'
                              )
                            }
                            disabled={
                              isAccepting ||
                              deletingAll
                            }
                          >

                            {isAccepting
                              ? t.accepting ||
                                'Accepting...'
                              : t.accept ||
                                'Accept'}

                          </Button>


                          {/* =================================
                              CANCEL
                          ================================= */}

                          <Button
                            variant="danger"
                            onClick={() =>
                              changeStatus(
                                order,
                                'cancelled'
                              )
                            }
                            disabled={
                              isCancelling ||
                              deletingAll
                            }
                          >

                            {isCancelling
                              ? t.cancelling ||
                                'Cancelling...'
                              : t.cancel ||
                                'Cancel'}

                          </Button>


                          {/* =================================
                              INVOICE
                          ================================= */}

                          {order.status ===
                            'preparing' && (

                            <Button
                              variant="secondary"
                              onClick={() =>
                                handleDownloadInvoice(
                                  order
                                )
                              }
                              disabled={
                                deletingAll
                              }
                            >

                              {t.downloadInvoice ||
                                'Invoice'}

                            </Button>

                          )}


                          {/* =================================
                              DELETE
                          ================================= */}

                          <Button
                            variant="ghost"
                            onClick={() =>
                              handleDeleteOrder(
                                order
                              )
                            }
                            disabled={
                              isDeleting ||
                              deletingAll
                            }
                          >

                            {isDeleting
                              ? t.deleting ||
                                'Deleting...'
                              : t.deleteCategory ||
                                'Delete'}

                          </Button>

                        </div>
                       </div>
                  </div>

                </div>

              )
            }
          )

        )}

      </div>


      {/* =================================================
          ORDER DETAILS MODAL
      ================================================= */}

      {selectedOrder && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {

            if (
              e.target ===
              e.currentTarget
            ) {
              setSelectedOrder(
                null
              )
            }

          }}
        >

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">

            {/* =============================================
                MODAL HEADER
            ============================================= */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">

              <div>

                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">

                  {t.orderNumber ||
                    'Order'}{' '}

                  #{selectedOrder.id}

                </p>

                <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">

                  {language === 'ar'
                    ? 'تفاصيل الطلب'
                    : language === 'fr'
                      ? 'Détails de la commande'
                      : 'Order Details'}

                </h2>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(
                    null
                  )
                }
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >

                <X size={20} />

              </button>

            </div>


            {/* =============================================
                MODAL CONTENT
            ============================================= */}

            <div className="space-y-6 p-6">

              {/* =============================================
                  BASIC INFO
              ============================================= */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                {/* CUSTOMER */}

                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/70">

                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">

                    {t.customerName ||
                      'Customer'}

                  </p>

                  <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">

                    {selectedOrder.customer_name ||
                      selectedOrder.customerName ||
                      '-'}

                  </p>

                </div>


                {/* TABLE */}

                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/70">

                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">

                    {t.table ||
                      'Table'}

                  </p>

                  <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">

                    {getTableNumber(
                      selectedOrder.table_id
                    ) ?? '---'}

                  </p>

                </div>


                {/* STATUS */}

                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/70">

                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">

                    {language === 'ar'
                      ? 'الحالة'
                      : language === 'fr'
                        ? 'Statut'
                        : 'Status'}

                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-2xl px-3 py-2 text-xs font-semibold ${
                      statusClasses[
                        selectedOrder.status
                      ] || ''
                    }`}
                  >

                    {getStatusTranslation(
                      selectedOrder.status,
                      language,
                      t
                    )}

                  </span>

                </div>

              </div>


              {/* =============================================
                  DATE
              ============================================= */}

              <div className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800">

                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">

                  {language === 'ar'
                    ? 'تاريخ الطلب'
                    : language === 'fr'
                      ? 'Date de commande'
                      : 'Order Date'}

                </p>

                <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">

                  {formatOrderDate(
                    selectedOrder.created_at
                  )}

                </p>

              </div>


              {/* =============================================
                  ITEMS
              ============================================= */}

              <div>

                <div className="mb-3 flex items-center justify-between">

                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">

                    {t.items ||
                      'Items'}

                  </h3>

                  <span className="text-xs text-slate-500 dark:text-slate-400">

                    {(
                      selectedOrder.items ||
                      []
                    ).length}{' '}

                    {language === 'ar'
                      ? 'عناصر'
                      : language === 'fr'
                        ? 'articles'
                        : 'items'}

                  </span>

                </div>


                <div className="space-y-3">

                  {(
                    selectedOrder.items ||
                    []
                  ).map(
                    (
                      orderItem,
                      index
                    ) => {

                      const name =
                        getOrderItemName(
                          orderItem
                        )


                      const quantity =
                        Number(
                          orderItem.quantity ||
                          1
                        )


                      const meal =
                        meals.find(
                          (item) =>
                            Number(
                              item.id
                            ) ===
                            Number(
                              orderItem.meal_id
                            )
                        )


                      const unitPrice =
                        Number(
                          orderItem.unit_price ??
                          orderItem.price ??
                          meal?.price ??
                          0
                        )


                      const itemTotal =
                        Number(
                          orderItem.total_price ??
                          unitPrice *
                            quantity
                        )


                      return (

                        <div
                          key={`${selectedOrder.id}-modal-${orderItem.meal_id || index}`}
                          className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800"
                        >

                          <div className="min-w-0">

                            <p className="truncate font-medium text-slate-900 dark:text-slate-100">

                              {name}

                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">

                              {language === 'ar'
                                ? `الكمية: ${quantity}`
                                : language === 'fr'
                                  ? `Quantité : ${quantity}`
                                  : `Quantity: ${quantity}`}

                            </p>

                          </div>


                          <div className="ml-4 text-right">

                            <p className="text-sm text-slate-500 dark:text-slate-400">

                              ${unitPrice.toFixed(2)}

                            </p>

                            <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">

                              ${itemTotal.toFixed(2)}

                            </p>

                          </div>

                        </div>

                      )
                    }
                  )}

                </div>

              </div>


              {/* =============================================
                  TOTAL
              ============================================= */}

              <div className="flex items-center justify-between border-t border-slate-200 pt-5 dark:border-slate-800">

                <span className="text-base font-semibold text-slate-900 dark:text-slate-100">

                  {t.totalPrice ||
                    t.total ||
                    'Total'}

                </span>

                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">

                  $
                  {Number(
                    selectedOrder.total ||
                    0
                  ).toFixed(2)}

                </span>

              </div>


             

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default OrdersPage