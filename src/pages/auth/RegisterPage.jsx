import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice'
import Input from '../../components/ui/Input'
import axiosClient from '../../api/axiosClient'
import translations from '../../i18n/translations'

const RegisterPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { language, loading, error } = useSelector((state) => ({
    language: state.ui.language,
    loading: state.auth.loading,
    error: state.auth.error,
  }))
  const t = translations[language] || translations.en

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
    <div className="min-h-screen bg-sand px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-10 shadow-[20px_20px_40px_rgba(17,39,44,0.12)] ring-1 ring-line">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-brand">Restaurant SaaS</p>
          <h1 className="text-3xl font-semibold text-ink">{t.register}</h1>
          <p className="text-sm text-muted">{t.registerDescription}</p>
        </div>

        <form className="grid gap-5 lg:grid-cols-2" onSubmit={handleSubmit}>
          <Input label={t.restaurantName} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Le Gourmet" />
          <Input label={t.email} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="manager@example.com" type="email" />
          <Input label={t.phone} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+123 456 7890" />
          <Input label={t.address} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="123 Main Street" />
          <Input label={t.openingHours} value={form.openingHours} onChange={(e) => setForm({ ...form, openingHours: e.target.value })} placeholder="08:00 - 23:00" />
          <Input label={t.password} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" type="password" />
          {error && <p className="col-span-full text-sm text-rose-500">{error}</p>}
          <div className="col-span-full flex flex-col gap-3 pt-2">
            <button 
            className='inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-brand px-5 text-sm font-semibold text-white   hover:bg-brand-dark' 
            type="submit"

             disabled={loading}>
              {loading ? t.creatingAccount : t.createAccount}
            </button>
            <p className="text-center text-sm text-muted">
              <Link to="/login" className="font-medium text-brand hover:text-brand-dark">
                {t.alreadyHaveAccount}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
