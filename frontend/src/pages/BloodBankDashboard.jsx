import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import api from '../services/api'
import Modal from '../components/common/Modal'
import Toast from '../components/common/Toast'
import DashboardLayout from '../components/layout/DashboardLayout'
import {
  BarChart3,
  Droplets,
  ClipboardList,
  Megaphone,
  User,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

// Overview Section with color-coded blood stock
const Overview = () => {
  const { alerts } = useSocket()
  const [stats, setStats] = useState({ totalUnits: 0, pendingRequests: 0 })
  const [stock, setStock] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, stockRes] = await Promise.all([api.get('/blood-bank/stats'), api.get('/blood-bank/stock')])
        setStats(statsRes.data)
        setStock(stockRes.data)
      } catch (error) { console.log('Failed to fetch data') }
    }
    fetchData()
  }, [])

  const getStockColor = (units) => {
    if (units <= 10) return { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-500', label: 'Low', indicator: 'bg-red-500' }
    if (units <= 25) return { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-500', label: 'Medium', indicator: 'bg-orange-500' }
    return { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-500', label: 'Sufficient', indicator: 'bg-emerald-500' }
  }

  const statCards = [
    { label: "Total Units", value: stats.totalUnits, icon: Droplets, gradient: "from-rose-500 to-red-600", bgLight: "bg-rose-50", textColor: "text-rose-600" },
    { label: "Nearby Requests", value: stats.pendingRequests, icon: ClipboardList, gradient: "from-blue-500 to-blue-600", bgLight: "bg-blue-50", textColor: "text-blue-600" },
    { label: "Active Alerts", value: alerts.length, icon: Megaphone, gradient: "from-amber-500 to-orange-600", bgLight: "bg-amber-50", textColor: "text-amber-600" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-slate-900 mb-2">Blood Bank Dashboard</h1>
        <p className="text-slate-500">Manage your blood inventory and requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-white/60 rounded-[1.5rem] p-6 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-500 hover:-translate-y-1"
          >
            <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", stat.gradient)} />
            <div className="flex items-start justify-between mb-5">
              <div className={cn("p-3.5 rounded-2xl bg-gradient-to-br shadow-lg", stat.gradient)}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={cn("text-xs font-bold px-2.5 py-1 rounded-full", stat.bgLight, stat.textColor)}>
                #{index + 1}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
              <p className="text-slate-600 font-semibold">{stat.label}</p>
            </div>
            <div className={cn("absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br blur-2xl group-hover:opacity-20 transition-opacity", stat.gradient)} />
          </div>
        ))}
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-[1.5rem] p-6 shadow-lg shadow-slate-200/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-rose-500" />
            Blood Stock Overview
          </h2>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2 h-2 rounded-full bg-red-500"></span>Low</span>
            <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2 h-2 rounded-full bg-orange-500"></span>Medium</span>
            <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Sufficient</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {stock.map((item) => {
            const style = getStockColor(item.units_available)
            return (
              <motion.div
                whileHover={{ scale: 1.05 }}
                key={item.blood_group}
                className={cn(`relative overflow-hidden p-4 rounded-xl border text-center group transition-all`, style.bg, style.border)}
              >
                <div className={cn(`absolute top-0 right-0 p-1.5 rounded-bl-lg opacity-20 group-hover:opacity-100 transition-opacity`, style.indicator)}></div>
                <div className="text-2xl font-bold text-slate-800 mb-1">{item.blood_group}</div>
                <div className={cn('text-xl font-bold mb-1', style.text)}>{item.units_available}</div>
                <div className="text-xs text-slate-500">units</div>
              </motion.div>
            )
          })}
        </div>

        {stock.some(s => s.units_available <= 10) && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-slate-800 font-medium text-sm">Critical Stock Levels</h4>
              <p className="text-slate-500 text-sm mt-1">Some blood types are running low. Consider requesting donations immediately.</p>
            </div>
          </div>
        )}
      </div>

      {alerts.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
            Recent Blood Requests
          </h2>
          <div className="space-y-4">
            {alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center font-bold text-xl">
                    {alert.blood_group}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-900 font-medium">{alert.units_needed} units needed</span>
                      <span className="text-xs bg-white text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full">{alert.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="w-3 h-3" />
                      {alert.address}
                    </div>
                  </div>
                </div>
                <Link to="/blood-bank/requests" className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm rounded-lg transition-colors font-medium">
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Blood Stock Management Section
const BloodStock = () => {
  const [stock, setStock] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [editingGroup, setEditingGroup] = useState(null)
  const [newUnits, setNewUnits] = useState(0)

  const getStockColor = (units) => {
    if (units <= 10) return { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-500' }
    if (units <= 25) return { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-500' }
    return { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-500' }
  }

  const fetchStock = async () => { try { const response = await api.get('/blood-bank/stock'); setStock(response.data) } catch (error) { console.log('Failed to fetch stock') } finally { setLoading(false) } }
  useEffect(() => { fetchStock() }, [])

  const handleUpdate = async (bloodGroup) => {
    try {
      await api.put('/blood-bank/stock', { blood_group: bloodGroup, units_available: newUnits })
      setToast({ type: 'success', message: 'Stock updated successfully' })
      setEditingGroup(null)
      fetchStock()
    } catch (error) { setToast({ type: 'error', message: 'Failed to update stock' }) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Blood Stock Management</h1>
        <p className="text-slate-500">Manage your blood inventory levels</p>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stock.map((item) => {
          const style = getStockColor(item.units_available)
          const isEditing = editingGroup === item.blood_group

          return (
            <motion.div
              layout
              key={item.blood_group}
              className={cn(`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300`, style.bg, style.border)}
            >
              {isEditing ? (
                <div className="space-y-4 animate-in fade-in zoom-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-slate-800">{item.blood_group}</span>
                    <button onClick={() => setEditingGroup(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Units Available</label>
                    <input
                      type="number"
                      min="0"
                      value={newUnits}
                      onChange={(e) => setNewUnits(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
                      autoFocus
                    />
                  </div>
                  <button onClick={() => handleUpdate(item.blood_group)} className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium transition-colors shadow-sm">
                    Save Changes
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => { setEditingGroup(item.blood_group); setNewUnits(item.units_available) }}
                  className="cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold text-slate-800">{item.blood_group}</span>
                    <div className="p-2 rounded-lg bg-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                  </div>
                  <div className={cn(`text-4xl font-bold mb-2`, style.text)}>{item.units_available}</div>
                  <div className="text-sm text-slate-500">units available</div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// View Requests Section
const ViewRequests = () => {
  const { alerts } = useSocket()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const fetchRequests = async () => { try { const response = await api.get('/blood-bank/requests'); setRequests(response.data) } catch (error) { console.log('Failed to fetch requests') } finally { setLoading(false) } }
  useEffect(() => { fetchRequests() }, [alerts])

  const handleAccept = async (requestId) => {
    try { await api.put(`/blood-requests/${requestId}/accept`); setToast({ type: 'success', message: 'Request accepted!' }); fetchRequests() }
    catch (error) { setToast({ type: 'error', message: error.response?.data?.error || 'Failed to accept' }) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Blood Requests</h1>
        <p className="text-slate-500">Blood requests within 35km of your location</p>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No Active Requests</h3>
          <p className="text-slate-500">No blood requests in your area right now.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center flex-shrink-0 border border-rose-100">
                    <span className="text-2xl font-bold text-rose-600">{request.blood_group}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl font-bold text-slate-800">Blood Request</span>
                      <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold">
                        {request.units_needed} unit(s)
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-600 flex items-center gap-2 font-medium">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {request.address}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(request.created_at).toLocaleDateString()}
                        </span>
                        {request.distance && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {(request.distance / 1000).toFixed(1)} km away
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleAccept(request.id)}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium shadow-md shadow-rose-200 transition-all transform active:scale-95"
                >
                  Fulfill Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Request Blood Section
const RequestBlood = () => {
  const [formData, setFormData] = useState({ blood_group: '', units_needed: 1, address: '' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const response = await api.post('/blood-requests', formData)
      setToast({ type: 'success', message: `Request created! ${response.data.alertsSent} donors notified.` })
      setFormData({ blood_group: '', units_needed: 1, address: '' })
    } catch (error) { setToast({ type: 'error', message: error.response?.data?.error || 'Failed to create request' }) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Request Blood</h1>
        <p className="text-slate-500">Running low? Create a request to notify donors in your area.</p>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Blood Group</label>
              <select
                value={formData.blood_group}
                onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium appearance-none"
                required
              >
                <option value="">Select Type</option>
                {bloodGroups.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Units Needed</label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.units_needed}
                onChange={(e) => setFormData({ ...formData, units_needed: parseInt(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Blood Bank Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium resize-none h-32"
              placeholder="Enter your blood bank address..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-200 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Broadcasting Request...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Megaphone className="w-5 h-5" />
                Broadcast Request
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

// Profile Section
const BloodBankProfile = () => {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({ name: '', contact_info: '', address: '', latitude: '', longitude: '' })
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [toast, setToast] = useState(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/blood-bank/profile')
        setFormData({ name: response.data.name || '', contact_info: response.data.contact_info || '', address: response.data.address || '', latitude: response.data.lat || '', longitude: response.data.lng || '' })
      } catch (error) { console.log('Failed to fetch profile') }
    }
    fetchProfile()
  }, [])

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setToast({ type: 'error', message: 'Geolocation is not supported by your browser' })
      return
    }
    setLoadingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({ ...formData, latitude: position.coords.latitude.toFixed(15), longitude: position.coords.longitude.toFixed(15) })
        setLoadingLocation(false)
        setToast({ type: 'success', message: 'Location updated successfully' })
      },
      (error) => {
        setLoadingLocation(false)
        let errorMessage = 'Failed to get location'
        if (error.code === error.PERMISSION_DENIED) errorMessage = 'Location permission denied. Please enable location access.'
        else if (error.code === error.POSITION_UNAVAILABLE) errorMessage = 'Location information unavailable.'
        setToast({ type: 'error', message: errorMessage })
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.put('/blood-bank/profile', { ...formData, latitude: formData.latitude ? parseFloat(formData.latitude) : null, longitude: formData.longitude ? parseFloat(formData.longitude) : null })
      if (response.data.bloodBank) updateUser(response.data.bloodBank)
      setToast({ type: 'success', message: 'Profile updated successfully' })
    }
    catch (error) { setToast({ type: 'error', message: 'Failed to update profile' }) }
    finally { setLoading(false) }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) { setToast({ type: 'error', message: 'Passwords do not match' }); return }
    setLoading(true)
    try {
      await api.put('/blood-bank/change-password', { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword })
      setToast({ type: 'success', message: 'Password changed successfully' })
      setShowPasswordModal(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) { setToast({ type: 'error', message: error.response?.data?.error || 'Failed to change password' }) }
    finally { setLoading(false) }
  }

  const InputField = ({ label, ...props }) => (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium placeholder:text-slate-400" {...props} />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Blood Bank Profile</h1>
        <p className="text-slate-500">Manage your institution's details and settings</p>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Institution Details</h2>
            <form id="profileForm" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Blood Bank Name" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <InputField label="Email Address" type="email" value={user?.email} disabled className="bg-slate-100 text-slate-500 cursor-not-allowed" />
                <InputField label="Contact Info" type="text" value={formData.contact_info} onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })} placeholder="Phone number" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Address</label>
                <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium resize-none h-24" />
              </div>
            </form>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-slate-800 font-bold">Location Coordinates</h3>
                <p className="text-sm text-slate-500">Used to calculate distances for blood requests</p>
              </div>
              <button type="button" onClick={handleGetLocation} disabled={loadingLocation} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                {loadingLocation ? <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div> : <MapPin className="w-4 h-4" />}
                Get Current Location
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Latitude" type="number" step="any" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} placeholder="e.g., 12.97159" />
              <InputField label="Longitude" type="number" step="any" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} placeholder="e.g., 77.59462" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6">
            <h3 className="font-bold text-slate-800 mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button type="submit" form="profileForm" disabled={loading} className="w-full bg-slate-900 hover:bg-black text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-slate-200">
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setShowPasswordModal(true)} className="w-full bg-white border border-slate-200 text-slate-700 font-medium py-3 rounded-xl hover:bg-slate-50 transition-all">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Change Password">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <InputField label="Current Password" type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required />
          <InputField label="New Password" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required />
          <InputField label="Confirm New Password" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-200">
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

// Main Dashboard Component
const BloodBankDashboard = () => {
  const { alerts } = useSocket()

  const navItems = [
    { path: '/blood-bank', label: 'Overview', icon: BarChart3 },
    { path: '/blood-bank/stock', label: 'Blood Stock', icon: Droplets },
    { path: '/blood-bank/requests', label: 'View Requests', icon: ClipboardList, badge: alerts.length },
    { path: '/blood-bank/request-blood', label: 'Request Blood', icon: Megaphone },
    { path: '/blood-bank/profile', label: 'Profile', icon: User },
  ]

  return (
    <DashboardLayout navItems={navItems}>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="stock" element={<BloodStock />} />
        <Route path="requests" element={<ViewRequests />} />
        <Route path="request-blood" element={<RequestBlood />} />
        <Route path="profile" element={<BloodBankProfile />} />
      </Routes>
    </DashboardLayout>
  )
}

export default BloodBankDashboard
