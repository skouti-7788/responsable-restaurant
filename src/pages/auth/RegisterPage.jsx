import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import axiosClient from '../../api/axiosClient'

const RegisterPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => ({
    language: state.ui.language,
    loading: state.auth.loading,
    error: state.auth.error,
  }))
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    openingHours: '',
    password: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(loginStart())

    try {
      const payload = {
        ...form,
        password_confirmation: form.password,
        role: 'restaurant_manager',
      }
      const response = await axiosClient.post('/auth/register', payload)
      dispatch(loginSuccess({ token: response.data.token, user: response.data.user }))
      navigate('/')
    } catch (err) {
      const message = err?.message || 'Unable to register'
      dispatch(loginFailure(message))
    }
  }
 
    
     return (
    <div className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem]  bg-white p-10 shadow-[20px_20px_40px_rgba(0,0,0,0.15)]">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-400/80">Restaurant SaaS</p>
          <h1 className="text-3xl font-semibold text-slate-600">Register new restaurant</h1>
          <p className="text-sm text-slate-400">Create your restaurant account and start managing your digital menu.</p>
        </div>

        <form className="grid gap-5 lg:grid-cols-2" onSubmit={handleSubmit}>
          <Input label= 'Restaurant name' value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Le Gourmet" />
          <Input label='Email' value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="manager@example.com" type="email" />
          <Input label='Phone' value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+123 456 7890" />
          <Input label='Address' value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="123 Main Street" />
          <Input label='Opening hours' value={form.openingHours} onChange={(e) => setForm({ ...form, openingHours: e.target.value })} placeholder="08:00 - 23:00" />
          <Input label= 'Password' value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" type="password" />
          {error && <p className="col-span-full text-sm text-rose-400">{error}</p>}
          <div className="col-span-full flex flex-col gap-3 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating account...' :  'Create account'}
            </Button>
            <p className="text-center text-sm text-slate-400">
              <Link to="/login" className="text-sky-400 hover:text-sky-300">
                Already have an account? Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
