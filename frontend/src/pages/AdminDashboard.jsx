import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Toast from "../components/common/Toast";
import Modal from "../components/common/Modal";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  BarChart3,
  Link as LinkIcon,
  Users,
  Handshake,
  Building2,
  Droplets,
  User,
  Copy,
  Check,
  MapPin,
  AlertTriangle,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";

// Overview Section
const Overview = () => {
  const [stats, setStats] = useState({
    approvedUsers: 0,
    approvedNgos: 0,
    approvedBloodBanks: 0,
    totalDonations: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats");
        setStats(response.data);
      } catch (error) {
        console.log("Failed to fetch stats");
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Approved Users", value: stats.approvedUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", link: "/admin/users" },
    { label: "Approved NGOs", value: stats.approvedNgos, icon: Handshake, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", link: "/admin/ngos" },
    { label: "Blood Banks", value: stats.approvedBloodBanks, icon: Building2, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100", link: "/admin/blood-banks" },
    { label: "Total Donations", value: stats.totalDonations, icon: Droplets, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", link: "/admin/request-blood" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
      <div className="text-center shrink-0">
        <h1 className="text-3xl font-bold font-serif text-slate-900 mb-2">Admin Dashboard</h1>
        <p className="text-slate-500">Manage and monitor the Bharakt platform</p>
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
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-auto">
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value.toLocaleString()}</h3>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Section: Quick Actions & System Status */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions - Horizontal Cards with more height */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col justify-center">
          <h2 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 grow">
            <Link to="/admin/generate-token" className="group">
              <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-8 hover:border-red-200 hover:bg-red-50/30 transition-all flex items-center gap-5 h-full">
                <div className="p-4 bg-white text-red-600 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                  <LinkIcon className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-slate-800 text-sm block mb-0.5">Generate Token</span>
                  <span className="text-xs text-slate-500 font-medium">Invitations</span>
                </div>
              </div>
            </Link>
            <Link to="/admin/users" className="group">
              <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-8 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-center gap-5 h-full">
                <div className="p-4 bg-white text-blue-600 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-slate-800 text-sm block mb-0.5">Manage Users</span>
                  <span className="text-xs text-slate-500 font-medium">Verification</span>
                </div>
              </div>
            </Link>
            <Link to="/admin/request-blood" className="group">
              <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-8 hover:border-rose-200 hover:bg-rose-50/30 transition-all flex items-center gap-5 h-full">
                <div className="p-4 bg-white text-rose-600 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                  <Droplets className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-slate-800 text-sm block mb-0.5">Request Blood</span>
                  <span className="text-xs text-slate-500 font-medium">Emergency</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* System Health - Stacked Metrics */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">System Health</h2>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-green-700">Operational</span>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase text-slate-500 tracking-wider">
                <span>Storage Usage</span>
                <span className="text-slate-900">24%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 overflow-hidden rounded-full">
                <div className="h-full bg-blue-500 w-[24%]" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase text-slate-500 tracking-wider">
                <span>API Latency</span>
                <span className="text-slate-900">45ms</span>
              </div>
              <div className="w-full bg-slate-100 h-3 overflow-hidden rounded-full">
                <div className="h-full bg-emerald-500 w-[85%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Generate Token Section
const GenerateToken = () => {
  const [type, setType] = useState('ngo')
  const [email, setEmail] = useState('')
  const [sentEmail, setSentEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedData, setGeneratedData] = useState(null)
  const [toast, setToast] = useState(null)

  const handleGenerate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.post('/admin/generate-token', { type, email: email || undefined })
      setGeneratedData(response.data)
      setToast({ type: 'success', message: 'Token generated successfully!' })
      setSentEmail(email)
      setEmail('')
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to generate token' })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setToast({ type: 'success', message: 'Copied to clipboard!' })
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Generate Token</h1>
      <p className="text-slate-500 mb-8">Create signup links for organizations</p>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Registration Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setType('ngo')} className={cn("py-4 px-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2", type === 'ngo' ? "bg-red-50 border-red-200 text-red-700 shadow-sm" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700")}>
                <Handshake className="w-8 h-8" />
                <span className="font-medium">NGO</span>
              </button>
              <button type="button" onClick={() => setType('blood_bank')} className={cn("py-4 px-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2", type === 'blood_bank' ? "bg-red-50 border-red-200 text-red-700 shadow-sm" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700")}>
                <Building2 className="w-8 h-8" />
                <span className="font-medium">Blood Bank</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email (optional)</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all" placeholder="Enter email to send link directly" />
            <p className="text-xs text-slate-500 mt-2">Leave empty to only generate the link</p>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-red-600 text-white hover:bg-red-700 font-bold py-3 text-base shadow-lg shadow-red-200">
            {loading ? 'Generating...' : 'Generate Token'}
          </Button>
        </form>

        {generatedData && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-4">Generated Link</h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-center justify-between gap-4">
              <code className="text-sm text-red-600 break-all font-mono">{generatedData.signupUrl}</code>
              <Button size="icon" variant="ghost" onClick={() => copyToClipboard(generatedData.signupUrl)} className="shrink-0 text-slate-400 hover:text-slate-700 hover:bg-slate-200">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-3">Expires: {new Date(generatedData.expiresAt).toLocaleString()}</p>
            {sentEmail && <p className="text-sm text-green-600 mt-2 flex items-center gap-2"><Check className="w-4 h-4" /> Link sent to {sentEmail}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

// Users List
const UsersList = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [confirmModal, setConfirmModal] = useState({ open: false, type: '', id: null, name: '' })
  const [searchTerm, setSearchTerm] = useState('')

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users')
      setUsers(response.data)
    } catch (error) { console.log('Failed to fetch users') } finally { setLoading(false) }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleAction = async (action, id) => {
    try {
      if (action === 'suspend') await api.put(`/admin/suspend/user/${id}`)
      else if (action === 'activate') await api.put(`/admin/activate/user/${id}`)
      else if (action === 'delete') await api.delete(`/admin/delete/user/${id}`)

      setToast({ type: 'success', message: `User ${action}ed successfully` })
      if (action === 'delete') setConfirmModal({ open: false, type: '', id: null, name: '' })
      fetchUsers()
    } catch (error) { setToast({ type: 'error', message: `Failed to ${action} user` }) }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.blood_group && user.blood_group.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div></div>

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Users ({filteredUsers.length})</h1>
          <p className="text-slate-500">Manage registered users</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 w-full md:w-64"
          />
        </div>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">No users found matching "{searchTerm}"</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-[1.5rem] p-6 shadow-md shadow-slate-200/50 hover:shadow-lg transition-all duration-300 group hover:-translate-y-0.5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-red-100 group-hover:scale-110 transition-transform">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800 truncate">{user.name}</h3>
                  <p className="text-sm text-slate-500 truncate">{user.email}</p>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Blood Group</span>
                  <span className="text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded text-xs">{user.blood_group || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${user.status === 'suspended' ? 'bg-amber-50 text-amber-700 border border-amber-200' : (user.is_verified ? "bg-green-50 text-green-700 border border-green-200" : "bg-blue-50 text-blue-700 border border-blue-200")}`}>
                    {user.status === 'suspended' ? 'Suspended' : (user.is_verified ? "Verified" : "Active")}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  {user.status === 'suspended' ? (
                    <button onClick={() => handleAction('activate', user.id)} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Activate">
                      <ShieldCheck className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={() => handleAction('suspend', user.id)} className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors" title="Suspend">
                      <ShieldAlert className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => setConfirmModal({ open: true, type: 'user', id: user.id, name: user.name })} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={confirmModal.open} onClose={() => setConfirmModal({ open: false, type: '', id: null, name: '' })} title="Confirm Delete">
        <p className="text-slate-600 mb-6">Are you sure you want to delete user <span className="font-semibold text-slate-900">{confirmModal.name}</span>? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setConfirmModal({ open: false, type: '', id: null, name: '' })} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={() => handleAction('delete', confirmModal.id)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm">Delete</button>
        </div>
      </Modal>
    </div>
  )
}

// NGOs List
const NgosList = () => {
  const [ngos, setNgos] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [confirmModal, setConfirmModal] = useState({ open: false, type: '', id: null, name: '' })
  const [searchTerm, setSearchTerm] = useState('')

  const fetchNgos = async () => {
    try {
      const response = await api.get('/admin/ngos')
      setNgos(response.data)
    } catch (error) { console.log('Failed to fetch NGOs') } finally { setLoading(false) }
  }

  useEffect(() => { fetchNgos() }, [])

  const handleAction = async (action, id) => {
    try {
      if (action === 'suspend') await api.put(`/admin/suspend/ngo/${id}`)
      else if (action === 'activate') await api.put(`/admin/activate/ngo/${id}`)
      else if (action === 'delete') await api.delete(`/admin/delete/ngo/${id}`)

      setToast({ type: 'success', message: `NGO ${action}ed successfully` })
      if (action === 'delete') setConfirmModal({ open: false, type: '', id: null, name: '' })
      fetchNgos()
    } catch (error) { setToast({ type: 'error', message: `Failed to ${action} NGO` }) }
  }

  const filteredNgos = ngos.filter(ngo =>
    ngo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ngo.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ngo.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div></div>

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">NGOs ({filteredNgos.length})</h1>
          <p className="text-slate-500">Manage partner organizations</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search NGOs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 w-full md:w-64"
          />
        </div>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {filteredNgos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Handshake className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">No NGOs found matching "{searchTerm}"</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNgos.map((ngo) => (
            <div key={ngo.id} className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-[1.5rem] p-6 shadow-md shadow-slate-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-green-50 text-green-600 h-fit">
                    <Handshake className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 mb-1 flex items-center gap-2">
                      {ngo.name}
                      {ngo.is_verified && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                    </h3>
                    <div className="text-sm text-slate-500 space-y-1">
                      <p>Owner: {ngo.owner_name}</p>
                      <p>{ngo.email}</p>
                      <p className="flex items-center gap-1 mt-2 text-xs text-slate-400"><Users className="w-3 h-3" /> {ngo.volunteer_count} Volunteers</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {ngo.status === 'suspended' ? (
                    <button onClick={() => handleAction('activate', ngo.id)} className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Activate
                    </button>
                  ) : (
                    <button onClick={() => handleAction('suspend', ngo.id)} className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> Suspend
                    </button>
                  )}
                  <button onClick={() => setConfirmModal({ open: true, type: 'ngo', id: ngo.id, name: ngo.name })} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={confirmModal.open} onClose={() => setConfirmModal({ open: false, type: '', id: null, name: '' })} title="Confirm Delete">
        <p className="text-slate-600 mb-6">Are you sure you want to delete <span className="font-semibold text-slate-900">{confirmModal.name}</span>? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setConfirmModal({ open: false, type: '', id: null, name: '' })} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={() => handleAction('delete', confirmModal.id)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm">Delete</button>
        </div>
      </Modal>
    </div>
  )
}

// Blood Banks List
const BloodBanksList = () => {
  const [bloodBanks, setBloodBanks] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [confirmModal, setConfirmModal] = useState({ open: false, type: '', id: null, name: '' })
  const [searchTerm, setSearchTerm] = useState('')

  const fetchBloodBanks = async () => {
    try {
      const response = await api.get('/admin/blood-banks')
      setBloodBanks(response.data)
    } catch (error) { console.log('Failed to fetch blood banks') } finally { setLoading(false) }
  }

  useEffect(() => { fetchBloodBanks() }, [])

  const handleAction = async (action, id) => {
    try {
      if (action === 'suspend') await api.put(`/admin/suspend/blood_bank/${id}`)
      else if (action === 'activate') await api.put(`/admin/activate/blood_bank/${id}`)
      else if (action === 'delete') await api.delete(`/admin/delete/blood_bank/${id}`)

      setToast({ type: 'success', message: `Blood Bank ${action}ed successfully` })
      if (action === 'delete') setConfirmModal({ open: false, type: '', id: null, name: '' })
      fetchBloodBanks()
    } catch (error) { setToast({ type: 'error', message: `Failed to ${action} Blood Bank` }) }
  }

  const filteredBanks = bloodBanks.filter(bank =>
    bank.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.contact_info?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.city?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div></div>

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Blood Banks ({filteredBanks.length})</h1>
          <p className="text-slate-500">Manage blood bank facilities</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search blood banks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 w-full md:w-64"
          />
        </div>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {filteredBanks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">No blood banks found matching "{searchTerm}"</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBanks.map((bank) => (
            <div key={bank.id} className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-[1.5rem] p-6 shadow-md shadow-slate-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-purple-50 text-purple-600 h-fit">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 mb-1 flex items-center gap-2">
                      {bank.name}
                      {bank.is_verified && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                    </h3>
                    <div className="text-sm text-slate-500 space-y-1">
                      <p>{bank.contact_info}</p>
                      <p>{bank.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {bank.status === 'suspended' ? (
                    <button onClick={() => handleAction('activate', bank.id)} className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Activate
                    </button>
                  ) : (
                    <button onClick={() => handleAction('suspend', bank.id)} className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> Suspend
                    </button>
                  )}
                  <button onClick={() => setConfirmModal({ open: true, type: 'blood_bank', id: bank.id, name: bank.name })} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={confirmModal.open} onClose={() => setConfirmModal({ open: false, type: '', id: null, name: '' })} title="Confirm Delete">
        <p className="text-slate-600 mb-6">Are you sure you want to delete <span className="font-semibold text-slate-900">{confirmModal.name}</span>? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setConfirmModal({ open: false, type: '', id: null, name: '' })} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={() => handleAction('delete', confirmModal.id)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm">Delete</button>
        </div>
      </Modal>
    </div>
  )
}

// Request Blood
const AdminRequestBlood = () => {
  const [formData, setFormData] = useState({ blood_group: '', units_needed: 1, address: '', latitude: '', longitude: '' })
  const [loading, setLoading] = useState(false)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [toast, setToast] = useState(null)
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  const handleGetLocation = () => {
    if (!navigator.geolocation) { setToast({ type: 'error', message: 'Geolocation is not supported' }); return }
    setLoadingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData(p => ({ ...p, latitude: pos.coords.latitude.toFixed(15), longitude: pos.coords.longitude.toFixed(15) }))
        setLoadingLocation(false)
        setToast({ type: 'success', message: 'Location captured' })
      },
      (err) => { setLoadingLocation(false); setToast({ type: 'error', message: 'Allow site permission' }) },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.latitude || !formData.longitude) { setToast({ type: 'error', message: 'Location coordinates required' }); return }
    setLoading(true)
    try {
      const res = await api.post('/blood-requests', { ...formData, latitude: parseFloat(formData.latitude), longitude: parseFloat(formData.longitude) })
      setToast({ type: 'success', message: `Request created! ${res.data.alertsSent} donors notified` })
      setFormData({ blood_group: '', units_needed: 1, address: '', latitude: '', longitude: '' })
    } catch (err) { setToast({ type: 'error', message: err.response?.data?.error || 'Failed to create request' }) } finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Request Blood</h1>
        <p className="text-slate-500">Create an emergency blood request to alert nearby donors.</p>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Blood Group</label>
              <select value={formData.blood_group} onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" required>
                <option value="">Select Blood Group</option>
                {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Units Required</label>
              <input type="number" min="1" max="20" value={formData.units_needed} onChange={(e) => setFormData({ ...formData, units_needed: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Delivery Address</label>
            <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none" placeholder="Enter complete address..." required />
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 block">Location Coordinates</label>
                <span className="text-xs text-slate-500">Required for donor distance calculation</span>
              </div>
              <button type="button" onClick={handleGetLocation} disabled={loadingLocation} className="text-sm bg-white border border-slate-200 px-4 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50 shadow-sm flex items-center gap-2 transition-all">
                {loadingLocation ? 'Getting...' : <><MapPin className="w-4 h-4 text-red-500" /> Get Current Location</>}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Latitude</label>
                <input type="number" step="any" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:border-red-500 transition-all" placeholder="Lat" required />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Longitude</label>
                <input type="number" step="any" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:border-red-500 transition-all" placeholder="Lng" required />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 transition-all transform active:scale-[0.98]">
              {loading ? 'Processing Request...' : 'Send Blood Request Alert'}
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">This will send immediate notifications to all eligible donors within range.</p>
          </div>
        </form>
      </div>
    </div>
  )
}

// Admin Profile
const AdminProfile = () => {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({ name: '', age: '', gender: '', address: '', latitude: '', longitude: '' })
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [showPassModal, setShowPassModal] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/admin/profile')
        setFormData({ name: res.data.name || '', age: res.data.age || '', gender: res.data.gender || '', address: res.data.address || '', latitude: res.data.lat || '', longitude: res.data.lng || '' })
      } catch (err) { console.log('Failed to fetch profile') }
    }
    fetchProfile()
  }, [])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.put('/admin/profile', { ...formData, latitude: formData.latitude ? parseFloat(formData.latitude) : null, longitude: formData.longitude ? parseFloat(formData.longitude) : null })
      if (res.data.admin) updateUser(res.data.admin)
      setToast({ type: 'success', message: 'Profile updated' })
    } catch (err) { setToast({ type: 'error', message: 'Failed to update profile' }) } finally { setLoading(false) }
  }

  const handlePassword = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) { setToast({ type: 'error', message: 'Passwords mismatch' }); return }
    setLoading(true)
    try {
      await api.put('/admin/change-password', { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword })
      setToast({ type: 'success', message: 'Password changed' })
      setShowPassModal(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) { setToast({ type: 'error', message: err.response?.data?.error || 'Failed to change password' }) } finally { setLoading(false) }
  }

  const handleGetLocation = () => {
    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => { setFormData(p => ({ ...p, latitude: pos.coords.latitude.toFixed(15), longitude: pos.coords.longitude.toFixed(15) })); setLocationLoading(false) },
      (err) => { setLocationLoading(false); setToast({ type: 'error', message: 'Location access denied/failed' }) }
    )
  }

  const InputField = ({ label, ...props }) => (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" {...props} />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile Settings</h1>
          <p className="text-slate-500">Manage your personal information and security</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
          <User className="w-6 h-6" />
        </div>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Personal Information</h2>
            <form id="profileForm" onSubmit={handleUpdate} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <InputField label="Full Name" type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                <InputField label="Email Address" type="email" value={user?.email} disabled className="bg-slate-100 text-slate-500 cursor-not-allowed" />
                <InputField label="Age" type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Gender</label>
                  <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Address</label>
                <textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none h-24" />
              </div>
            </form>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Location Settings</h2>
              <button type="button" onClick={handleGetLocation} className="text-sm text-blue-600 hover:text-blue-700 font-medium">{locationLoading ? 'Updating Coordinate...' : 'Update from GPS'}</button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <InputField label="Latitude" value={formData.latitude} onChange={e => setFormData({ ...formData, latitude: e.target.value })} placeholder="0.000000" />
              <InputField label="Longitude" value={formData.longitude} onChange={e => setFormData({ ...formData, longitude: e.target.value })} placeholder="0.000000" />
            </div>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button type="submit" form="profileForm" disabled={loading} className="w-full bg-slate-900 hover:bg-black text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-slate-200">
                {loading ? 'Saving Changes...' : 'Save Profile'}
              </button>
              <button type="button" onClick={() => setShowPassModal(true)} className="w-full bg-white border border-slate-200 text-slate-700 font-medium py-3 rounded-xl hover:bg-slate-50 transition-all">
                Change Password
              </button>
              <button onClick={() => { if (window.confirm('Are you sure you want to logout?')) { /* logout logic */ } }} className="w-full bg-red-50 text-red-600 font-medium py-3 rounded-xl hover:bg-red-100 transition-all">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showPassModal} onClose={() => setShowPassModal(false)} title="Change Password">
        <form onSubmit={handlePassword} className="space-y-4">
          <InputField label="Current Password" type="password" value={passwordData.currentPassword} onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required />
          <InputField label="New Password" type="password" value={passwordData.newPassword} onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} required />
          <InputField label="Confirm New Password" type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
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

const AdminDashboard = () => {
  const navItems = [
    { path: "/admin", label: "Overview", icon: BarChart3 },
    { path: "/admin/generate-token", label: "Generate Token", icon: LinkIcon },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/ngos", label: "NGOs", icon: Handshake },
    { path: "/admin/blood-banks", label: "Blood Banks", icon: Building2 },
    { path: "/admin/request-blood", label: "Request Blood", icon: Droplets },
    { path: "/admin/profile", label: "Profile", icon: User },
  ]

  return (
    <DashboardLayout navItems={navItems}>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="generate-token" element={<GenerateToken />} />
        <Route path="users" element={<UsersList />} />
        <Route path="ngos" element={<NgosList />} />
        <Route path="blood-banks" element={<BloodBanksList />} />
        <Route path="request-blood" element={<AdminRequestBlood />} />
        <Route path="profile" element={<AdminProfile />} />
      </Routes>
    </DashboardLayout>
  )
}

export default AdminDashboard
