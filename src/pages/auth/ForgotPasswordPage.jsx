
import { useState } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../../api/axiosClient'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    try {
      const response = await axiosClient.post(
        '/auth/forgot-password',
        { email }
      )

      setMessage(
        response.data.message 
      )
    } catch (err) {
      setError(
        err?.response?.data?.message  
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
            Forgot password?
          </h1>

          <p className="text-sm leading-6 text-muted">
            Enter your email address and we will send you
            instructions to reset your password.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-ink"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="manager@example.com"
              className="h-12 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          {message && (
            <p
              role="status"
              className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700"
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

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>

          <p className="text-center text-sm text-muted">
            Remember your password?{' '}
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

export default ForgotPasswordPage
