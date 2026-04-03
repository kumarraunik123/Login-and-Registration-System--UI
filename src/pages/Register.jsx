import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [serverMsg, setServerMsg] = useState({ type: '', text: '' })
  const [loading, setLoading]     = useState(false)
  const [showPw, setShowPw]       = useState(false)
  const [showCpw, setShowCpw]     = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim())            e.name = 'Name is required.'
    if (!form.email.trim())           e.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address.'
    if (!form.password)               e.password = 'Password is required.'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters.'
    if (!form.confirmPassword)        e.confirmPassword = 'Please confirm your password.'
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.'
    return e
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setServerMsg({ type: '', text: '' })
    try {
      await registerUser(form)
      setServerMsg({ type: 'success', text: 'Account created! Redirecting to login…' })
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
      setServerMsg({ type: 'error', text: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1>Create account</h1>
        <p className="subtitle">Join us today — it's free</p>

        {serverMsg.text && (
          <div className={`alert alert-${serverMsg.type}`}>{serverMsg.text}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrap">
              <input
                id="name" name="name" type="text"
                placeholder="John Doe"
                value={form.name} onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
            </div>
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

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
                placeholder="Min. 6 characters"
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

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrap">
              <input
                id="confirmPassword" name="confirmPassword"
                type={showCpw ? 'text' : 'password'}
                placeholder="Repeat password"
                value={form.confirmPassword} onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
                style={{ paddingRight: '2.5rem' }}
              />
              <button type="button" className="toggle-pw" onClick={() => setShowCpw(p => !p)}
                aria-label="Toggle confirm password visibility">
                {showCpw ? 'hide' : 'show'}
              </button>
            </div>
            {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
