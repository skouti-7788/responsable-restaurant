
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axiosClient from '../../api/axiosClient'

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token') || ''
  const initialEmail = searchParams.get('email') || ''

  const [form, setForm] = useState({
    email: initialEmail,
    password: '',
    password_confirmation: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!token || !form.email) {
      setError(
        'The reset link is invalid. Please request a new link.'
      )
      return
    }

    if (form.password.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }

    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const response = await axiosClient.post(
        '/auth/reset-password',
        {
          token,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
        }
      )

      setMessage(
        response.data.message || 'Password reset successfully.'
      )
      setSuccess(true)

      setForm((previous) => ({
        ...previous,
        password: '',
        password_confirmation: '',
      }))
    } catch (err) {
      const errors = err?.response?.data?.errors

      setError(
        errors?.email?.[0] ||
          errors?.token?.[0] ||
          errors?.password?.[0] ||
          err?.response?.data?.message ||
          'Unable to reset the password. The link may have expired.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sand px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-8 shadow-[20px_20px_40px_rgba(17,39,44,0.12)] ring-1 ring-line sm:p-10">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-brand">
            Restaurant manager
          </p>

          <h1 className="text-3xl font-semibold text-ink">
            Reset password
          </h1>

          <p className="text-sm leading-6 text-muted">
            Choose a new password for your account.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="reset-email"
              className="block text-sm font-medium text-ink"
            >
              Email address
            </label>

            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="manager@example.com"
              className="h-12 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-ink"
            >
              New password
            </label>

            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              placeholder="At least 8 characters"
              className="h-12 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-ink"
            >
              Confirm new password
            </label>

            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={form.password_confirmation}
              onChange={(e) =>
                setForm({
                  ...form,
                  password_confirmation: e.target.value,
                })
              }
              placeholder="Repeat your new password"
              className="h-12 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          {message && (
            <p
              role="status"
              className={`rounded-xl border p-3 text-sm ${
                success
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-rose-200 bg-rose-50 text-rose-600'
              }`}
            >
              {message}
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600"
            >
              {error}
            </p>
          )}

          {!success && (
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          )}

          <p className="text-center text-sm text-muted">
            <Link
              to="/login"
              className="font-medium text-brand hover:text-brand-dark hover:underline"
            >
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage
