import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm]     = useState({ email: '', password: '', rememberMe: false })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPw, setShowPw]     = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email.trim())  e.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address.'
    if (!form.password)      e.password = 'Password is required.'
    return e
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setServerError('')
    try {
      const res = await loginUser({ email: form.email, password: form.password, rememberMe: form.rememberMe })
      login(res.data, form.rememberMe)
      navigate('/dashboard')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="subtitle">Sign in to your account</p>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <div className="input-wrap">
              <input
                id="email" name="email" type="email"
                placeholder="john@example.com"
                value={form.email} onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
            </div>
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <input
                id="password" name="password"
                type={showPw ? 'text' : 'password'}
                placeholder="Your password"
                value={form.password} onChange={handleChange}
                className={errors.password ? 'error' : ''}
                style={{ paddingRight: '2.5rem' }}
              />
              <button type="button" className="toggle-pw" onClick={() => setShowPw(p => !p)}
                aria-label="Toggle password visibility">
                {showPw ? 'hide' : 'show'}
              </button>
            </div>
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          {/* Remember Me */}
          <label className="remember-row">
            <input type="checkbox" name="rememberMe" checked={form.rememberMe} onChange={handleChange} />
            Remember me for 7 days
          </label>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}
