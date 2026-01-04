import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import api from '../services/api'
import Modal from '../components/common/Modal'
import Toast from '../components/common/Toast'
import ScrollReveal from '../components/common/ScrollReveal'

// Sidebar Component
const Sidebar = () => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { alerts } = useSocket()

  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: '📊' },
    { path: '/dashboard/request-blood', label: 'Request Blood', icon: '🩸' },
    { path: '/dashboard/donate', label: 'Donate Blood', icon: '💉' },
    { path: '/dashboard/history', label: 'History', icon: '📋' },
    { path: '/dashboard/alerts', label: 'Alerts', icon: '🔔', badge: alerts.length },
    { path: '/dashboard/nearby', label: 'Nearby', icon: '📍' },
    { path: '/dashboard/profile', label: 'Profile', icon: '👤' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="w-64 bg-gradient-to-br from-white to-rose-50/30 border-r border-gray-100 min-h-screen p-4 fixed left-0 top-0 shadow-lg">
      <Link to="/" className="flex items-center gap-2 mb-8 px-2 group">
        <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2c0 0-6 7.5-6 12a6 6 0 0 0 12 0c0-4.5-6-12-6-12z" />
          </svg>
        </div>
        <span className="text-xl font-bold gradient-text">BloodLink</span>
      </Link>

      <div className="mb-6 px-2 py-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100">
        <p className="text-rose-600 text-sm font-medium">Welcome back,</p>
        <p className="font-bold text-gray-900 truncate">{user?.name}</p>
        <p className="text-xs text-gray-500 mt-1">Blood Group: <span className="gradient-text font-semibold">{user?.blood_group}</span></p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${location.pathname === item.path
              ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-pink-500/30 scale-105'
              : 'text-gray-600 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:text-rose-700'
              }`}
          >
            <span>{item.icon}</span>
            <span className="font-medium">{item.label}</span>
            {item.badge > 0 && (
              <span className={`ml-auto ${location.pathname === item.path ? 'bg-white text-rose-600' : 'bg-red-500 text-white'} text-xs px-2 py-1 rounded-full font-semibold animate-pulse`}>
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 mt-8 text-gray-500 hover:text-gray-700 hover:bg-red-50 rounded-xl transition-all duration-300 w-full group"
      >
        <span>🚪</span>
        <span className="font-medium">Logout</span>
      </button>
    </aside>
  )
}

// Overview Section
const Overview = () => {
  const { user } = useAuth()
  const { alerts } = useSocket()
  const [stats, setStats] = useState({ donations: 0, requests: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/users/history')
        setStats({
          donations: response.data.donations.length,
          requests: response.data.requests.length
        })
      } catch (error) {
        console.log('Failed to fetch stats')
      }
    }
    fetchStats()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold gradient-text mb-2">Dashboard Overview</h1>
      <p className="text-gray-600 mb-8">Track your blood donation journey</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ScrollReveal animation="slide-up" delay={0}>
          <div className="dashboard-card group hover:scale-105">
            <div className="stat-card-icon bg-gradient-to-br from-rose-100 to-pink-100 text-rose-600 group-hover:scale-110 transition-transform">
              🩸
            </div>
            <div className="text-3xl font-bold gradient-text mb-1">{stats.donations}</div>
            <div className="text-gray-600 font-medium">Donations Made</div>
            <div className="mt-3 text-xs text-rose-600 font-semibold">Lives Saved ❤️</div>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="slide-up" delay={100}>
          <div className="dashboard-card group hover:scale-105">
            <div className="stat-card-icon bg-gradient-to-br from-sky-100 to-cyan-100 text-sky-600 group-hover:scale-110 transition-transform">
              📋
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.requests}</div>
            <div className="text-gray-600 font-medium">Blood Requests</div>
            <div className="mt-3 text-xs text-sky-600 font-semibold">Active Requests</div>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="slide-up" delay={200}>
          <div className="dashboard-card group hover:scale-105">
            <div className="stat-card-icon bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600 group-hover:scale-110 transition-transform">
              🔔
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{alerts.length}</div>
            <div className="text-gray-600 font-medium">Active Alerts</div>
            <div className="mt-3 text-xs text-amber-600 font-semibold">Nearby Requests</div>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal animation="fade-in" delay={300}>
        <div className="dashboard-card gradient-bg-card border-rose-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">👤</span> Your Profile
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100">
              <span className="text-gray-600 text-sm">Blood Group</span>
              <div className="text-2xl font-bold gradient-text mt-1">{user?.blood_group || 'Not set'}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-gray-600 text-sm">Email</span>
              <div className="text-gray-900 font-semibold mt-1 truncate text-sm">{user?.email}</div>
            </div>
            {user?.latitude && user?.longitude && (
              <div className="col-span-2 p-3 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-xl border border-sky-100">
                <span className="text-gray-600 text-sm flex items-center gap-1">
                  <span>📍</span> Location Coordinates
                </span>
                <div className="text-gray-900 font-mono text-sm mt-1">
                  {parseFloat(user.latitude).toFixed(4)}, {parseFloat(user.longitude).toFixed(4)}
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>

      {alerts.length > 0 && (
        <ScrollReveal animation="slide-up" delay={400}>
          <div className="dashboard-card mt-6 border-rose-200 bg-gradient-to-br from-red-50 to-rose-50">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              <span className="gradient-text">Recent Alerts</span>
            </h2>
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert, index) => (
                <div key={alert.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-rose-100 hover:shadow-lg transition-shadow">
                  <div>
                    <span className="text-2xl font-bold gradient-text">{alert.blood_group}</span>
                    <span className="text-gray-500 ml-2 font-medium">needed urgently</span>
                    <p className="text-sm text-gray-500 mt-1">📍 {alert.address}</p>
                  </div>
                  <Link to="/dashboard/alerts" className="btn-action text-sm py-2 px-5">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}
    </div>
  )
}

// Request Blood Section
const RequestBlood = () => {
  const [formData, setFormData] = useState({
    blood_group: '',
    units_needed: 1,
    address: '',
    latitude: '',
    longitude: ''
  })
  const [loading, setLoading] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)
  const [toast, setToast] = useState(null)

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setToast({ type: 'error', message: 'Geolocation is not supported by your browser' })
      return
    }

    setGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(15),
          longitude: position.coords.longitude.toFixed(15)
        }))
        setGettingLocation(false)
        setToast({ type: 'success', message: 'Location captured successfully' })
      },
      (error) => {
        setGettingLocation(false)
        setToast({ type: 'error', message: 'Unable to get location. Please enter manually.' })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.latitude || !formData.longitude) {
      setToast({ type: 'error', message: 'Location is required. Please allow location access or enter manually.' })
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/blood-requests', formData)
      setToast({ type: 'success', message: `Request created! ${response.data.alertsSent} donors notified.` })
      setFormData({ blood_group: '', units_needed: 1, address: '', latitude: '', longitude: '' })
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.error || 'Failed to create request' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <img
          src="/images/request_blood_illustration.png"
          alt="Request Blood"
          className="w-40 h-40 object-contain animate-float rounded-2xl flex-shrink-0"
        />
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-1">Request Blood</h1>
          <p className="text-gray-600">Create a blood request to notify nearby donors</p>
        </div>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="dashboard-card max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group Needed</label>
            <select
              value={formData.blood_group}
              onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Units Needed</label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.units_needed}
              onChange={(e) => setFormData({ ...formData, units_needed: parseInt(e.target.value) })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location / Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input-field resize-none"
              rows="3"
              placeholder="Enter the address where blood is needed"
              required
            />
          </div>

          {/* Location Coordinates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Location (Donors within 35km will be notified)
            </label>

            <button
              type="button"
              onClick={handleGetLocation}
              disabled={gettingLocation}
              className="w-full mb-3 py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {gettingLocation ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Getting location...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Get Request Location
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="input-field text-sm"
                  placeholder="e.g., 12.9716"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="input-field text-sm"
                  placeholder="e.g., 77.5946"
                  required
                />
              </div>
            </div>

            {formData.latitude && formData.longitude && (
              <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Location set: {parseFloat(formData.latitude).toFixed(4)}, {parseFloat(formData.longitude).toFixed(4)}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating Request...' : 'Request Blood'}
          </button>
        </form>
      </div>
    </div>
  )
}

// Donate Blood Section
const DonateBlood = () => {
  const { alerts } = useSocket()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const handleAccept = async (requestId) => {
    setLoading(true)
    try {
      await api.put(`/blood-requests/${requestId}/accept`)
      setToast({ type: 'success', message: 'Thank you for accepting! Contact the requester.' })
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.error || 'Failed to accept request' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold gradient-text mb-2">Donate Blood</h1>
      <p className="text-gray-600 mb-6">Accept blood requests from people nearby who need your help</p>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {alerts.length === 0 ? (
        <div className="card text-center py-12">
          <img src="/images/empty_state_success.png" alt="No requests" className="w-40 h-40 mx-auto mb-4 animate-float rounded-2xl" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Requests</h3>
          <p className="text-gray-500">There are no blood requests in your area right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="card flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold text-red-600">{alert.blood_group}</span>
                  <span className="bg-red-50 text-red-600 px-2 py-1 rounded-lg text-sm">
                    {alert.units_needed} unit(s)
                  </span>
                </div>
                <p className="text-gray-600">{alert.address}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {new Date(alert.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleAccept(alert.id)}
                disabled={loading}
                className="btn-primary"
              >
                Accept
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// History Section
const History = () => {
  const [history, setHistory] = useState({ donations: [], requests: [] })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('donations')

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/users/history')
        setHistory(response.data)
      } catch (error) {
        console.log('Failed to fetch history')
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold gradient-text mb-2">History</h1>
      <p className="text-gray-600 mb-6">View your donation and request history</p>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('donations')}
          className={`px-6 py-3 rounded-xl transition-all duration-300 font-semibold ${activeTab === 'donations' ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-pink-500/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          Donations ({history.donations.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-3 rounded-xl transition-all duration-300 font-semibold ${activeTab === 'requests' ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-pink-500/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          Requests ({history.requests.length})
        </button>
      </div>

      {activeTab === 'donations' && (
        <div className="space-y-4">
          {history.donations.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-500">No donations yet</p>
            </div>
          ) : (
            history.donations.map((donation) => (
              <div key={donation.id} className="card flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-red-600">{donation.blood_group}</span>
                  <span className="text-gray-500 ml-2">- {donation.units} unit(s)</span>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(donation.donated_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-green-600 font-medium">✓ Completed</span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-4">
          {history.requests.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-500">No requests yet</p>
            </div>
          ) : (
            history.requests.map((request) => (
              <div key={request.id} className="card flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-red-600">{request.blood_group}</span>
                  <span className="text-gray-500 ml-2">- {request.units_needed} unit(s)</span>
                  <p className="text-gray-400 text-sm mt-1">{request.address}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${request.status === 'active' ? 'bg-yellow-50 text-yellow-600' :
                  request.status === 'fulfilled' ? 'bg-green-50 text-green-600' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                  {request.status}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// Alerts Section
const Alerts = () => {
  const { alerts } = useSocket()
  const [allAlerts, setAllAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await api.get('/blood-requests/alerts')
        setAllAlerts(response.data)
      } catch (error) {
        console.log('Failed to fetch alerts')
      } finally {
        setLoading(false)
      }
    }
    fetchAlerts()
  }, [alerts])

  const handleAccept = async (requestId) => {
    try {
      await api.put(`/blood-requests/${requestId}/accept`)
      setToast({ type: 'success', message: 'Request accepted! Thank you for helping.' })
      setAllAlerts(prev => prev.filter(a => a.id !== requestId))
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.error || 'Failed to accept' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold gradient-text mb-2">Blood Request Alerts</h1>
      <p className="text-gray-600 mb-6">Active blood requests within 35km of your location</p>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {allAlerts.length === 0 ? (
        <div className="card text-center py-12">
          <img src="/images/alert_notification.png" alt="No alerts" className="w-40 h-40 mx-auto mb-4 animate-float rounded-2xl" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Clear!</h3>
          <p className="text-gray-500">No blood requests in your area right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allAlerts.map((alert) => (
            <div key={alert.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-red-600">{alert.blood_group}</span>
                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg font-medium">
                      {alert.units_needed} unit(s) needed
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{alert.address}</p>
                  <p className="text-sm text-gray-400">
                    Posted {new Date(alert.created_at).toLocaleString()}
                  </p>
                  {alert.distance && (
                    <p className="text-sm text-gray-400">
                      {(alert.distance / 1000).toFixed(1)} km away
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleAccept(alert.id)}
                  className="btn-primary"
                >
                  Accept & Help
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Nearby Section
const Nearby = () => {
  const [data, setData] = useState({ campaigns: [], bloodBanks: [] })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('campaigns')

  useEffect(() => {
    const fetchNearby = async () => {
      try {
        const response = await api.get('/users/nearby')
        setData(response.data)
      } catch (error) {
        console.log('Failed to fetch nearby')
      } finally {
        setLoading(false)
      }
    }
    fetchNearby()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold gradient-text mb-2">Nearby</h1>
      <p className="text-gray-600 mb-6">Discover campaigns and blood banks near you</p>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-6 py-3 rounded-xl transition-all duration-300 font-semibold ${activeTab === 'campaigns' ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-pink-500/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          Campaigns ({data.campaigns.length})
        </button>
        <button
          onClick={() => setActiveTab('bloodBanks')}
          className={`px-6 py-3 rounded-xl transition-all duration-300 font-semibold ${activeTab === 'bloodBanks' ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-pink-500/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          Blood Banks ({data.bloodBanks.length})
        </button>
      </div>

      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          {data.campaigns.length === 0 ? (
            <div className="card text-center py-8">
              <img src="/images/nearby_donors_map.png" alt="No campaigns" className="w-32 h-32 mx-auto mb-4 opacity-60 rounded-2xl" />
              <p className="text-gray-500">No active campaigns nearby</p>
            </div>
          ) : (
            data.campaigns.map((campaign) => (
              <div key={campaign.id} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{campaign.title}</h3>
                <p className="text-gray-500 mb-2">by {campaign.ngo_name}</p>
                <p className="text-sm text-gray-400">{campaign.address}</p>
                <p className="text-sm text-gray-400">
                  {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'bloodBanks' && (
        <div className="space-y-4">
          {data.bloodBanks.length === 0 ? (
            <div className="card text-center py-8">
              <img src="/images/nearby_donors_map.png" alt="No blood banks" className="w-32 h-32 mx-auto mb-4 opacity-60 rounded-2xl" />
              <p className="text-gray-500">No blood banks nearby</p>
            </div>
          ) : (
            data.bloodBanks.map((bank) => (
              <div key={bank.id} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{bank.name}</h3>
                <p className="text-gray-500">{bank.address}</p>
                <p className="text-sm text-gray-400">{bank.contact_info}</p>
                {bank.distance && (
                  <p className="text-sm text-red-600 mt-2 font-medium">
                    {(bank.distance / 1000).toFixed(1)} km away
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// Profile Section
const Profile = () => {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    blood_group: '',
    address: '',
    latitude: '',
    longitude: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile')
        setFormData({
          name: response.data.name || '',
          phone: response.data.phone || '',
          gender: response.data.gender || '',
          blood_group: response.data.blood_group || '',
          address: response.data.address || '',
          latitude: response.data.latitude || '',
          longitude: response.data.longitude || ''
        })
      } catch (error) {
        console.log('Failed to fetch profile')
      }
    }
    fetchProfile()
  }, [])

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setToast({ type: 'error', message: 'Geolocation is not supported by your browser' })
      return
    }

    setGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(15),
          longitude: position.coords.longitude.toFixed(15)
        }))
        setGettingLocation(false)
        setToast({ type: 'success', message: 'Location updated successfully' })
      },
      (error) => {
        setGettingLocation(false)
        setToast({ type: 'error', message: 'Unable to get location. Please enter manually.' })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.put('/users/profile', formData)
      updateUser(response.data.user)
      setToast({ type: 'success', message: 'Profile updated successfully' })
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to update profile' })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ type: 'error', message: 'Passwords do not match' })
      return
    }

    setLoading(true)
    try {
      await api.put('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      setToast({ type: 'success', message: 'Password changed successfully' })
      setShowPasswordModal(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.error || 'Failed to change password' })
    } finally {
      setLoading(false)
    }
  }

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="card max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={user?.email}
              className="input-field bg-gray-50"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="input-field"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
              <select
                value={formData.blood_group}
                onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                className="input-field"
              >
                <option value="">Select</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input-field resize-none"
              rows="2"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (For blood request matching)
            </label>

            <button
              type="button"
              onClick={handleGetLocation}
              disabled={gettingLocation}
              className="w-full mb-3 py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {gettingLocation ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Getting location...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Update My Location
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="input-field text-sm"
                  placeholder="e.g., 12.9716"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="input-field text-sm"
                  placeholder="e.g., 77.5946"
                />
              </div>
            </div>

            {formData.latitude && formData.longitude && (
              <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Location: {parseFloat(formData.latitude).toFixed(4)}, {parseFloat(formData.longitude).toFixed(4)}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="btn-secondary"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </Modal>
    </div>
  )
}

// Main Dashboard Component
const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="request-blood" element={<RequestBlood />} />
          <Route path="donate" element={<DonateBlood />} />
          <Route path="history" element={<History />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="nearby" element={<Nearby />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  )
}

export default UserDashboard
