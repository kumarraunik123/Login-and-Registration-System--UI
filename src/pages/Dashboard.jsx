import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUserProfile } from '../services/api'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    getUserProfile()
      .then(res => setProfile(res.data))
      .catch(() => setError('Could not load profile data.'))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="dashboard-wrapper">
      {/* Navbar */}
      <nav className="dashboard-nav">
        <span className="logo">AuthApp</span>
        <button className="btn-logout" onClick={handleLogout}>Sign out</button>
      </nav>

      <div className="dashboard-content">
        {loading && <div className="spinner" />}

        {!loading && error && <div className="alert alert-error">{error}</div>}

        {!loading && profile && (
          <>
            <div className="welcome-card">
              <span className="wave"></span>
              <h2>Welcome back, {profile.name}!</h2>
              <p style={{ color: '#718096', marginTop: '0.4rem' }}>
                Here's a summary of your account.
              </p>

              <div className="info-grid">
                <div className="info-chip">
                  <p className="chip-label">Full Name</p>
                  <p className="chip-value">{profile.name}</p>
                </div>
                <div className="info-chip">
                  <p className="chip-label">Email</p>
                  <p className="chip-value" style={{ wordBreak: 'break-all' }}>{profile.email}</p>
                </div>
                <div className="info-chip">
                  <p className="chip-label">Role</p>
                  <p className="chip-value">
                    <span className="role-badge">{profile.role}</span>
                  </p>
                </div>
                <div className="info-chip">
                  <p className="chip-label">Member Since</p>
                  <p className="chip-value">{formatDate(profile.createdAt)}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
