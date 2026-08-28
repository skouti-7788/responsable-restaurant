import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import axiosClient from '../../api/axiosClient'

import {
  fetchOrdersFailure,
  fetchOrdersStart,
  fetchOrdersSuccess,
  removeOrder,
  updateOrder,
} from '../../store/orderSlice'

import translations from '../../i18n/translations'
import Button from '../../components/ui/Button'

import jsPDF from 'jspdf'
import AmiriRegular from '../../assets/fonts/Amiri-Regular'

import arabicReshaper from 'arabic-persian-reshaper'
import bidiFactory from 'bidi-js'

// =====================================================
// LOCAL STORAGE KEYS
// =====================================================

const ORDERS_STORAGE_KEY =
  'restaurant_orders'

const RESTAURANTS_STORAGE_KEY =
  'restaurant_restaurants'

const MEALS_STORAGE_KEY =
  'restaurant_meals'

const TABLES_STORAGE_KEY =
  'restaurant_tables'

const RESTAURANT_ID_STORAGE_KEY =
  'restaurant_id'

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
// BIDI
// =====================================================

const bidi = bidiFactory()

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
// GET STATUS TRANSLATION
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

  if (
    statusTranslations[language] &&
    statusTranslations[language][status]
  ) {
    return statusTranslations[
      language
    ][status]
  }

  if (
    statusTranslations.ar[status]
  ) {
    return statusTranslations.ar[
      status
    ]
  }

  return status
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
      'Arabic PDF text error:',
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
// DRAW NORMAL TEXT
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
// GET PDF LABEL
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
  const dispatch = useDispatch()

  // ===================================================
  // LANGUAGE
  // ===================================================

  const { language } =
    useSelector(
      (state) => state.ui
    )

  // ===================================================
  // ORDERS FROM REDUX
  // ===================================================

  const orders =
    useSelector(
      (state) =>
        state.orders.items
    ) || []

  // ===================================================
  // LOCAL STATE
  // ===================================================

  const [
    restaurants,
    setRestaurants,
  ] = useState(() => {
    try {
      const saved =
        localStorage.getItem(
          RESTAURANTS_STORAGE_KEY
        )

      if (!saved) return []

      const parsed =
        JSON.parse(saved)

      return Array.isArray(parsed)
        ? parsed
        : []
    } catch {
      return []
    }
  })

  const [
    meals,
    setMeals,
  ] = useState(() => {
    try {
      const saved =
        localStorage.getItem(
          MEALS_STORAGE_KEY
        )

      if (!saved) return []

      const parsed =
        JSON.parse(saved)

      return Array.isArray(parsed)
        ? parsed
        : []
    } catch {
      return []
    }
  })

  const [
    tables,
    setTables,
  ] = useState(() => {
    try {
      const saved =
        localStorage.getItem(
          TABLES_STORAGE_KEY
        )

      if (!saved) return []

      const parsed =
        JSON.parse(saved)

      return Array.isArray(parsed)
        ? parsed
        : []
    } catch {
      return []
    }
  })

  // ===================================================
  // TRANSLATIONS
  // ===================================================

  const t =
    translations[language] ||
    translations.en ||
    {}

  // =====================================================
  // INITIALIZE ORDERS FROM CACHE
  // =====================================================

  useEffect(() => {
    const cachedOrders =
      localStorage.getItem(
        ORDERS_STORAGE_KEY
      )

    if (!cachedOrders) {
      return
    }

    try {
      const parsed =
        JSON.parse(
          cachedOrders
        )

      if (
        Array.isArray(parsed)
      ) {
        dispatch(
          fetchOrdersSuccess(
            parsed
          )
        )
      }
    } catch (error) {
      console.error(
        'Invalid cached orders:',
        error
      )

      localStorage.removeItem(
        ORDERS_STORAGE_KEY
      )
    }
  }, [dispatch])

  // =====================================================
  // LOAD RESTAURANT + MEALS + TABLES
  //
  // API ONLY IF CACHE DOES NOT EXIST
  // =====================================================

  useEffect(() => {
    const loadRestaurantData =
      async () => {

        // =================================================
        // RESTAURANT CACHE
        // =================================================

        let restaurantsData = []

        const cachedRestaurants =
          localStorage.getItem(
            RESTAURANTS_STORAGE_KEY
          )

        if (cachedRestaurants) {
          try {
            const parsed =
              JSON.parse(
                cachedRestaurants
              )

            if (
              Array.isArray(parsed)
            ) {
              restaurantsData =
                parsed

              setRestaurants(
                parsed
              )
            }
          } catch {
            localStorage.removeItem(
              RESTAURANTS_STORAGE_KEY
            )
          }
        }

        // =================================================
        // MEALS CACHE
        // =================================================

        const cachedMeals =
          localStorage.getItem(
            MEALS_STORAGE_KEY
          )

        if (cachedMeals) {
          try {
            const parsed =
              JSON.parse(
                cachedMeals
              )

            if (
              Array.isArray(parsed)
            ) {
              setMeals(parsed)
            }
          } catch {
            localStorage.removeItem(
              MEALS_STORAGE_KEY
            )
          }
        }

        // =================================================
        // TABLES CACHE
        // =================================================

        const cachedTables =
          localStorage.getItem(
            TABLES_STORAGE_KEY
          )

        if (cachedTables) {
          try {
            const parsed =
              JSON.parse(
                cachedTables
              )

            if (
              Array.isArray(parsed)
            ) {
              setTables(parsed)
            }
          } catch {
            localStorage.removeItem(
              TABLES_STORAGE_KEY
            )
          }
        }

        // =================================================
        // IF EVERYTHING EXISTS → STOP
        // =================================================

        const hasRestaurantCache =
          restaurantsData.length > 0

        const hasMealsCache =
          Boolean(cachedMeals)

        const hasTablesCache =
          Boolean(cachedTables)

        if (
          hasRestaurantCache &&
          hasMealsCache &&
          hasTablesCache
        ) {
          return
        }

        // =================================================
        // API
        // =================================================

        try {
          const response =
            await axiosClient.get(
              '/restaurants'
            )

          restaurantsData =
            response.data?.data ||
            response.data ||
            []

          if (
            !Array.isArray(
              restaurantsData
            )
          ) {
            restaurantsData = []
          }

          setRestaurants(
            restaurantsData
          )

          localStorage.setItem(
            RESTAURANTS_STORAGE_KEY,
            JSON.stringify(
              restaurantsData
            )
          )

          const restaurant =
            restaurantsData[0]

          if (
            !restaurant?.id
          ) {
            setMeals([])
            setTables([])

            return
          }

          const restaurantId =
            restaurant.id

          localStorage.setItem(
            RESTAURANT_ID_STORAGE_KEY,
            String(restaurantId)
          )

          // =================================================
          // MEALS API
          // =================================================

          if (!hasMealsCache) {
            const mealsResponse =
              await axiosClient.get(
                `/restaurants/${restaurantId}/meals`
              )

            const mealsData =
              mealsResponse.data?.data ||
              mealsResponse.data ||
              []

            const finalMeals =
              Array.isArray(
                mealsData
              )
                ? mealsData
                : []

            setMeals(finalMeals)

            localStorage.setItem(
              MEALS_STORAGE_KEY,
              JSON.stringify(
                finalMeals
              )
            )
          }

          // =================================================
          // TABLES API
          // =================================================

          if (!hasTablesCache) {
            const tablesResponse =
              await axiosClient.get(
                `/restaurants/${restaurantId}/tables`
              )

            const tablesData =
              tablesResponse.data?.data ||
              tablesResponse.data ||
              []

            const finalTables =
              Array.isArray(
                tablesData
              )
                ? tablesData
                : []

            setTables(
              finalTables
            )

            localStorage.setItem(
              TABLES_STORAGE_KEY,
              JSON.stringify(
                finalTables
              )
            )
          }

        } catch (err) {
          console.error(
            'Failed to load restaurant data:',
            err
          )
        }
      }

    loadRestaurantData()
  }, [])

  // =====================================================
  // LOAD ORDERS
  //
  // API ONLY IF NO CACHE
  // =====================================================

  useEffect(() => {
    const loadOrders =
      async () => {

        const cachedOrders =
          localStorage.getItem(
            ORDERS_STORAGE_KEY
          )

        // ================================================
        // CACHE EXISTS
        // ================================================

        if (cachedOrders) {
          try {
            const parsed =
              JSON.parse(
                cachedOrders
              )

            if (
              Array.isArray(parsed)
            ) {
              dispatch(
                fetchOrdersSuccess(
                  parsed
                )
              )

              return
            }
          } catch (error) {
            console.error(
              'Invalid cached orders:',
              error
            )

            localStorage.removeItem(
              ORDERS_STORAGE_KEY
            )
          }
        }

        // ================================================
        // NO CACHE → API
        // ================================================

        dispatch(
          fetchOrdersStart()
        )

        try {
          const response =
            await axiosClient.get(
              '/restaurants'
            )

          const restaurantsData =
            response.data?.data ||
            response.data ||
            []

          const restaurant =
            restaurantsData[0]

          if (
            !restaurant?.id
          ) {
            dispatch(
              fetchOrdersSuccess(
                []
              )
            )

            localStorage.setItem(
              ORDERS_STORAGE_KEY,
              JSON.stringify([])
            )

            return
          }

          const ordersResponse =
            await axiosClient.get(
              `/restaurants/${restaurant.id}/orders`
            )

          const ordersData =
            ordersResponse.data?.data ||
            ordersResponse.data ||
            []

          const finalOrders =
            Array.isArray(
              ordersData
            )
              ? ordersData
              : []

          localStorage.setItem(
            ORDERS_STORAGE_KEY,
            JSON.stringify(
              finalOrders
            )
          )

          dispatch(
            fetchOrdersSuccess(
              finalOrders
            )
          )

        } catch (err) {
          dispatch(
            fetchOrdersFailure(
              err?.message ||
              'Unable to load orders'
            )
          )
        }
      }

    loadOrders()
  }, [dispatch])

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
      table?.number ?? null
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
        const response =
          await axiosClient.put(
            `/orders/${order.id}/status`,
            {
              status,
            }
          )

        const updatedOrder =
          response.data?.data ||
          response.data

        // ===============================================
        // REDUX
        // ===============================================

        dispatch(
          updateOrder(
            updatedOrder
          )
        )

        // ===============================================
        // LOCAL STORAGE
        // ===============================================

        const cachedOrders =
          JSON.parse(
            localStorage.getItem(
              ORDERS_STORAGE_KEY
            ) || '[]'
          )

        const updatedOrders =
          cachedOrders.map(
            (item) =>
              item.id ===
              updatedOrder.id
                ? updatedOrder
                : item
          )

        localStorage.setItem(
          ORDERS_STORAGE_KEY,
          JSON.stringify(
            updatedOrders
          )
        )

      } catch (err) {
        console.error(
          'Change order status error:',
          err
        )

        dispatch(
          fetchOrdersFailure(
            err?.message ||
            'Unable to update order status'
          )
        )
      }
    }

  // =====================================================
  // DELETE ORDER
  // =====================================================

  const handleDeleteOrder =
    async (order) => {
      try {
        const response =
          await axiosClient.delete(
            `/orders/${order.id}/delete`
          )

        if (
          response.data?.message
        ) {

          // =============================================
          // REDUX
          // =============================================

          dispatch(
            removeOrder(
              order.id
            )
          )

          // =============================================
          // LOCAL STORAGE
          // =============================================

          const cachedOrders =
            JSON.parse(
              localStorage.getItem(
                ORDERS_STORAGE_KEY
              ) || '[]'
            )

          const updatedOrders =
            cachedOrders.filter(
              (item) =>
                item.id !==
                order.id
            )

          localStorage.setItem(
            ORDERS_STORAGE_KEY,
            JSON.stringify(
              updatedOrders
            )
          )
        }

      } catch (err) {
        console.error(
          'Delete order error:',
          err
        )

        dispatch(
          fetchOrdersFailure(
            err?.message ||
            'Unable to delete order'
          )
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

      // =================================================
      // AMIRI FONT
      // =================================================

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

      // =================================================
      // DATA
      // =================================================

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

      // =================================================
      // LABELS
      // =================================================

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

      const isArabicLanguage =
        language === 'ar'

      let y = 20

      // =================================================
      // TITLE
      // =================================================

      doc.setFontSize(22)

      if (
        isArabicLanguage
      ) {
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

      // =================================================
      // RESTAURANT
      // =================================================

      doc.setFontSize(16)

      drawText(
        doc,
        restaurantName,
        20,
        y
      )

      y += 12

      // =================================================
      // ORDER INFO
      // =================================================

      doc.setFontSize(11)

      if (
        isArabicLanguage
      ) {

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

      // =================================================
      // LINE
      // =================================================

      doc.line(
        20,
        y,
        190,
        y
      )

      y += 10

      // =================================================
      // TABLE HEADER
      // =================================================

      doc.setFontSize(10)

      if (
        isArabicLanguage
      ) {

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

      // =================================================
      // ORDER ITEMS
      // =================================================

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

          if (
            isArabicLanguage
          ) {

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

      // =================================================
      // TOTAL
      // =================================================

      y += 5

      doc.line(
        20,
        y,
        190,
        y
      )

      y += 13

      doc.setFontSize(14)

      if (
        isArabicLanguage
      ) {

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

      // =================================================
      // SAVE
      // =================================================

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

      <div className="mb-6">

        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {t.orders}
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t.ordersDescription}
        </p>

      </div>

      {/* ORDERS GRID */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        {orders.length === 0 ? (

          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-card dark:border-slate-800 dark:bg-slate-900 sm:col-span-2 xl:col-span-3">

            <p className="text-slate-500 dark:text-slate-400">
              {t.noOrdersAvailable}
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
                  key={order.id}
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
                        {t.customerName}
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
                        ] || ''
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
                      {tableDisplay}
                    </p>

                  </div>

                  {/* ITEMS + TOTAL */}

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">

                    {/* ITEMS */}

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">

                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {t.items}
                      </p>

                      <ul className="mt-3 space-y-2 text-slate-700 dark:text-slate-200">

                        {(order.items ||
                          []).map(
                          (
                            orderItem,
                            index
                          ) => {

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
                                {name}

                                {quantity
                                  ? ` × ${quantity}`
                                  : ''}
                              </li>

                            )
                          }
                        )}

                      </ul>

                    </div>

                    {/* TOTAL */}

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">

                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {t.totalPrice}
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
                      {t.accept}
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
                      {t.cancel}
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
                        {
                          t.downloadInvoice
                        }
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
                      {
                        t.deleteCategory
                      }
                    </Button>

                  </div>

                </div>

              )
            }
          )

        )}

      </div>

    </div>
  )
}

export default OrdersPage