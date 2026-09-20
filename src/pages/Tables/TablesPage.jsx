import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react'

import {
  useSelector,
} from 'react-redux'

import {
  Plus,
  // Pencil,
  Trash2,
  QrCode,
  RefreshCw,
} from 'lucide-react'

import {
  getTables,
  getRestaurants,
  createTable,
  // updateTable,
  deleteTable,
  deleteAllTables,
} from '../../data/dataTables'

import translations from '../../i18n/translations'

import {
  getCurrentRestaurantId,
  getRestaurantCache,
  setRestaurantCache,
} from '../../utils/restaurantCache'


const TablesPage = () => {

  // =====================================================
  // LANGUAGE
  // =====================================================

  const { language } =
    useSelector(
      (state) => state.ui
    )

  const t =
    translations[language] ||
    translations.en ||
    {}


  // =====================================================
  // CACHE
  // =====================================================

  const TABLES_CACHE_KEY =
    'restaurant_tables_cache'

  const currentRestaurantId =
    getCurrentRestaurantId()

  const cachedTables =
    currentRestaurantId
      ? getRestaurantCache(
          TABLES_CACHE_KEY,
          currentRestaurantId
        ) ?? []
      : []


  // =====================================================
  // TABLES
  // =====================================================

  const [
    tables,
    setTables,
  ] = useState(
    () => cachedTables
  )

  const tablesRef =
    useRef(cachedTables)

  useEffect(() => {
    tablesRef.current = tables
  }, [tables])


  // =====================================================
  // RESTAURANT
  // =====================================================

  const [
    restaurantId,
    setRestaurantId,
  ] = useState(
    currentRestaurantId
  )

  const restaurantIdRef =
    useRef(currentRestaurantId)

  useEffect(() => {
    restaurantIdRef.current =
      restaurantId
  }, [restaurantId])

  const [
    restaurantSlug,
    setRestaurantSlug,
  ] = useState(null)


  // =====================================================
  // PAGE LOADING
  // =====================================================

  // Cache exists:
  //     loading = false
  //
  // No cache:
  //     loading = true

  const [
    loading,
    setLoading,
  ] = useState(
    () => cachedTables.length === 0
  )


  // =====================================================
  // REFRESH
  // =====================================================

  const [
    refreshing,
    setRefreshing,
  ] = useState(false)


  // =====================================================
  // SAVE
  // =====================================================

  // const [
  //   saving,
  //   setSaving,
  // ] = useState(false)


  // =====================================================
  // ERROR
  // =====================================================

  const [
    error,
    setError,
  ] = useState('')


  // =====================================================
  // EDIT MODAL
  // =====================================================

  // const [
  //   open,
  //   setOpen,
  // ] = useState(false)

  // const [
  //   editing,
  //   setEditing,
  // ] = useState(null)


  // =====================================================
  // DELETE ALL
  // =====================================================

  const [
    deletingAll,
    setDeletingAll,
  ] = useState(false)
  // =====================================================
  // DELETE ALL
  // =====================================================

   const [
    deleting ,
    setDeleting ,
  ] = useState(null)
  // =====================================================
  // QR MODAL
  // =====================================================

  const [
    qrTable,
    setQrTable,
  ] = useState(null)

  const [
    copied,
    setCopied,
  ] = useState(false)


  // =====================================================
  // FORM
  // =====================================================

  // const [
    // form,
    // setForm,
  // ] = useState({
  //   number: '',
  //   name: '',
  //   status: 'available',
  // })


  // =====================================================
  // BULK ADD
  // =====================================================

  const [
    bulkOpen,
    setBulkOpen,
  ] = useState(false)

  const [
    bulkCount,
    setBulkCount,
  ] = useState('')

  const [
    bulkSaving,
    setBulkSaving,
  ] = useState(false)

  const [
    bulkError,
    setBulkError,
  ] = useState('')


  // =====================================================
  // SAVE TABLES CACHE
  // =====================================================

  // IMPORTANT:
  // Stable callback.
  // restaurantIdRef prevents useEffect loops.

  const saveTablesToCache =
    useCallback(
      (
        data,
        targetRestaurantId = null
      ) => {

        const activeRestaurantId =
          targetRestaurantId ||
          restaurantIdRef.current ||
          getCurrentRestaurantId()

        if (!activeRestaurantId) {
          return
        }


        setRestaurantCache(
          TABLES_CACHE_KEY,
          activeRestaurantId,
          Array.isArray(data)
            ? data.map((table) => {
                const safeTable = { ...table }
                delete safeTable.qr_token
                return safeTable
              })
            : []
        )

      },
      []
    )


  // =====================================================
  // LOAD TABLES
  // =====================================================

  const loadTables =
    useCallback(
      async () => {

        setError('')


        // =================================================
        // GET RESTAURANT ID
        // =================================================

        const id =
          restaurantIdRef.current ||
          getCurrentRestaurantId()


        if (!id) {

          setLoading(false)

          setTables([])
          tablesRef.current = []

          setRestaurantId(null)
          restaurantIdRef.current = null

          setRestaurantSlug(null)

          return
        }


        try {

          // =================================================
          // GET USER
          // =================================================

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
              'Parse restaurant_user error:',
              parseError
            )

          }


          // =================================================
          // GET RESTAURANT
          // =================================================

          let restaurant =
            currentUser?.restaurant ||
            null


          // =================================================
          // GET RESTAURANT FROM API IF NEEDED
          // =================================================

          if (
            !restaurant?.slug ||
            Number(restaurant?.id) !==
              Number(id)
          ) {

            try {

              const restaurantsResponse =
                await getRestaurants()


              const restaurantsData =
                restaurantsResponse?.data?.data ||
                restaurantsResponse?.data?.restaurants ||
                restaurantsResponse?.data ||
                []


              if (
                Array.isArray(
                  restaurantsData
                )
              ) {

                const foundRestaurant =
                  restaurantsData.find(
                    (item) =>
                      Number(item?.id) ===
                      Number(id)
                  )


                if (
                  foundRestaurant
                ) {

                  restaurant =
                    foundRestaurant

                }

              }

            } catch (
              restaurantError
            ) {

              console.error(
                'Load restaurant error:',
                restaurantError
              )

            }

          }


          // =================================================
          // RESTAURANT INFO
          // =================================================

          const slug =
            restaurant?.slug ||
            null


          setRestaurantId(id)

          restaurantIdRef.current =
            id

          setRestaurantSlug(slug)


          // =================================================
          // GET TABLES
          // =================================================

          const response =
            await getTables(id)


          const data =
            response?.data?.data ||
            response?.data ||
            []


          const normalizedTables =
            Array.isArray(data)
              ? data
              : []


          // =================================================
          // UPDATE UI
          // =================================================

          setTables(
            normalizedTables
          )

          tablesRef.current =
            normalizedTables


          // =================================================
          // UPDATE CACHE
          // =================================================

          saveTablesToCache(
            normalizedTables,
            id
          )


          // =================================================
          // DEBUG
          // =================================================

          // console.log(
          //   'Restaurant:',
          //   restaurant
          // )

          // console.log(
          //   'Restaurant ID:',
          //   id
          // )

          // console.log(
          //   'Restaurant Slug:',
          //   slug
          // )

          // console.log(
          //   'Tables:',
          //   normalizedTables
          // )

        } catch (err) {

          console.error(
            'Load tables error:',
            err
          )


          // =================================================
          // KEEP CACHE IF API FAILS
          // =================================================

          if (
            tablesRef.current.length === 0
          ) {

            setError(
              err?.response?.data?.message ||
              err?.message ||
              t.loadTablesError ||
              'Failed to load tables.'
            )

          }

        } finally {

          // API finished.
          // Never leave the page loader active.

          setLoading(false)

        }

      },
      [
        saveTablesToCache,
        t.loadTablesError,
      ]
    )


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    let cancelled = false


    const run =
      async () => {

        if (cancelled) {
          return
        }

        // Cache is already in state.
        // API refreshes it in background.

        await loadTables()

      }


    run()


    return () => {
      cancelled = true
    }

  }, [
    loadTables,
  ])


  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh =
    async () => {

      if (
        refreshing ||
        loading
      ) {
        return
      }

      setRefreshing(true)
      setError('')

      try {

        await loadTables()

      } finally {

        setRefreshing(false)

      }

    }


  // =====================================================
  // DELETE ALL
  // =====================================================

  const handleDeleteAll =
    async () => {

      if (
        !restaurantId ||
        tables.length === 0
      ) {
        return
      }


      const confirmed =
        window.confirm(
          `${t.deleteAllTablesConfirm} (${tables.length})?`
        )


      if (!confirmed) {
        return
      }


      setDeletingAll(true)
      setError('')


      try {

        await deleteAllTables(
          restaurantId
        )


        setTables([])
        tablesRef.current = []

        saveTablesToCache(
          [],
          restaurantId
        )


      } catch (err) {

        console.error(
          'Delete all tables error:',
          err
        )


        setError(
          err?.response?.data?.message ||
          err?.message ||
          t.deleteAllTablesError ||
          'Failed to delete all tables.'
        )


      } finally {

        setDeletingAll(false)

      }

    }


  // =====================================================
  // OPEN BULK ADD
  // =====================================================

  const handleOpenBulkAdd =
    () => {

      setBulkCount('')
      setBulkError('')
      setBulkOpen(true)

    }


  // =====================================================
  // BULK CREATE
  // =====================================================

  const handleBulkSave =
    async () => {

      if (!restaurantId) {

        setBulkError(
          t.restaurantNotFound ||
          'Restaurant not found.'
        )

        return

      }


      const count =
        Number(bulkCount)


      if (
        !Number.isInteger(count) ||
        count < 1
      ) {

        setBulkError(
          t.tableCountRequired ||
          'Table count is required.'
        )

        return

      }


      setBulkSaving(true)
      setBulkError('')


      try {

        // =================================================
        // GET FRESH TABLES
        // =================================================

        const response =
          await getTables(
            restaurantId
          )


        const freshData =
          response?.data?.data ||
          response?.data ||
          []


        const freshTables =
          Array.isArray(freshData)
            ? freshData
            : []


        // =================================================
        // UPDATE STATE + CACHE
        // =================================================

        setTables(
          freshTables
        )

        tablesRef.current =
          freshTables

        saveTablesToCache(
          freshTables,
          restaurantId
        )


        // =================================================
        // FIND USED NUMBERS
        // =================================================

        const usedNumbers =
          new Set(
            freshTables
              .map(
                (table) =>
                  Number(
                    table?.number
                  )
              )
              .filter(
                (number) =>
                  Number.isInteger(
                    number
                  ) &&
                  number > 0
              )
          )


        // =================================================
        // FIND AVAILABLE NUMBERS
        // =================================================

        const numbersToCreate = []

        let number = 1


        while (
          numbersToCreate.length <
          count
        ) {

          if (
            !usedNumbers.has(
              number
            )
          ) {

            numbersToCreate.push(
              number
            )

            usedNumbers.add(
              number
            )

          }

          number += 1

        }


        // =================================================
        // CREATE TABLES
        // =================================================

        for (
          const tableNumber
          of numbersToCreate
        ) {

          await createTable(
            restaurantId,
            {
              number:
                tableNumber,

              name:
                `${tableNumber}`,

              status:
                'available',
            }
          )

        }


        // =================================================
        // RELOAD FINAL TABLES
        // =================================================

        await loadTables()


        setBulkOpen(false)
        setBulkCount('')


      } catch (err) {

        console.error(
          'Bulk add tables error:',
          err
        )


        setBulkError(
          err?.response?.data?.message ||
          err?.message ||
          t.saveTableError ||
          'Failed to save table.'
        )


      } finally {

        setBulkSaving(false)

      }

    }


  // =====================================================
  // EDIT
  // =====================================================

  // const handleEdit =
  //   (table) => {

  //     setEditing(table)


  //     setForm({
  //       number:
  //         table.number ||
  //         '',

  //       name:
  //         table.name ||
  //         '',

  //       status:
  //         table.status ||
  //         'available',
  //     })


  //     setError('')
  //     setOpen(true)

  //   }


  // =====================================================
  // SAVE EDIT
  // =====================================================

  // const handleSave =
  //   async () => {

  //     if (!restaurantId) {

  //       setError(
  //         t.restaurantNotFound ||
  //         'Restaurant not found.'
  //       )

  //       return

  //     }


  //     if (!form.number) {

  //       setError(
  //         t.tableNumberRequired ||
  //         'Table number is required.'
  //       )

  //       return

  //     }


  //     if (!editing?.id) {

  //       setError(
  //         'Table not found.'
  //       )

  //       return

  //     }


  //     setSaving(true)
  //     setError('')


  //     try {

  //       const payload = {

  //         number:
  //           Number(form.number),

  //         name:
  //           form.name ||
  //           `${t.table || 'Table'} ${form.number}`,

  //         status:
  //           form.status,

  //       }


  //       const response =
  //         await updateTable(
  //           restaurantId,
  //           editing.id,
  //           payload
  //         )


  //       const updatedTable =
  //         response?.data?.table ||
  //         response?.data?.data ||
  //         response?.data


  //       setTables(
  //         (current) => {

  //           const updated =
  //             current.map(
  //               (table) =>
  //                 table.id ===
  //                 editing.id
  //                   ? updatedTable
  //                   : table
  //             )


  //           tablesRef.current =
  //             updated


  //           saveTablesToCache(
  //             updated,
  //             restaurantId
  //           )


  //           return updated

  //         }
  //       )


  //       setOpen(false)
  //       setEditing(null)


  //       setForm({
  //         number: '',
  //         name: '',
  //         status: 'available',
  //       })


  //     } catch (err) {

  //       console.error(
  //         'Save table error:',
  //         err
  //       )


  //       setError(
  //         err?.response?.data?.message ||
  //         err?.message ||
  //         t.saveTableError ||
  //         'Failed to save table.'
  //       )


  //     } finally {

  //       setSaving(false)

  //     }

  //   }


  // =====================================================
  // MENU URL
  // =====================================================

  const getMenuUrl =
    (table) => {

      if (
        !restaurantSlug ||
        !table?.qr_token
      ) {
        return ''
      }


      return `https://menu-online.vercel.app/menu/${restaurantSlug}?table=${table.qr_token}`

    }


  // =====================================================
  // QR IMAGE
  // =====================================================

  const getQrImageUrl =
    (table) => {

      const menuUrl =
        getMenuUrl(table)


      if (!menuUrl) {
        return ''
      }


      return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(menuUrl)}`

    }


  // =====================================================
  // OPEN QR
  // =====================================================

  const handleOpenQr =
    (table) => {

      setQrTable(table)
      setCopied(false)

    }


  // =====================================================
  // CLOSE QR
  // =====================================================

  const handleCloseQr =
    () => {

      setQrTable(null)
      setCopied(false)

    }


  // =====================================================
  // COPY URL
  // =====================================================

  const handleCopyMenuUrl =
    async (table) => {

      const menuUrl =
        getMenuUrl(table)


      if (!menuUrl) {
        return
      }


      try {

        await navigator.clipboard.writeText(
          menuUrl
        )


        setCopied(true)


        setTimeout(
          () => {
            setCopied(false)
          },
          2000
        )


      } catch (err) {

        console.error(
          'Copy menu URL error:',
          err
        )

      }

    }


  // =====================================================
  // DOWNLOAD QR
  // =====================================================

  const handleDownloadQr =
    async (table) => {

      const qrImageUrl =
        getQrImageUrl(table)


      if (!qrImageUrl) {
        return
      }


      try {

        const response =
          await fetch(
            qrImageUrl
          )


        const blob =
          await response.blob()


        const url =
          window.URL.createObjectURL(
            blob
          )


        const link =
          document.createElement(
            'a'
          )


        link.href = url


        link.download =
          `table-${table.number}-qr.png`


        document.body.appendChild(
          link
        )


        link.click()


        document.body.removeChild(
          link
        )


        window.URL.revokeObjectURL(
          url
        )


      } catch (err) {

        console.error(
          'Download QR code error:',
          err
        )

      }

    }


  // =====================================================
  // DELETE TABLE
  // =====================================================

  const handleDelete =
    async (table) => {

      if (
        !restaurantId ||
        !table?.id
      ) {
        return
      }


      const tableName =
        table.name ||
        `${t.table || 'Table'} ${table.number}`


      const confirmed =
        window.confirm(
          `${t.deleteTableConfirm} "${tableName}"?`
        )


      if (!confirmed) {
        return
      }

      setDeleting(table.id)
      setError('')


      try {

        await deleteTable(
          restaurantId,
          table.id
        )


        setTables(
          (current) => {

            const updated =
              current.filter(
                (item) =>
                  item.id !==
                  table.id
              )


            tablesRef.current =
              updated


            saveTablesToCache(
              updated,
              restaurantId
            )


            return updated

          }
        )


      } catch (err) {

        console.error(
          'Delete table error:',
          err
        )


        setError(
          err?.response?.data?.message ||
          err?.message ||
          t.deleteTableError ||
          'Failed to delete table.'
        )

      }finally {

        setDeleting (null)

      }

    }

   // =====================================================
  // STATUS LABEL
  // =====================================================

  const getStatusLabel =
    (status) => {

      const labels = {

        available:
          t.available,

        occupied:
          t.occupied,

        reserved:
          t.reserved,

      }


      return (
        labels[status] ||
        status
      )

    }


  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass =
    (status) => {

      if (
        status ===
        'available'
      ) {

        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'

      }


      if (
        status ===
        'occupied'
      ) {

        return 'bg-rose-500/10 text-rose-600 dark:text-rose-300'

      }


      if (
        status ===
        'reserved'
      ) {

        return 'bg-amber-500/10 text-amber-600 dark:text-amber-300'

      }


      return 'bg-slate-500/10 text-slate-600 dark:text-slate-300'

    }
  //====================================================
  //  FULTER BY STATUS
  //====================================================
    const [statusFilter,setStatusFilter] = useState('all')
    const filteredTables = useMemo(() => {
        // const search = searchTerm.trim().toLowerCase()
    
        return tables.filter((table) => {
          // STATUS FILTER
          const matchesStatus =
            statusFilter === 'all' ||
            table.status === statusFilter
    
          // // SEARCH FILTER
          // const matchesSearch =
          //   !search ||
          //   String(meal.name || '')
          //     .toLowerCase()
          //     .includes(search)
    
          return matchesStatus
          //  && matchesSearch
        })
      }, [tables, statusFilter])
  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="text-slate-900 dark:text-slate-100">

      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-2xl font-semibold">
            {t.tables}
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t.tablesDescription}
          </p>

        </div>

        {/* REFRESH */}
        <div className="flex gap-2">

          <button
            type="button"
            onClick={handleRefresh}
            disabled={
              loading ||
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
              {t.refresh}
            </span>

          </button>
            {/* SELECT STATUS */}
            <select
                value={
                  statusFilter
                }
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="h-11   rounded-2xl border border-slate-200 bg-white px-2 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-500"
              > 
                <option value="all">
                  {t.statusAll}
                </option>

                <option value="available">
                  {t.available}
                </option>available reserved

                <option value="reserved">
                  {t.reserved}
                </option>  
              </select>

          {/*  DELETE ALL */}
          {tables.length > 0 && (

            <button
              type="button"
              onClick={handleDeleteAll}
              disabled={deletingAll}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-950/50"
            >

              <Trash2
                size={17}
                className={
                  deletingAll
                    ? 'animate-pulse'
                    : ''
                }
              />

              <span className="hidden sm:inline">

                {deletingAll
                  ? t.deletingAll
                  : t.deleteAll}

              </span>

            </button>

          )}

          {/* ADD  */}
          <button
            type="button"
            onClick={handleOpenBulkAdd}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 text-sm font-semibold text-white transition hover:bg-sky-600"
          >

            <Plus size={18} />

            {t.addTable}

          </button>

        </div>

      </div>


      {/* ERROR */}

      {error && (

        <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">

          {error}

        </div>

      )}


      {/* LOADING */}

      {loading ? (

        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" />

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {t.loading || 'Loading...'}
          </p>

        </div>

      ) : tables.length === 0 ? (

        <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-card dark:border-slate-800 dark:bg-slate-900">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-500">

            <QrCode size={30} />

          </div>

          <h2 className="mt-5 text-xl font-semibold">
            {t.noTables}
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t.noTablesDescription}
          </p>

          <button
            type="button"
            onClick={handleOpenBulkAdd}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600"
          >

            <Plus size={18} />

            {t.addTable}

          </button>

        </div>

      ) : (

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

          {filteredTables.map(
            (table) => (

              <div
                key={table.id}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card transition-colors dark:border-slate-800 dark:bg-slate-900"
              >

                <div className="flex items-start justify-between gap-3">

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">

                      <span className="text-lg font-bold">
                        {table.number}
                      </span>

                    </div>

                    <div className="min-w-0">

                      {/* <h2 className="font-semibold text-slate-900 dark:text-slate-100">

                        {table.name ||
                          `${t.table} ${table.number}`}

                      </h2> */}

                      <p className="text-xs text-slate-500 dark:text-slate-400">

                        {t.tableNumber}: {table.number}

                      </p>

                    </div>

                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(table.status)}`}
                  >

                    {getStatusLabel(
                      table.status
                    )}

                  </span>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    handleOpenQr(table)
                  }
                  className="mt-6 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-sky-300 hover:bg-sky-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-800 dark:hover:bg-slate-900"
                >

                  <div className="flex items-center gap-3">

                    <QrCode
                      size={22}
                      className="shrink-0 text-slate-500"
                    />

                    <div className="min-w-0">

                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {t.qrToken}
                      </p>

                      <p className="mt-1 truncate font-mono text-xs text-slate-700 dark:text-slate-300">
                        {table.qr_token || '—'}
                      </p>

                    </div>

                  </div>

                </button>


                <div className="mt-5 flex gap-2">

                  {/* <button
                    type="button"
                    onClick={() =>
                      handleEdit(table)
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >

                    <Pencil size={16} />

                    {t.editTable}

                  </button> */}

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(table)
                    }
                    className='disabled:cursor-not-allowed disabled:opacity-50 flex h-11 w-80 mx-auto items-center justify-center gap-2 rounded-2xl border border-rose-200  text-rose-600 transition hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-950/50'
                    aria-label={t.deleteTable}
                    disabled={deleting === table.id}
                   >
                   <Trash2 size={17} /> 
                   {deleting === table.id ? t.deletingTable : t.deleteTable || 'Delete Table'} 
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      )}


      {/* BULK ADD MODAL */}

      {bulkOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-semibold">
                  {t.bulkAddTitle}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {t.bulkAddDescription}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setBulkOpen(false)
                }
                className="text-xl text-slate-400  mb-20 hover:text-slate-700 dark:hover:text-slate-200"
                aria-label={t.close}
              >
                ✕
              </button>

            </div>


            {bulkError && (

              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">

                {bulkError}

              </div>

            )}


            <div className="mt-6">

              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">

                {t.tableCount}

              </label>

              <input
                type="number"
                min="1"
                value={bulkCount}
                onChange={(e) =>
                  setBulkCount(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                placeholder={
                  t.tableCountPlaceholder
                }
              />

            </div>


            <div className="mt-7 flex justify-end gap-3">

              <button
                type="button"
                onClick={() =>
                  setBulkOpen(false)
                }
                disabled={bulkSaving}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >

                {t.cancel}

              </button>

              <button
                type="button"
                disabled={bulkSaving}
                onClick={handleBulkSave}
                className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {bulkSaving
                  ? t.saving
                  : t.addTable}

              </button>

            </div>

          </div>

        </div>

      )}


      {/* EDIT MODAL */}
{/* 
      {open && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-semibold">
                  {t.editTable}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {t.tableFormDescription}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                className="text-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                aria-label={t.close}
              >
                ✕
              </button>

            </div>


            <div className="mt-6 space-y-5">

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t.tableNumber}
                </label>

                <input
                  type="number"
                  min="1"
                  value={form.number}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      number:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  placeholder="1"
                />

              </div> */}


              {/* <div>

                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t.tableName}
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  placeholder={`${t.table} ${form.number || '1'}`}
                />

              </div> */}


              {/* <div> */}

                {/* <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t.status}
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >

                  <option value="available">
                    {t.available}
                  </option>

                  <option value="occupied">
                    {t.occupied}
                  </option>

                  <option value="reserved">
                    {t.reserved}
                  </option>

                </select>

              </div>

            </div> */}


            {/* <div className="mt-7 flex justify-end gap-3">

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                disabled={saving}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >

                {t.cancel}

              </button>

              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {saving
                  ? t.saving
                  : t.saveChanges}

              </button>

            </div>

          </div>

        </div>

      )} */}


      {/* QR MODAL */}

      {qrTable && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

          <div className="w-full max-w-sm rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-semibold">

                  {qrTable.name ||
                    `${t.table} ${qrTable.number}`}

                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {t.viewQrCode}
                </p>

              </div>

              <button
                type="button"
                onClick={handleCloseQr}
                className="text-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                aria-label={t.close}
              >
                ✕
              </button>

            </div>


            <div className="mt-6 flex justify-center">

              {getQrImageUrl(qrTable) ? (

                <img
                  src={getQrImageUrl(qrTable)}
                  alt={`QR - ${
                    qrTable.name ||
                    qrTable.number
                  }`}
                  className="h-56 w-56 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-700"
                />

              ) : (

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">

                  {restaurantSlug
                    ? (
                      t.qrTokenMissing ||
                      'QR token is missing.'
                    )
                    : (
                      t.restaurantNotFound ||
                      'Restaurant not found.'
                    )}

                </div>

              )}

            </div>


            <div className="mt-5">

              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                {t.menuUrl}
              </label>

              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950">

                <p className="min-w-0 flex-1 truncate font-mono text-xs text-slate-700 dark:text-slate-300">

                  {getMenuUrl(qrTable) ||
                    '—'}

                </p>

              </div>

            </div>


            <div className="mt-7 flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={() =>
                  handleCopyMenuUrl(
                    qrTable
                  )
                }
                disabled={
                  !getMenuUrl(qrTable)
                }
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >

                {copied
                  ? t.copied
                  : t.copyMenuUrl}

              </button>


              <button
                type="button"
                onClick={() =>
                  handleDownloadQr(
                    qrTable
                  )
                }
                disabled={
                  !getQrImageUrl(
                    qrTable
                  )
                }
                className="flex-1 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {t.downloadQRCode}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}


export default TablesPage