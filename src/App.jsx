import { BrowserRouter, Routes, Route, 
  
 } from 'react-router-dom'
import ProtectedRoute from './components/layout/ProtectedRoute'
import SidebarLayout from './components/layout/SidebarLayout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import ProfilePage from './pages/profile/ProfilePage'
import CategoriesPage from './pages/categories/CategoriesPage'
import MealsPage from './pages/meals/MealsPage'
import OrdersPage from './pages/orders/OrdersPage'
import QRCodePage from './pages/qr/QRCodePage'
import NotFoundPage from './pages/NotFoundPage'
import TablesPage from './pages/Tables/TablesPage'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
function App() {
    const {
        language,
        // theme,
      } = useSelector(
        (state) => state.ui
      )
  
     
   useEffect(() => {
      document.documentElement.dir =
        language === 'ar'
          ? 'rtl'
          : 'ltr'
  
      document.documentElement.lang =
        language
    }, [language])
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SidebarLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="meals" element={<MealsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="tables" element={<TablesPage />} /> 
          <Route path="qr-code" element={<QRCodePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
