
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import { getRestaurantOrders } from '../../data/dataOrders'
import { getCurrentRestaurantId } from '../../utils/restaurantCache'
import { fetchOrdersSuccess } from '../../store/orderSlice'

const SidebarLayout = () => {
  const dispatch = useDispatch()

  const language = useSelector(
    (state) => state.ui.language
  )

  // Language direction
  useEffect(() => {
    document.documentElement.dir =
      language === 'ar' ? 'rtl' : 'ltr'

    document.documentElement.lang = language
  }, [language])

  // Automatic order updates
  useEffect(() => {
    let checking = false
    let cancelled = false

    const checkOrders = async () => {
      if (checking || cancelled) return

      const restaurantId = getCurrentRestaurantId()

      // Wait until the restaurant ID is available
      if (!restaurantId) return

      checking = true

      try {
        const freshOrders = await getRestaurantOrders(
          restaurantId
        )

        if (cancelled) return

        dispatch(
          fetchOrdersSuccess(
            Array.isArray(freshOrders) ? freshOrders : []
          )
        )
      } catch (error) {
        console.error(
          'Automatic orders refresh error:',
          error
        )
      } finally {
        checking = false
      }
    }

    // Fetch immediately
    checkOrders()

    // Check for new orders every 5 seconds
    const intervalId = setInterval(checkOrders, 5000)

    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
  }, [dispatch])

  return (
    <div className="min-h-screen bg-sand dark:bg-[#0f1d22]">
      <Sidebar />

      <div className="min-w-0 ml-20 rtl:ml-0 rtl:mr-20">
        <Navbar />

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default SidebarLayout
