
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from '../../store/authSlice'
import Input from '../../components/ui/Input'
import axiosClient from '../../api/axiosClient'

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, error } = useSelector((state) => ({
    loading: state.auth.loading,
    error: state.auth.error,
  }))

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(loginStart())
    try {
      const response = await axiosClient.post('/auth/login', form)
 
      dispatch(
        loginSuccess({
          token: response.data.token,
          user: response.data.user,
        })
      )

      navigate('/')
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.email?.[0] ||
        'Unable to login'

      dispatch(loginFailure(message))
    }
  }

  return (
    <div className="min-h-screen bg-sand px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-10 shadow-[20px_20px_40px_rgba(17,39,44,0.12)] ring-1 ring-line">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-brand">
            Restaurant manager
          </p>
          <h1 className="text-3xl font-semibold text-ink">
            Login
          </h1>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            placeholder="manager@example.com"
            type="email"
          />

          <Input
            label="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            placeholder="••••••••"
            type="password"
          />

          {/* Forgot password link */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-brand transition hover:text-brand-dark hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            {error && (
              <p className="text-sm text-rose-500" role="alert">
                {error}
              </p>
            )}

            <button
              className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>

            <p className="mt-6 text-center text-sm text-muted">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-brand hover:text-brand-dark"
              >
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
