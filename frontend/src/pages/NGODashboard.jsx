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
  Calendar,
  Plus,
  Bell,
  Droplets,
  User,
  Users,
  Target,
  Heart,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

// Overview Section
const Overview = () => {
  const { alerts } = useSocket()
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalCampaigns: 0,
    volunteerCount: 0,
    campaignsCount: 0,
    bloodRequestsAccepted: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/ngo/stats')
        setStats(response.data)
      } catch (error) {
        console.log('Failed to fetch stats')
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    { label: "Active Campaigns", value: stats.activeCampaigns, icon: Calendar, gradient: "from-emerald-500 to-green-600", bgLight: "bg-emerald-50", textColor: "text-emerald-600", desc: "Ongoing Events" },
    { label: "Total Campaigns", value: stats.campaignsCount, icon: Target, gradient: "from-rose-500 to-red-600", bgLight: "bg-rose-50", textColor: "text-rose-600", desc: "Events Created" },
    { label: "Requests Fulfilled", value: stats.bloodRequestsAccepted, icon: Heart, gradient: "from-purple-500 to-purple-600", bgLight: "bg-purple-50", textColor: "text-purple-600", desc: "Lives Saved" },
    { label: "Active Alerts", value: alerts.length, icon: Bell, gradient: "from-sky-500 to-blue-600", bgLight: "bg-sky-50", textColor: "text-sky-600", desc: "Nearby Requests" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-slate-900 mb-2">NGO Dashboard</h1>
        <p className="text-slate-500">Manage your campaigns and help save lives</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <p className={cn("text-xs font-medium pt-2 flex items-center gap-1.5", stat.textColor)}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                {stat.desc}
              </p>
            </div>
            <div className={cn("absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br blur-2xl group-hover:opacity-20 transition-opacity", stat.gradient)} />
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link to="/ngo/create-campaign" className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-[1.5rem] p-6 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-rose-200 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg group-hover:text-rose-600 transition-colors">Create Campaign</h3>
              <p className="text-slate-500 text-sm mt-1">Start a new blood donation campaign</p>
            </div>
          </div>
        </Link>

        <Link to="/ngo/campaigns" className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-[1.5rem] p-6 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-sky-200 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg group-hover:text-sky-600 transition-colors">View Campaigns</h3>
              <p className="text-slate-500 text-sm mt-1">Manage your existing campaigns</p>
            </div>
          </div>
        </Link>
      </div>

      {alerts.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-[1.5rem] p-6 shadow-lg shadow-slate-200/50">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
            Recent Blood Requests
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
                      <span className="text-slate-900 font-medium">{alert.units_needed} units needed</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      {alert.address}
                    </div>
                  </div>
                </div>
                <Link to="/ngo/alerts" className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700 rounded-lg transition-colors text-sm font-medium shadow-lg shadow-rose-200">
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

// Campaigns Section
const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [endModal, setEndModal] = useState({ open: false, campaign: null, bloodUnits: '' })

  const fetchCampaigns = async () => {
    try {
      const response = await api.get('/ngo/campaigns')
      setCampaigns(response.data)
    } catch (error) {
      console.log('Failed to fetch campaigns')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCampaigns() }, [])

  const handleEndCampaign = async () => {
    if (!endModal.bloodUnits || endModal.bloodUnits < 0) {
      setToast({ type: 'error', message: 'Please enter valid blood units collected' })
      return
    }

    try {
      await api.put(`/ngo/campaigns/${endModal.campaign.id}/end`, {
        blood_units_collected: parseInt(endModal.bloodUnits)
      })
      setToast({ type: 'success', message: `Campaign ended! ${endModal.bloodUnits} units collected.` })
      setEndModal({ open: false, campaign: null, bloodUnits: '' })
      fetchCampaigns()
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.error || 'Failed to end campaign' })
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Campaigns</h1>
          <p className="text-slate-500">Manage your blood donation drives</p>
        </div>
        <Link to="/ngo/create-campaign" className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-rose-200">
          <Plus className="w-5 h-5" /> Create New
        </Link>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {campaigns.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No Campaigns Yet</h3>
          <p className="text-slate-500 mb-6">Create your first blood donation campaign</p>
          <Link to="/ngo/create-campaign" className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium transition-colors inline-flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Create Campaign
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex-1 min-w-[300px]">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-800">{campaign.title}</h3>
                    {campaign.health_checkup_available && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 text-xs font-medium rounded-lg flex items-center gap-1">
                        ⚕️ Health Checkup
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-slate-500">
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {campaign.address}</p>
                    <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}</p>
                  </div>
                  {campaign.status === 'ended' && campaign.blood_units_collected !== null && (
                    <div className="mt-4 flex items-center gap-3">
                      <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-sm font-semibold rounded-lg flex items-center gap-2">
                        <Droplets className="w-4 h-4" /> {campaign.blood_units_collected} units collected
                      </span>
                      <span className="text-xs text-slate-400">
                        Ended on {new Date(campaign.ended_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${campaign.status === 'active'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                    {campaign.status === 'active' ? 'Active' : 'Ended'}
                  </span>
                  {campaign.status === 'active' && (
                    <button
                      onClick={() => setEndModal({ open: true, campaign, bloodUnits: '' })}
                      className="px-4 py-2 bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg text-sm font-medium transition-all shadow-sm"
                    >
                      End Campaign
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* End Campaign Modal */}
      {endModal.open && (
        <Modal isOpen={endModal.open} onClose={() => setEndModal({ open: false, campaign: null, bloodUnits: '' })} title="End Campaign">
          <h2 className="text-lg font-medium text-slate-800 mb-2">End Campaign: {endModal.campaign?.title}</h2>
          <p className="text-slate-500 mb-6 text-sm">Please enter the total blood units collected during this campaign.</p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Blood Units Collected</label>
            <input
              type="number"
              min="0"
              value={endModal.bloodUnits}
              onChange={(e) => setEndModal({ ...endModal, bloodUnits: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              placeholder="0"
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setEndModal({ open: false, campaign: null, bloodUnits: '' })}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEndCampaign}
              className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-medium transition-colors shadow-sm"
            >
              End Campaign
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// Create Campaign Section
const CreateCampaign = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    start_date: '',
    end_date: '',
    latitude: '',
    longitude: '',
    health_checkup_available: false
  })
  const [loading, setLoading] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)
  const [toast, setToast] = useState(null)

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
      await api.post('/ngo/campaigns', formData)
      setToast({ type: 'success', message: 'Campaign created successfully!' })
      setTimeout(() => navigate('/ngo/campaigns'), 1500)
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to create campaign' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Create Campaign</h1>
        <p className="text-slate-500">Organize a new blood donation drive</p>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Campaign Title</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium" placeholder="e.g., Blood Donation Drive 2024" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Location / Address</label>
            <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none h-24 font-medium" placeholder="Enter campaign location" required />
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Campaign Coordinates</label>
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
              <input type="number" step="any" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-600 text-sm focus:outline-none focus:border-red-500" placeholder="Lat" required />
              <input type="number" step="any" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-600 text-sm focus:outline-none focus:border-red-500" placeholder="Lng" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Date & Time</label>
              <input type="datetime-local" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Date & Time</label>
              <input type="datetime-local" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium" required />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <label className="flex items-center cursor-pointer gap-3">
              <input
                type="checkbox"
                checked={formData.health_checkup_available}
                onChange={(e) => setFormData({ ...formData, health_checkup_available: e.target.checked })}
                className="w-5 h-5 text-rose-600 bg-white border-slate-300 rounded focus:ring-rose-500 cursor-pointer"
              />
              <div>
                <span className="block text-sm font-semibold text-blue-700">⚕️ Free Health Checkup Available</span>
                <p className="text-xs text-blue-500">Offer free health checkups to donors at this campaign</p>
              </div>
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-200 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Creating Campaign...' : 'Create Campaign'}
          </button>
        </form>
      </div>
    </div>
  )
}

// Alerts Section
const NGOAlerts = () => {
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
      setToast({ type: 'success', message: 'Request accepted!' })
      setAllAlerts(prev => prev.filter(a => a.id !== requestId))
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.error || 'Failed to accept' })
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div></div>

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

// Request Blood Section
const NGORequestBlood = () => {
  const [formData, setFormData] = useState({ blood_group: '', units_needed: 1, address: '', latitude: '', longitude: '' })
  const [loading, setLoading] = useState(false)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [toast, setToast] = useState(null)
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

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
    if (!formData.latitude || !formData.longitude) {
      setToast({ type: 'error', message: 'Please provide location coordinates' })
      return
    }
    setLoading(true)
    try {
      const response = await api.post('/blood-requests', { ...formData, latitude: parseFloat(formData.latitude), longitude: parseFloat(formData.longitude) })
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
        <p className="text-slate-500">Create a blood request for emergencies</p>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Blood Group Needed</label>
              <select value={formData.blood_group} onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium appearance-none" required>
                <option value="">Select</option>
                {bloodGroups.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Units Needed</label>
              <input type="number" min="1" max="20" value={formData.units_needed} onChange={(e) => setFormData({ ...formData, units_needed: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Location / Address</label>
            <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium resize-none h-24" placeholder="Enter the address where blood is needed" required />
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-slate-700">Location Coordinates <span className="text-rose-500">*</span></label>
              <button type="button" onClick={handleGetLocation} disabled={loadingLocation} className="px-4 py-2 bg-white border border-slate-200 text-blue-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
                {loadingLocation ? <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div> : <MapPin className="w-4 h-4" />}
                Get Location
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" step="any" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-600 text-sm focus:outline-none focus:border-red-500" placeholder="Lat" required />
              <input type="number" step="any" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-600 text-sm focus:outline-none focus:border-red-500" placeholder="Lng" required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-200 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Creating Request...' : 'Request Blood'}
          </button>
        </form>
      </div>
    </div>
  )
}

// Profile Section
const NGOProfile = () => {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({ name: '', owner_name: '', age: '', gender: '', address: '', volunteer_count: '', latitude: '', longitude: '' })
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [toast, setToast] = useState(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/ngo/profile')
        setFormData({ name: response.data.name || '', owner_name: response.data.owner_name || '', age: response.data.age || '', gender: response.data.gender || '', address: response.data.address || '', volunteer_count: response.data.volunteer_count || '', latitude: response.data.lat || '', longitude: response.data.lng || '' })
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
      const response = await api.put('/ngo/profile', { ...formData, latitude: formData.latitude ? parseFloat(formData.latitude) : null, longitude: formData.longitude ? parseFloat(formData.longitude) : null })
      if (response.data.ngo) updateUser(response.data.ngo)
      setToast({ type: 'success', message: 'Profile updated successfully' })
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to update profile' })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) { setToast({ type: 'error', message: 'Passwords do not match' }); return }
    setLoading(true)
    try {
      await api.put('/ngo/change-password', { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword })
      setToast({ type: 'success', message: 'Password changed successfully' })
      setShowPasswordModal(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.error || 'Failed to change password' })
    } finally {
      setLoading(false)
    }
  }

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
        <p className="text-slate-500">Manage your NGO's information</p>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Organization Details</h2>
            <form id="profileForm" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="NGO Name" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <InputField label="Owner Name" type="text" value={formData.owner_name} onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })} />
                <InputField label="Email" type="email" value={user?.email} disabled className="bg-slate-100 text-slate-500 cursor-not-allowed" />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Age" type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Gender</label>
                    <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium">
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Address</label>
                <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium resize-none h-[80px]" />
              </div>
            </form>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <label className="text-lg font-bold text-slate-800">Location Settings</label>
              <button type="button" onClick={handleGetLocation} disabled={loadingLocation} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
                {loadingLocation ? 'Updating...' : <><MapPin className="w-4 h-4" /> Update from GPS</>}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Latitude" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} placeholder="0.000000" />
              <InputField label="Longitude" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} placeholder="0.000000" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6">
            <h3 className="font-bold text-slate-800 mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button type="submit" form="profileForm" disabled={loading} className="w-full bg-slate-900 hover:bg-black text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-slate-200">
                {loading ? 'Saving...' : 'Save Changes'}
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
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

const NGODashboard = () => {
  const navItems = [
    { path: '/ngo', label: 'Overview', icon: BarChart3 },
    { path: '/ngo/campaigns', label: 'Campaigns', icon: Calendar },
    { path: '/ngo/create-campaign', label: 'Create Campaign', icon: Plus },
    { path: '/ngo/blood-requests', label: 'Request Blood', icon: Droplets },
    { path: '/ngo/alerts', label: 'Alerts', icon: Bell },
    { path: '/ngo/profile', label: 'Profile', icon: User },
  ]

  return (
    <DashboardLayout navItems={navItems}>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/create-campaign" element={<CreateCampaign />} />
        <Route path="/blood-requests" element={<NGORequestBlood />} />
        <Route path="/alerts" element={<NGOAlerts />} />
        <Route path="/profile" element={<NGOProfile />} />
      </Routes>
    </DashboardLayout>
  )
}

export default NGODashboard
