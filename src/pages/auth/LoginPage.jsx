import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import axiosClient from '../../api/axiosClient'

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const  {loading, error } = useSelector((state) => ({
    language: state.ui.language,
    loading: state.auth.loading,
    error: state.auth.error,
  }))
  
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(loginStart())

    try {
      const response = await axiosClient.post('/auth/login', form)
      const payload = {
        token: response.data.token,
        user: response.data.user,
      }
      dispatch(loginSuccess(payload))
      navigate('/')
    } catch (err) {
      const message = err?.message || err?.errors?.email?.[0] || 'Unable to login'
      dispatch(loginFailure(message))
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 sm:px-6 lg:px-8 bg-white ">
      <div className="mx-auto max-w-xl rounded-[2rem]   bg-white p-10 shadow-[20px_20px_40px_rgba(0,0,0,0.15)]">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-400/80">Restaurant manager</p>
          <h1 className="text-3xl font-semibold text-slate-600 ">Login</h1>
          {/* <p className="text-sm text-slate-400">Secure access to your Restaurant SaaS dashboard.</p> */}
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label='Email'
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="manager@example.com"
            type="email"
          />
          <Input
            label= 'Password'
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            type="password"
          />
          
     

        <div className="col-span-full flex flex-col gap-3 pt-2">
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in...' :  'Login'}
          </Button>
          <p className="mt-6 text-center text-sm text-slate-400">
            <Link to="/register" className="text-sky-400 hover:text-sky-300">
             Already have an account? Login 
            </Link>
          </p>
        </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
