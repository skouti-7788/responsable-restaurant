// import { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
// import { Activity, BarChart2, Layers, ShoppingBag } from 'lucide-react'
// import axiosClient from '../../api/axiosClient'
// import translations from '../../i18n/translations'

// const DashboardPage = () => {
//   const { language } = useSelector((state) => state.ui)
//   const t = translations[language]
//   const [stats, setStats] = useState([
//     { labelKey: 'totalMeals', value: '0', icon: Layers, color: 'bg-cyan-500/10 text-cyan-300' },
//     { labelKey: 'totalCategories', value: '0', icon: BarChart2, color: 'bg-violet-500/10 text-violet-300' },
//     { labelKey: 'totalOrders', value: '0', icon: ShoppingBag, color: 'bg-amber-500/10 text-amber-300' },
//     { labelKey: 'menuViews', value: '0', icon: Activity, color: 'bg-sky-500/10 text-sky-300' },
//   ])

//   useEffect(() => {
//     const loadDashboardData = async () => {
//       try {
//         const restaurantsResponse = await axiosClient.get('/restaurants')
//         const restaurant = restaurantsResponse.data.data?.[0] || restaurantsResponse.data?.[0] || null
//         if (!restaurant) return

//         const [categoriesResponse, mealsResponse, ordersResponse] = await Promise.all([
//           axiosClient.get(`/restaurants/${restaurant.id}/categories`),
//           axiosClient.get(`/restaurants/${restaurant.id}/meals`),
//           axiosClient.get(`/restaurants/${restaurant.id}/orders`),
//         ])

//         const categories = categoriesResponse.data.data || categoriesResponse.data || []
//         const meals = mealsResponse.data.data || mealsResponse.data || []
//         const orders = ordersResponse.data.data || ordersResponse.data || []

//         setStats([
//           { labelKey: 'totalMeals', value: String(meals.length), icon: Layers, color: 'bg-cyan-500/10 text-cyan-300' },
//           { labelKey: 'totalCategories', value: String(categories.length), icon: BarChart2, color: 'bg-violet-500/10 text-violet-300' },
//           { labelKey: 'totalOrders', value: String(orders.length), icon: ShoppingBag, color: 'bg-amber-500/10 text-amber-300' },
//           { labelKey: 'menuViews', value: '0', icon: Activity, color: 'bg-sky-500/10 text-sky-300' },
//         ])
//       } catch (err) {
//         console.error(err)
//       }
//     }

//     loadDashboardData()
//   }, [])

// const popularMeals = [
//   { name: 'Grilled Salmon', percent: 92 },
//   { name: 'Beef Burger', percent: 79 },
//   { name: 'Falafel Bowl', percent: 65 },
//   { name: 'Vegan Pizza', percent: 53 },
// ]

// const activities = [
//   { event: 'New order received', time: '2m ago' },
//   { event: 'Eggplant salad added', time: '1h ago' },
//   { event: 'Menu cover updated', time: '5h ago' },
//   { event: 'Profile information saved', time: 'Yesterday' },
// ]

//   return (
//     <div className="space-y-8">
//       <section className="grid gap-5 xl:grid-cols-4">
//         {stats.map((item) => {
//           const Icon = item.icon
//           return (
//             <article key={item.labelKey} className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-card">
//               <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-3xl ${item.color}`}>
//                 <Icon className="h-5 w-5" />
//               </div>
//               <p className="text-sm text-slate-400">{t[item.labelKey]}</p>
//               <h2 className="mt-3 text-3xl font-semibold text-slate-100">{item.value}</h2>
//             </article>
//           )
//         })}
//       </section>

//       <section className="grid gap-5 xl:grid-cols-2">
//         <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-card">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-slate-400">{t.popularMeals}</p>
//               <h2 className="mt-2 text-2xl font-semibold text-slate-100">Weekly performance</h2>
//             </div>
//             <span className="rounded-2xl bg-slate-800 px-3 py-2 text-sm text-slate-300">Live</span>
//           </div>

//           <div className="mt-8 space-y-5">
//             {popularMeals.map((meal) => (
//               <div key={meal.name} className="space-y-3">
//                 <div className="flex items-center justify-between text-sm text-slate-200">
//                   <span>{meal.name}</span>
//                   <span>{meal.percent}%</span>
//                 </div>
//                 <div className="h-3 overflow-hidden rounded-full bg-slate-800">
//                   <div className="h-full rounded-full bg-sky-400" style={{ width: `${meal.percent}%` }} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-card">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-slate-400">{t.recentActivity}</p>
//               <h2 className="mt-2 text-2xl font-semibold text-slate-100">Updates stream</h2>
//             </div>
//           </div>

//           <div className="mt-8 space-y-4">
//             {activities.map((activity) => (
//               <div key={activity.event} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
//                 <p className="text-sm text-slate-100">{activity.event}</p>
//                 <p className="mt-2 text-xs text-slate-500">{activity.time}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }

// export default DashboardPage
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Activity, BarChart2, Layers, ShoppingBag } from 'lucide-react'
import axiosClient from '../../api/axiosClient'
import translations from '../../i18n/translations'

const DashboardPage = () => {
  const { language } = useSelector((state) => state.ui)
  const t = translations[language]

  const [stats, setStats] = useState([
    {
      labelKey: 'totalMeals',
      value: '0',
      icon: Layers,
      color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300',
    },
    {
      labelKey: 'totalCategories',
      value: '0',
      icon: BarChart2,
      color: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
    },
    {
      labelKey: 'totalOrders',
      value: '0',
      icon: ShoppingBag,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-300',
    },
    {
      labelKey: 'menuViews',
      value: '0',
      icon: Activity,
      color: 'bg-sky-500/10 text-sky-600 dark:text-sky-300',
    },
  ])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const restaurantsResponse = await axiosClient.get('/restaurants')

        const restaurant =
          restaurantsResponse.data.data?.[0] ||
          restaurantsResponse.data?.[0] ||
          null

        if (!restaurant) return

        const [
          categoriesResponse,
          mealsResponse,
          ordersResponse,
        ] = await Promise.all([
          axiosClient.get(
            `/restaurants/${restaurant.id}/categories`
          ),
          axiosClient.get(
            `/restaurants/${restaurant.id}/meals`
          ),
          axiosClient.get(
            `/restaurants/${restaurant.id}/orders`
          ),
        ])

        const categories =
          categoriesResponse.data.data ||
          categoriesResponse.data ||
          []

        const meals =
          mealsResponse.data.data ||
          mealsResponse.data ||
          []

        const orders =
          ordersResponse.data.data ||
          ordersResponse.data ||
          []

        setStats([
          {
            labelKey: 'totalMeals',
            value: String(meals.length),
            icon: Layers,
            color:
              'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300',
          },
          {
            labelKey: 'totalCategories',
            value: String(categories.length),
            icon: BarChart2,
            color:
              'bg-violet-500/10 text-violet-600 dark:text-violet-300',
          },
          {
            labelKey: 'totalOrders',
            value: String(orders.length),
            icon: ShoppingBag,
            color:
              'bg-amber-500/10 text-amber-600 dark:text-amber-300',
          },
          {
            labelKey: 'menuViews',
            value: '0',
            icon: Activity,
            color:
              'bg-sky-500/10 text-sky-600 dark:text-sky-300',
          },
        ])
      } catch (err) {
        console.error(err)
      }
    }

    loadDashboardData()
  }, [])

  const popularMeals = [
    { name: 'Grilled Salmon', percent: 92 },
    { name: 'Beef Burger', percent: 79 },
    { name: 'Falafel Bowl', percent: 65 },
    { name: 'Vegan Pizza', percent: 53 },
  ]

  const activities = [
    { event: 'New order received', time: '2m ago' },
    { event: 'Eggplant salad added', time: '1h ago' },
    { event: 'Menu cover updated', time: '5h ago' },
    { event: 'Profile information saved', time: 'Yesterday' },
  ]

  return (
    <div className="text-slate-900 dark:text-slate-100">

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.labelKey}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card transition-colors dark:border-slate-800 dark:bg-slate-900"
            >
              <div
                className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-3xl ${item.color}`}
              >
                <Icon size={22} />
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t[item.labelKey]}
              </p>

              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                {item.value}
              </p>
            </div>
          )
        })}
      </div>

      {/* Bottom sections */}
      <section className="mt-5 grid gap-5 xl:grid-cols-2">

        {/* Popular meals */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.popularMeals}
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Weekly performance
              </h2>
            </div>

            <span className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Live
            </span>
          </div>

          <div className="mt-8 space-y-5">
            {popularMeals.map((meal) => (
              <div
                key={meal.name}
                className="space-y-3"
              >
                <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-200">
                  <span>{meal.name}</span>
                  <span>{meal.percent}%</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-sky-400"
                    style={{
                      width: `${meal.percent}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.recentActivity}
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Updates stream
              </h2>
            </div>

          </div>

          <div className="mt-8 space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.event}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-950/80"
              >
                <p className="text-sm text-slate-900 dark:text-slate-100">
                  {activity.event}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  {activity.time}
                </p>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  )
}

export default DashboardPage