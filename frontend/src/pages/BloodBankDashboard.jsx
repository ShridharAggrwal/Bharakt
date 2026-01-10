import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import api from '../services/api'
import Modal from '../components/common/Modal'
import Toast from '../components/common/Toast'
import LocationPicker from '../components/common/LocationPicker'
import DetailsModal from '../components/common/DetailsModal'
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
    if (units <= 10) return { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-600', label: 'Low', indicator: 'bg-red-500' }
    if (units <= 25) return { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600', label: 'Medium', indicator: 'bg-amber-500' }
    return { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', label: 'Good', indicator: 'bg-emerald-500' }
  }

  const statCards = [
    { label: "Total Units", value: stats.totalUnits, icon: Droplets, color: "text-rose-600", bg: "bg-rose-50", link: "/blood-bank/stock" },
    { label: "Nearby Requests", value: stats.pendingRequests, icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-50", link: "/blood-bank/requests" },
    { label: "Active Alerts", value: alerts.length, icon: Megaphone, color: "text-amber-600", bg: "bg-amber-50", link: "/blood-bank/requests" },
    { label: "Critical Stock", value: stock.filter(s => s.units_available <= 10).length, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", link: "/blood-bank/stock" },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto min-h-[calc(100vh-6rem)] lg:h-[calc(100vh-6rem)] flex flex-col">
      <div className="text-center shrink-0">
        <h1 className="text-3xl font-bold font-serif text-slate-900 mb-2">Blood Bank Dashboard</h1>
        <p className="text-slate-500">Manage your blood inventory and requests</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
        {statCards.map((stat) => (
          <Link to={stat.link} key={stat.label} className="block group">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between group-hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className={cn("p-3 rounded-xl transition-colors", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
              </div>
              <div className="mt-auto">
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Section: Stock Overview & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6 lg:grow lg:min-h-0">
        {/* Live Inventory (Col-span-2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col lg:overflow-hidden">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <h2 className="text-lg font-bold text-slate-900">Live Inventory</h2>
            <div className="flex gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-50 text-red-600 border border-red-100"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Low</span>
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Medium</span>
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Good</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:overflow-y-auto pr-2 custom-scrollbar lg:grow content-start">
            {stock.map((item) => {
              const style = getStockColor(item.units_available)

              return (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  key={item.blood_group}
                  className={cn(`relative p-4 rounded-xl border text-center transition-all`, style.bg, style.border)}
                >
                  <div className="text-xl font-bold text-slate-800 mb-1">{item.blood_group}</div>
                  <div className={cn('text-2xl font-bold mb-1', style.text)}>{item.units_available}</div>
                  <div className="text-xs text-slate-500 font-medium">units</div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions (Col-span-1) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 mb-4 shrink-0">Quick Actions</h2>
          <div className="space-y-4 grow flex flex-col justify-center">

            <Link to="/blood-bank/stock" className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-rose-50 hover:border-rose-100 transition-all group">
              <div className="p-3 bg-white text-rose-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block">Update Stock</span>
                <span className="text-xs text-slate-500">Manage Inventory</span>
              </div>
            </Link>

            <Link to="/blood-bank/requests" className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50 hover:border-blue-100 transition-all group">
              <div className="p-3 bg-white text-blue-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block">View Requests</span>
                <span className="text-xs text-slate-500">{stats.pendingRequests} Active</span>
              </div>
            </Link>

            <Link to="/blood-bank/request-blood" className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-amber-50 hover:border-amber-100 transition-all group">
              <div className="p-3 bg-white text-amber-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block">Broadcast Alert</span>
                <span className="text-xs text-slate-500">Request Donations</span>
              </div>
            </Link>

          </div>
        </div>
      </div>
    </div>
  )
}

// Single Blood Stock Card Component
const BloodStockCard = ({ item, onUpdate }) => {
  const [units, setUnits] = useState(item.units_available)
  const [loading, setLoading] = useState(false)

  // Update local state when prop changes (e.g., after refetch)
  useEffect(() => { setUnits(item.units_available) }, [item.units_available])

  const getStockColor = (u) => {
    const val = u === '' ? 0 : u
    if (val <= 10) return { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-500', ring: 'focus:ring-red-500/20', inputBorder: 'focus:border-red-500' }
    if (val <= 25) return { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-500', ring: 'focus:ring-orange-500/20', inputBorder: 'focus:border-orange-500' }
    return { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-500', ring: 'focus:ring-emerald-500/20', inputBorder: 'focus:border-emerald-500' }
  }

  const handleSave = async () => {
    if (units === '' || units < 0) return
    setLoading(true)
    await onUpdate(item.blood_group, units)
    setLoading(false)
  }

  const style = getStockColor(units)

  return (
    <motion.div
      layout
      className={cn(`relative p-6 rounded-2xl border transition-all duration-300`, style.bg, style.border)}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl font-bold text-slate-800">{item.blood_group}</span>
        <div className="p-2 rounded-lg bg-white/50">
          <Droplets className={cn("w-5 h-5", style.text)} />
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Available Units</label>
          <input
            type="number"
            min="0"
            value={units}
            onChange={(e) => setUnits(e.target.value === '' ? '' : parseInt(e.target.value))}
            className={cn(
              "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-2xl font-bold text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-4 transition-all",
              style.ring,
              style.inputBorder
            )}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading || units === '' || units === item.units_available}
          className={cn(
            "w-full py-2.5 rounded-xl font-medium transition-all shadow-sm flex items-center justify-center gap-2",
            units === item.units_available
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-black hover:shadow-md active:scale-95"
          )}
        >
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Update Stock"}
        </button>
      </div>
    </motion.div>
  )
}

// Blood Stock Management Section
const BloodStock = () => {
  const [stock, setStock] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const fetchStock = async () => { try { const response = await api.get('/blood-bank/stock'); setStock(response.data) } catch (error) { console.log('Failed to fetch stock') } finally { setLoading(false) } }
  useEffect(() => { fetchStock() }, [])

  const handleUpdate = async (bloodGroup, newUnits) => {
    try {
      await api.put('/blood-bank/stock', { blood_group: bloodGroup, units_available: newUnits })
      setToast({ type: 'success', message: `${bloodGroup} stock updated to ${newUnits} units` })
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
        {stock.map((item) => (
          <BloodStockCard key={item.blood_group} item={item} onUpdate={handleUpdate} />
        ))}
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
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [accepting, setAccepting] = useState(false)

  const formatDistance = (meters) => {
    if (!meters) return ''
    if (meters < 1000) return `${Math.round(meters)}m`
    return `${(meters / 1000).toFixed(1)}km`
  }

  const fetchRequests = async () => { try { const response = await api.get('/blood-bank/requests'); setRequests(response.data) } catch (error) { console.log('Failed to fetch requests') } finally { setLoading(false) } }
  useEffect(() => { fetchRequests() }, [alerts])

  const handleAccept = async (requestId) => {
    setAccepting(true)
    try {
      await api.put(`/blood-requests/${requestId}/accept`)
      setToast({ type: 'success', message: 'Request accepted!' })
      setShowModal(false)
      fetchRequests()
    }
    catch (error) { setToast({ type: 'error', message: error.response?.data?.error || 'Failed to accept' }) }
    finally { setAccepting(false) }
  }

  const openDirections = (request) => {
    if (request.latitude && request.longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${request.latitude},${request.longitude}`, '_blank')
    }
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
            <div key={request.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-rose-200 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-200">
                    <span className="text-xl font-bold text-white">{request.blood_group}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="text-lg font-bold text-slate-800">Blood Request</span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold">
                        {request.units_needed} unit(s)
                      </span>
                      {request.distance && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                          {formatDistance(request.distance)} away
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-sm mb-2 line-clamp-1">{request.address}</p>
                    {request.requester && (
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        {request.requester.name && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {request.requester.name}
                          </span>
                        )}
                        {request.requester.phone && (
                          <a href={`tel:${request.requester.phone}`} className="text-blue-600 hover:text-blue-700">
                            Call
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openDirections(request)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5"
                  >
                    <MapPin className="w-4 h-4" />
                    Directions
                  </button>
                  <button
                    onClick={() => { setSelectedRequest(request); setShowModal(true) }}
                    className="px-4 py-2.5 bg-white border border-slate-200 hover:border-rose-300 text-slate-700 rounded-xl text-sm font-medium transition-all"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleAccept(request.id)}
                    disabled={accepting}
                    className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-xl font-medium shadow-md shadow-red-100 transition-all disabled:opacity-50"
                  >
                    Fulfill
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type="request"
        data={selectedRequest}
        onAccept={handleAccept}
        loading={accepting}
      />
    </div>
  )
}

// Request Blood Section
const RequestBlood = () => {
  const [formData, setFormData] = useState({ blood_group: '', units_needed: 1, address: '' })
  const [profileCoords, setProfileCoords] = useState({ lat: null, lng: null })
  const [loading, setLoading] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [toast, setToast] = useState(null)
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  // Fetch blood bank profile to get coordinates
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/blood-bank/profile')
        setProfileCoords({
          lat: response.data.lat,
          lng: response.data.lng
        })
        // Auto-fill address from profile if available
        if (response.data.address) {
          setFormData(prev => ({ ...prev, address: response.data.address }))
        }
      } catch (error) {
        console.log('Failed to fetch profile for coordinates')
      } finally {
        setLoadingProfile(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate that we have profile coordinates
    if (!profileCoords.lat || !profileCoords.lng) {
      setToast({ type: 'error', message: 'Profile location not set. Please update your profile with coordinates first.' })
      return
    }

    setLoading(true)
    try {
      // Include profile coordinates in the request
      const requestData = {
        ...formData,
        latitude: parseFloat(profileCoords.lat),
        longitude: parseFloat(profileCoords.lng)
      }
      const response = await api.post('/blood-requests', requestData)
      setToast({ type: 'success', message: `Request created! ${response.data.alertsSent} donors notified.` })
      setFormData({ blood_group: '', units_needed: 1, address: formData.address })
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

      {/* Warning if no profile coordinates */}
      {!loadingProfile && (!profileCoords.lat || !profileCoords.lng) && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Profile Location Required</p>
            <p className="text-xs text-amber-600 mt-1">Please update your profile with location coordinates before creating blood requests.</p>
            <Link to="/blood-bank/profile" className="text-xs text-amber-700 hover:text-amber-800 font-semibold mt-2 inline-block">
              Go to Profile →
            </Link>
          </div>
        </div>
      )}

      {/* Location info banner */}
      {!loadingProfile && profileCoords.lat && profileCoords.lng && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span className="text-sm text-emerald-700">Using your blood bank's saved location for this request</span>
        </div>
      )}

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
            disabled={loading || loadingProfile || !profileCoords.lat || !profileCoords.lng}
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

  const handleLocationChange = (coords) => {
    setFormData(prev => ({
      ...prev,
      latitude: coords.lat.toString(),
      longitude: coords.lng.toString()
    }))
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

  const currentCoords = formData.latitude && formData.longitude ? {
    lat: parseFloat(formData.latitude),
    lng: parseFloat(formData.longitude)
  } : null

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
            <div className="mb-4">
              <h3 className="text-slate-800 font-bold">Location</h3>
              <p className="text-sm text-slate-500">Click on the map or search to set your blood bank location</p>
            </div>
            <LocationPicker
              value={currentCoords}
              onChange={handleLocationChange}
              showProfileButton={false}
              placeholder="Search for your blood bank location..."
            />
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
    <DashboardLayout navItems={navItems} portalName="Blood Bank Portal">
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
