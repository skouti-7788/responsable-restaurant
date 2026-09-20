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
} from 'lucide-react'

import {
  getRestaurantOrders,
  getRestaurantMeals,
  getRestaurantTables,
  updateOrderStatus,
  deleteOrder,
} from '../../data/dataOrders'

import {
  getCurrentRestaurantId,
  getRestaurantCache,
  setRestaurantCache,
} from '../../utils/restaurantCache'

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
  fallback,
  restaurantId = getCurrentRestaurantId()
) => {
  if (!restaurantId) {
    return fallback
  }

  try {
    const cached =
      getRestaurantCache(
        key,
        restaurantId
      )

    return cached ?? fallback
  } catch (error) {
    console.error(
      'Restaurant cache read error:',
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
  data,
  restaurantId = getCurrentRestaurantId()
) => {
  if (!restaurantId) {
    return
  }

  try {
    setRestaurantCache(
      key,
      restaurantId,
      data
    )
  } catch (error) {
    console.error(
      'Restaurant cache save error:',
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
        state.orders.items || []
    )


  // ===================================================
  // TRANSLATIONS
  // ===================================================

  const t =
    translations[language] ||
    translations.en ||
    {}


  // ===================================================
  // CURRENT RESTAURANT
  // ===================================================

  const currentRestaurantId =
    getCurrentRestaurantId()


  // ===================================================
  // INITIAL CACHE
  // ===================================================

  const cachedMeals =
    readCache(
      MEALS_CACHE_KEY,
      [],
      currentRestaurantId
    )

  const cachedTables =
    readCache(
      TABLES_CACHE_KEY,
      [],
      currentRestaurantId
    )


  // ===================================================
  // STATE
  // ===================================================

  const [restaurants] =
    useState([])

  const [
    meals,
    setMeals,
  ] = useState(
    Array.isArray(cachedMeals)
      ? cachedMeals
      : []
  )

  const [
    tables,
    setTables,
  ] = useState(
    Array.isArray(cachedTables)
      ? cachedTables
      : []
  )


  // ===================================================
  // PAGE LOADING
  // ===================================================

  const [
    loading,
    setLoading,
  ] = useState(true)


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

          const restaurantId =
            getCurrentRestaurantId()


          // =============================================
          // USE MEALS + TABLES CACHE FIRST
          // =============================================

          if (
            useCache &&
            restaurantId
          ) {
            const mealsCache =
              readCache(
                MEALS_CACHE_KEY,
                [],
                restaurantId
              )

            const tablesCache =
              readCache(
                TABLES_CACHE_KEY,
                [],
                restaurantId
              )

            if (
              Array.isArray(
                mealsCache
              ) &&
              mealsCache.length > 0
            ) {
              setMeals(
                mealsCache
              )
            }

            if (
              Array.isArray(
                tablesCache
              ) &&
              tablesCache.length > 0
            ) {
              setTables(
                tablesCache
              )
            }
          }


          // =============================================
          // VERIFY RESTAURANT
          // =============================================

          const authenticatedRestaurantId =
            getCurrentRestaurantId()

          if (
            !authenticatedRestaurantId
          ) {
            setMeals([])
            setTables([])

            return null
          }


          // =============================================
          // GET CURRENT USER
          // =============================================

          let currentUser = null

          try {
            currentUser =
              JSON.parse(
                localStorage.getItem(
                  'restaurant_user'
                ) || 'null'
              )
          } catch (parseError) {
            console.error(
              'Restaurant user cache parse error:',
              parseError
            )
          }


          // =============================================
          // RESOLVE RESTAURANT
          // =============================================

          const restaurant =
            currentUser?.restaurant?.id
              ? currentUser.restaurant
              : {
                  id:
                    authenticatedRestaurantId,

                  slug:
                    currentUser?.restaurant
                      ?.slug || null,
                }


          if (!restaurant?.id) {
            setMeals([])
            setTables([])

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


          // =============================================
          // UPDATE STATE
          // =============================================

          const safeMeals =
            Array.isArray(
              mealsData
            )
              ? mealsData
              : []

          const safeTables =
            Array.isArray(
              tablesData
            )
              ? tablesData
              : []


          setMeals(
            safeMeals
          )

          setTables(
            safeTables
          )


          // =============================================
          // SAVE ONLY NON-ORDER DATA
          // =============================================

          saveCache(
            MEALS_CACHE_KEY,
            safeMeals,
            restaurant.id
          )

          saveCache(
            TABLES_CACHE_KEY,
            safeTables,
            restaurant.id
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
      async () => {
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

          if (
            !restaurant?.id
          ) {
            dispatch(
              fetchOrdersSuccess([])
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
          // UPDATE REDUX ONLY
          // =============================================

          dispatch(
            fetchOrdersSuccess(
              Array.isArray(
                freshOrders
              )
                ? freshOrders
                : []
            )
          )


          setError('')

        } catch (err) {
          console.error(
            'Orders check error:',
            err
          )

          setError(
            err?.response
              ?.data?.message ||
            err?.message ||
            'Unable to load orders'
          )

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

        if (cancelled) {
          return
        }

        setRefreshing(true)
        setLoading(true)

        try {
          await checkOrders()
        } finally {
          if (!cancelled) {
            setRefreshing(false)
            setLoading(false)
          }
        }
      }

    initialize()

    return () => {
      cancelled = true
    }

  }, [
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
        await checkOrders()
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

        const matchesStatus =
          statusFilter === 'all' ||
          order.status ===
            statusFilter


        if (!matchesStatus) {
          return false
        }


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
          await checkOrders()
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
              132,
              y
            )

            drawText(
              doc,
              `${unitPrice.toFixed(2)}${t.currencySymbol || '$'}`,
              86,
              y
            )

            drawText(
              doc,
              `${totalPrice.toFixed(2)}${t.currencySymbol || '$'}`,
              50,
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
              ` ${unitPrice.toFixed(2)}${t.currencySymbol || '$'}`,
              125,
              y
            )

            drawText(
              doc,
              ` ${totalPrice.toFixed(2)}${t.currencySymbol || '$'}`,
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
          `${orderTotal.toFixed(2)}${t.currencySymbol || '$'}`,
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
          ` ${orderTotal.toFixed(2)}${t.currencySymbol || '$'}`,
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

          {/* STATUS FILTER */}

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
              className="h-11 min-w-[130px] rounded-2xl border border-slate-200 bg-white px-4 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-500"
            >

              <option value="all">
                {t.statusAll}
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

              <option value="cancelled">
                {language === 'ar'
                  ? 'ملغى'
                  : language === 'fr'
                    ? 'Annulé'
                    : 'Cancelled'}
              </option>

            </select>

          </div>


          {/* REFRESH */}

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


          {/* DELETE ALL */}

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

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">

          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {statisticsLabels.total}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {totalOrders}
          </p>

        </div>


        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">

          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {statisticsLabels.pending}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {pendingOrders}
          </p>

        </div>


        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">

          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {statisticsLabels.preparing}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {preparingOrders}
          </p>

        </div>


        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">

          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {statisticsLabels.completed}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
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

        {filteredOrders.length === 0 ? (

          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-card dark:border-slate-800 dark:bg-slate-900">

            {loading ? (

              <>
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" />

                <p className="mt-4 text-slate-500 dark:text-slate-400">
                  {language === 'ar'
                    ? 'جاري تحميل الطلبات...'
                    : language === 'fr'
                      ? 'Chargement des commandes...'
                      : 'Loading orders...'}
                </p>
              </>

            ) : (

              <p className="text-slate-500 dark:text-slate-400">

                {orders.length > 0 ? (

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

            )}

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

                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">

                      <div>

                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">

                          {t.orderNumber ||
                            'Order'}{' '}

                          #{order.id}

                        </p>

                      </div>

                    </div>


                    <div className="flex items-stretch">

                      <div className="min-w-[190px] flex-1 px-6 py-5">

                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">

                          {t.customerName ||
                            'Customer'}

                        </p>

                        <h3 className="mt-2 truncate text-lg font-semibold text-slate-900 dark:text-slate-100">

                          {customerName}

                        </h3>

                      </div>


                      <div className="min-w-[130px] border-l border-slate-200 px-6 py-5 dark:border-slate-800">

                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">

                          {t.table ||
                            'Table'}

                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">

                          {tableDisplay}

                        </p>

                      </div>


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


                      <div className="min-w-[150px] border-l border-slate-200 px-6 py-5 dark:border-slate-800">

                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">

                          {t.totalPrice ||
                            'Total'}

                        </p>

                        <p className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">

                          {Number(
                            order.total || 0
                          ).toFixed(2)}

                          <span>
                            {' '}
                            {t.currencySymbol || '$'}
                          </span>

                        </p>

                      </div>


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


                    {/* ACTIONS */}

                    <div className="border-t border-slate-200 px-6 py-5 dark:border-slate-800">

                      <div className="flex flex-wrap gap-4">

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

                          {language === 'ar'
                            ? 'التفاصيل'
                            : language === 'fr'
                              ? 'Détails'
                              : 'Details'}

                        </Button>


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


            <div className="space-y-6 p-6">

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

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

                              {t.currencySymbol || '$'}
                              {unitPrice.toFixed(2)}

                            </p>

                            <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">

                              {t.currencySymbol || '$'}
                              {' '}
                              {itemTotal.toFixed(2)}

                            </p>

                          </div>

                        </div>

                      )
                    }
                  )}

                </div>

              </div>


              <div className="flex items-center justify-between border-t border-slate-200 pt-5 dark:border-slate-800">

                <span className="text-base font-semibold text-slate-900 dark:text-slate-100">

                  {t.totalPrice ||
                    t.total ||
                    'Total'}

                </span>

                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">

                  {t.currencySymbol || '$'}
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