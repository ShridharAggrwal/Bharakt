import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import api from '../services/api'
import Modal from '../components/common/Modal'
import Toast from '../components/common/Toast'
import DashboardLayout from '../components/layout/DashboardLayout'
import {
  BarChart3,
  Droplets,
  Syringe,
  ClipboardList,
  Bell,
  MapPin,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Calendar,
  Building2,
  Heart
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

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

  const statCards = [
    { label: "Donations Made", value: stats.donations, icon: Droplets, gradient: "from-rose-500 to-red-600", bgLight: "bg-rose-50", textColor: "text-rose-600", desc: "Lives Saved ❤️" },
    { label: "Blood Requests", value: stats.requests, icon: ClipboardList, gradient: "from-blue-500 to-blue-600", bgLight: "bg-blue-50", textColor: "text-blue-600", desc: "Active Requests" },
    { label: "Active Alerts", value: alerts.length, icon: Bell, gradient: "from-amber-500 to-orange-600", bgLight: "bg-amber-50", textColor: "text-amber-600", desc: "Nearby Requests" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-slate-900 mb-2">Dashboard Overview</h1>
        <p className="text-slate-500">Track your blood donation journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-white/60 rounded-[1.5rem] p-6 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-500 hover:-translate-y-1"
          >
            {/* Gradient accent bar */}
            <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", stat.gradient)} />

            {/* Icon with gradient background */}
            <div className="flex items-start justify-between mb-5">
              <div className={cn("p-3.5 rounded-2xl bg-gradient-to-br shadow-lg", stat.gradient)}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={cn("text-xs font-bold px-2.5 py-1 rounded-full", stat.bgLight, stat.textColor)}>
                #{index + 1}
              </div>
            </div>

            {/* Stats content */}
            <div className="space-y-1">
              <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
              <p className="text-slate-600 font-semibold">{stat.label}</p>
              <p className={cn("text-xs font-medium pt-2 flex items-center gap-1.5", stat.textColor)}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                {stat.desc}
              </p>
            </div>

            {/* Decorative gradient blob */}
            <div className={cn("absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br blur-2xl group-hover:opacity-20 transition-opacity", stat.gradient)} />
          </div>
        ))}
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-[1.5rem] p-6 shadow-lg shadow-slate-200/50">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-slate-400" /> Your Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-100">
            <span className="text-slate-500 text-sm">Blood Group</span>
            <div className="text-2xl font-bold text-rose-600 mt-1">{user?.blood_group || 'Not set'}</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-100">
            <span className="text-slate-500 text-sm">Email</span>
            <div className="text-slate-900 font-medium mt-1 truncate">{user?.email}</div>
          </div>
          {user?.latitude && user?.longitude && (
            <div className="col-span-1 md:col-span-2 p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-100">
              <span className="text-slate-500 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Location Coordinates
              </span>
              <div className="text-slate-900 font-mono text-sm mt-1">
                {parseFloat(user.latitude).toFixed(4)}, {parseFloat(user.longitude).toFixed(4)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white/80 backdrop-blur-sm border border-white/60 rounded-[1.5rem] p-8 shadow-lg shadow-slate-200/50">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <p className="text-slate-500 mb-6">Make a difference today - donate blood or help someone in need.</p>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/dashboard/donate" className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-slate-100 hover:shadow-md transition-all group">
              <Droplets className="w-6 h-6 text-rose-500 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold text-slate-900">Donate Blood</p>
              <p className="text-xs text-slate-500">Register a donation</p>
            </Link>
            <Link to="/dashboard/nearby" className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-slate-100 hover:shadow-md transition-all group">
              <MapPin className="w-6 h-6 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold text-slate-900">Find Nearby</p>
              <p className="text-xs text-slate-500">Blood banks & NGOs</p>
            </Link>
          </div>
        </div>

        <Link to="/dashboard/request" className="bg-gradient-to-br from-red-500 to-rose-600 rounded-[1.5rem] p-8 text-white shadow-xl shadow-red-200/50 hover:shadow-2xl hover:shadow-red-300/50 transition-all group">
          <Syringe className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-xl font-bold mb-2">Request Blood</h2>
          <p className="text-white/80 text-sm">Create an urgent request to notify nearby donors</p>
        </Link>
      </div>

      {alerts.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-[1.5rem] p-6 shadow-lg shadow-slate-200/50">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
            Recent Alerts
          </h2>
          <div className="space-y-4">
            {alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-rose-200">
                    {alert.blood_group}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-900 font-medium">Needed Urgently</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      {alert.address}
                    </div>
                  </div>
                </div>
                <Link to="/dashboard/alerts" className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700 rounded-lg transition-colors text-sm font-medium shadow-lg shadow-rose-200">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
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
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Request Blood</h1>
        <p className="text-slate-500">Create a blood request to notify nearby donors</p>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Blood Group</label>
              <select
                value={formData.blood_group}
                onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                required
              >
                <option value="">Select Type</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Units Needed</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.units_needed}
                onChange={(e) => setFormData({ ...formData, units_needed: parseInt(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Location / Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none h-24"
              placeholder="Enter the address where blood is needed"
              required
            />
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Request Location</label>
                <p className="text-xs text-slate-500 mt-1">Donors within 35km will be notified</p>
              </div>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={gettingLocation}
                className="px-4 py-2 bg-white border border-slate-200 text-blue-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                {gettingLocation ? <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div> : <MapPin className="w-4 h-4" />}
                Get Location
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-600 text-sm focus:outline-none focus:border-red-500"
                  placeholder="e.g., 12.9716"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-600 text-sm focus:outline-none focus:border-red-500"
                  placeholder="e.g., 77.5946"
                  required
                />
              </div>
            </div>

            {formData.latitude && formData.longitude && (
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Location set successfully
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-200 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Creating Request...' : 'Broadcast Request'}
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Donate Blood</h1>
        <p className="text-slate-500">Accept blood requests from people nearby who need your help</p>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {alerts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No Active Requests</h3>
          <p className="text-slate-500">There are no blood requests in your area right now.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4 w-full">
                <div className="w-14 h-14 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-rose-500">{alert.blood_group}</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-lg font-bold text-slate-800">Blood Request</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold">
                      {alert.units_needed} unit(s)
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-1">{alert.address}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(alert.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleAccept(alert.id)}
                disabled={loading}
                className="w-full md:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-md shadow-red-100 transition-all whitespace-nowrap"
              >
                Accept & Help
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

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">History</h1>
        <p className="text-slate-500">View your donation and request history</p>
      </div>

      <div className="flex gap-4 p-1 bg-white border border-slate-200 rounded-xl w-fit shadow-sm">
        <button
          onClick={() => setActiveTab('donations')}
          className={`px-6 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${activeTab === 'donations' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          Donations ({history.donations.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${activeTab === 'requests' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          Requests ({history.requests.length})
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'donations' ? (
          history.donations.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No donations yet</div>
          ) : (
            history.donations.map((donation) => (
              <div key={donation.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-bold text-rose-600">{donation.blood_group}</span>
                    <span className="text-slate-500 text-sm">• {donation.units} unit(s)</span>
                  </div>
                  <p className="text-sm text-slate-500">{new Date(donation.donated_at).toLocaleDateString()}</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                </div>
              </div>
            ))
          )
        ) : (
          history.requests.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No requests yet</div>
          ) : (
            history.requests.map((request) => (
              <div key={request.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-bold text-rose-600">{request.blood_group}</span>
                    <span className="text-slate-500 text-sm">• {request.units_needed} unit(s)</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-1">{request.address}</p>
                  <p className="text-xs text-slate-400">{new Date(request.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${request.status === 'active' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  request.status === 'fulfilled' ? 'bg-green-50 text-green-700 border-green-200' :
                    'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
            ))
          )
        )}
      </div>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Blood Request Alerts</h1>
        <p className="text-slate-500">Active blood requests within 35km of your location</p>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {allAlerts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">All Clear!</h3>
          <p className="text-slate-500">No blood requests in your area right now.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {allAlerts.map((alert) => (
            <div key={alert.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-orange-50 text-orange-500">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold text-slate-800">{alert.blood_group} Needed</span>
                      <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-semibold">
                        {alert.units_needed} unit(s)
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-1">{alert.address}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(alert.created_at).toLocaleString()}</span>
                      {alert.distance && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {(alert.distance / 1000).toFixed(1)} km away</span>}
                    </div>
                  </div>
                </div>
                <button onClick={() => handleAccept(alert.id)} className="w-full md:w-auto px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md shadow-red-200 transition-all">
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

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Nearby</h1>
        <p className="text-slate-500">Discover campaigns and blood banks near you</p>
      </div>

      <div className="flex gap-4 p-1 bg-white border border-slate-200 rounded-xl w-fit shadow-sm">
        <button onClick={() => setActiveTab('campaigns')} className={`px-6 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${activeTab === 'campaigns' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
          Campaigns ({data.campaigns.length})
        </button>
        <button onClick={() => setActiveTab('bloodBanks')} className={`px-6 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${activeTab === 'bloodBanks' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
          Blood Banks ({data.bloodBanks.length})
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'campaigns' ? (
          data.campaigns.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No active campaigns nearby</div>
          ) : (
            data.campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-slate-800">{campaign.title}</h3>
                      {campaign.health_checkup_available && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 text-xs font-medium rounded-lg flex items-center gap-1">
                          ⚕️ Free Health Checkup
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 mb-2 text-sm">by {campaign.ngo_name}</p>
                    <div className="space-y-1 text-sm text-slate-400">
                      <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {campaign.address}</p>
                      <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          data.bloodBanks.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No blood banks nearby</div>
          ) : (
            data.bloodBanks.map((bank) => (
              <div key={bank.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{bank.name}</h3>
                    <p className="text-slate-500 text-sm mb-1">{bank.address}</p>
                    <p className="text-slate-400 text-xs">{bank.contact_info}</p>
                    {bank.distance && (
                      <p className="text-sm text-rose-500 mt-2 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {(bank.distance / 1000).toFixed(1)} km away
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </div>
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

  const InputField = ({ label, ...props }) => (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium placeholder:text-slate-400" {...props} />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Profile</h1>
        <p className="text-slate-500">Manage your personal information</p>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Personal Information</h2>
            <form id="profileForm" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <InputField label="Full Name" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <InputField label="Email Address" type="email" value={user?.email} disabled className="bg-slate-100 text-slate-500 cursor-not-allowed" />
                <InputField label="Phone Number" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Blood Group</label>
                  <select
                    value={formData.blood_group}
                    onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                  >
                    <option value="">Select Type</option>
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none h-24 font-medium"
                />
              </div>
            </form>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Location Settings</h2>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={gettingLocation}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
              >
                {gettingLocation ? 'Updating...' : <><MapPin className="w-4 h-4" /> Update from GPS</>}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <InputField label="Latitude" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} placeholder="0.000000" />
              <InputField label="Longitude" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} placeholder="0.000000" />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6">
            <h3 className="font-bold text-slate-800 mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button
                type="submit"
                form="profileForm"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-black text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-slate-200"
              >
                {loading ? 'Saving Changes...' : 'Save Profile'}
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="w-full bg-white border border-slate-200 text-slate-700 font-medium py-3 rounded-xl hover:bg-slate-50 transition-all"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <InputField label="Current Password" type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required />
          <InputField label="New Password" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required />
          <InputField label="Confirm New Password" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-200"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

const UserDashboard = () => {
  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: BarChart3 },
    { path: '/dashboard/donate', label: 'Donate Blood', icon: Droplets },
    { path: '/dashboard/request', label: 'Request Blood', icon: Syringe },
    { path: '/dashboard/history', label: 'History', icon: ClipboardList },
    { path: '/dashboard/alerts', label: 'Alerts', icon: Bell },
    { path: '/dashboard/nearby', label: 'Nearby', icon: MapPin },
    { path: '/dashboard/profile', label: 'Profile', icon: User },
  ]

  return (
    <DashboardLayout navItems={navItems}>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/donate" element={<DonateBlood />} />
        <Route path="/request" element={<RequestBlood />} />
        <Route path="/history" element={<History />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/nearby" element={<Nearby />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </DashboardLayout>
  )
}

export default UserDashboard
