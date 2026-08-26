// import { useSelector } from 'react-redux'
// import { useMemo } from 'react'
// import { QRCodeCanvas } from 'qrcode.react'
// import translations from '../../i18n/translations'
// import Button from '../../components/ui/Button'

// const QRCodePage = () => {
//   const { language } = useSelector((state) => state.ui)
//   const t = translations[language]
//   const menuUrl = useMemo(() => window.location.origin + '/menu', [])

//   const copyMenu = async () => {
//     await navigator.clipboard.writeText(menuUrl)
//   }

//   const downloadQRCode = () => {
//     const canvas = document.getElementById('restaurant-qr')
//     if (!canvas) return
//     const link = document.createElement('a')
//     link.download = 'restaurant-menu-qr.png'
//     link.href = canvas.toDataURL('image/png')
//     link.click()
//   }

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-2xl font-semibold text-slate-100">{t.qrCode}</h1>
//         <p className="mt-2 max-w-2xl text-sm text-slate-400">Share your digital menu with customers through a simple QR code experience.</p>
//       </div>

//       <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
//         <div className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 text-center shadow-card">
//           <div className="mx-auto mb-6 inline-flex h-72 w-72 items-center justify-center rounded-3xl bg-slate-900">
//             <QRCodeCanvas id="restaurant-qr" value={menuUrl} size={240} bgColor="#0f172a" fgColor="#38bdf8" />
//           </div>
//           <p className="text-sm text-slate-400">{menuUrl}</p>
//           <div className="mt-6 flex flex-col gap-3">
//             <Button onClick={downloadQRCode}>{t.downloadQRCode}</Button>
//             <Button variant="secondary" onClick={copyMenu}>{t.copyMenuUrl}</Button>
//           </div>
//         </div>

//         <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-card">
//           <h2 className="text-xl font-semibold text-slate-100">How it works</h2>
//           <ul className="mt-6 space-y-4 text-slate-400">
//             <li>• Create a menu link and QR code for dine-in and delivery customers.</li>
//             <li>• Scan the code to open your restaurant menu instantly.</li>
//             <li>• Use the dashboard to update menu items and availability in real time.</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default QRCodePage
 import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { QRCodeCanvas } from 'qrcode.react'

import translations from '../../i18n/translations'
import Button from '../../components/ui/Button'

import api from '../../api/axiosClient'
import {
  setRestaurant,
  setRestaurantLoading,
  setRestaurantError,
} from '../../store/restaurantSlice'

const QRCodePage = () => {
  const dispatch = useDispatch()
  
  const { language } = useSelector((state) => state.ui)

  const restaurant = useSelector(
    (state) => state.restaurant.profile
  )

  const t = translations[language]
  
  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        dispatch(setRestaurantLoading(true))

        const response = await api.get('/restaurants')

        const restaurants =
          response.data.data || response.data || []

        if (restaurants.length > 0) {
          dispatch(setRestaurant(restaurants[0]))
        }
      } catch (error) {
        console.error(
          'Failed to load restaurant:',
          error
        )

        dispatch(
          setRestaurantError(
            error.response?.data?.message ||
            'Failed to load restaurant'
          )
        )
      } finally {
        dispatch(setRestaurantLoading(false))
      }
    }

    loadRestaurant()
  }, [dispatch])

  const menuUrl = useMemo(() => {
    if (!restaurant?.slug) return ''

    return `https://menu-online.vercel.app/menu/${restaurant.slug}`
  }, [restaurant?.slug])

  const copyMenu = async () => {
    if (!menuUrl) return

    try {
      await navigator.clipboard.writeText(menuUrl)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const downloadQRCode = () => {
    const canvas = document.getElementById('restaurant-qr')

    if (!canvas) return

    const link = document.createElement('a')

    link.download = 'restaurant-menu-qr.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }
  // console.log('RESTAURANT:', restaurant)
  // console.log('MENU URL:', menuUrl)
  return (
    <div className="text-slate-900 dark:text-slate-100">

      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          {t.qrCode}
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t.qrCodeDescription}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">

        <div className="rounded-[2rem] border border-slate-200 bg-white p-4 text-center shadow-card dark:border-slate-800 dark:bg-slate-900">

          <div className="mx-auto mb-6 inline-flex h-72 w-72 items-center justify-center rounded-3xl bg-slate-100 dark:bg-slate-950">

            {menuUrl ? (
              <QRCodeCanvas
                id="restaurant-qr"
                value={menuUrl}
                size={240}
                bgColor="#ffffff"
                fgColor="#0f172a"
              />
            ) : (
              <p className="text-sm text-slate-500">
                {t.loadingRestaurant}
              </p>
            )}

          </div>

          {menuUrl && (
            <p className="break-all text-sm text-slate-500 dark:text-slate-400">
              {menuUrl}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3">

            <Button
              onClick={downloadQRCode}
              disabled={!menuUrl}
            >
              {t.downloadQRCode}
            </Button>

            <Button
              variant="secondary"
              onClick={copyMenu}
              disabled={!menuUrl}
            >
              {t.copyMenuUrl}
            </Button>

          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">

          <h2 className="text-xl font-semibold">
            {t.howItWorks}
          </h2>

          <ul className="mt-6 space-y-4 text-slate-600 dark:text-slate-400">

              <li>
                • {t.createUniqueQr}
              </li>

              <li>
                • {t.scanQrMenu}
              </li>

              <li>
                • {t.updateMealsAvailability}
              </li> 
          </ul>

        </div>

      </div>
    </div>
  )
}

export default QRCodePage