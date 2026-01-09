import { useState } from 'react'
import { X, MapPin, Phone, Mail, Clock, Heart, Building2, Calendar, Users, Navigation, ExternalLink, Droplets } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Premium Details Modal for Blood Requests, Campaigns, and Blood Banks
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {function} props.onClose - Close handler
 * @param {string} props.type - 'request' | 'campaign' | 'bloodbank'
 * @param {Object} props.data - The data to display
 * @param {function} props.onTrackOnMap - Handler for Track on Map button
 * @param {function} props.onAccept - Handler for Accept button (blood requests only)
 */
const DetailsModal = ({ isOpen, onClose, type, data, onTrackOnMap, onAccept, loading }) => {
    if (!data) return null

    const formatDistance = (meters) => {
        if (meters < 1000) return `${Math.round(meters)}m away`
        return `${(meters / 1000).toFixed(1)}km away`
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const openGoogleMaps = () => {
        if (data.latitude && data.longitude) {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}`, '_blank')
        }
    }

    const renderBloodRequestDetails = () => (
        <>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-200">
                    <span className="text-2xl font-bold text-white">{data.blood_group}</span>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Blood Request</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 text-xs font-semibold">
                            {data.units_needed} unit(s) needed
                        </span>
                        {data.distance && (
                            <span className="text-xs text-slate-500">{formatDistance(data.distance)}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Requester Info */}
            {data.requester && (
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Requester Information</h4>
                    <div className="space-y-2">
                        {data.requester.name && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Users className="w-4 h-4 text-slate-400" />
                                <span>{data.requester.name}</span>
                            </div>
                        )}
                        {data.requester.email && (
                            <a href={`mailto:${data.requester.email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                <Mail className="w-4 h-4" />
                                <span>{data.requester.email}</span>
                            </a>
                        )}
                        {data.requester.phone && (
                            <a href={`tel:${data.requester.phone}`} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                <Phone className="w-4 h-4" />
                                <span>{data.requester.phone}</span>
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Location */}
            <div className="flex items-start gap-2 text-slate-600 mb-4">
                <MapPin className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" />
                <span className="text-sm">{data.address}</span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                <Clock className="w-4 h-4" />
                <span>Posted {formatDate(data.created_at)}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={openGoogleMaps}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all"
                >
                    <Navigation className="w-4 h-4" />
                    Track on Map
                </button>
                {onAccept && (
                    <button
                        onClick={() => onAccept(data.id)}
                        disabled={loading}
                        className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl font-semibold shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Accepting...' : 'Accept & Help'}
                    </button>
                )}
            </div>
        </>
    )

    const renderCampaignDetails = () => (
        <>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                    <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800">{data.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-slate-500">by {data.ngo_name}</span>
                        {data.distance && (
                            <span className="text-xs text-slate-400">• {formatDistance(data.distance)}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Health Checkup Badge */}
            {data.health_checkup_available && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-blue-700">Free Health Checkup Available</span>
                </div>
            )}

            {/* Date & Time */}
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Campaign Schedule</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-slate-400 mb-1">Starts</p>
                        <p className="text-sm font-medium text-slate-700">{formatDate(data.start_date)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 mb-1">Ends</p>
                        <p className="text-sm font-medium text-slate-700">{formatDate(data.end_date)}</p>
                    </div>
                </div>
            </div>

            {/* NGO Contact */}
            {(data.ngo_email || data.owner_name) && (
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Organizer</h4>
                    <div className="space-y-2">
                        {data.owner_name && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Users className="w-4 h-4 text-slate-400" />
                                <span>{data.owner_name}</span>
                            </div>
                        )}
                        {data.ngo_email && (
                            <a href={`mailto:${data.ngo_email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                <Mail className="w-4 h-4" />
                                <span>{data.ngo_email}</span>
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Location */}
            <div className="flex items-start gap-2 text-slate-600 mb-6">
                <MapPin className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" />
                <span className="text-sm">{data.address}</span>
            </div>

            {/* Actions */}
            <button
                onClick={openGoogleMaps}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all"
            >
                <Navigation className="w-4 h-4" />
                Get Directions
            </button>
        </>
    )

    const renderBloodBankDetails = () => (
        <>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200">
                    <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800">{data.name}</h3>
                    {data.distance && (
                        <span className="text-sm text-slate-500">{formatDistance(data.distance)}</span>
                    )}
                </div>
            </div>

            {/* Stock Levels */}
            {data.stock && data.stock.length > 0 && (
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Blood Stock Available</h4>
                    <div className="grid grid-cols-4 gap-2">
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => {
                            const stockItem = data.stock.find(s => s.blood_group === bg)
                            const units = stockItem?.units || 0
                            return (
                                <div
                                    key={bg}
                                    className={`text-center p-2 rounded-lg border ${units > 0 ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}
                                >
                                    <span className={`text-sm font-bold ${units > 0 ? 'text-green-700' : 'text-slate-400'}`}>
                                        {bg}
                                    </span>
                                    <p className={`text-xs ${units > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                                        {units} units
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Contact Info */}
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Contact</h4>
                <div className="space-y-2">
                    {data.contact_info && (
                        <a href={`tel:${data.contact_info}`} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                            <Phone className="w-4 h-4" />
                            <span>{data.contact_info}</span>
                        </a>
                    )}
                    {data.email && (
                        <a href={`mailto:${data.email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                            <Mail className="w-4 h-4" />
                            <span>{data.email}</span>
                        </a>
                    )}
                </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-2 text-slate-600 mb-6">
                <MapPin className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" />
                <span className="text-sm">{data.address}</span>
            </div>

            {/* Actions */}
            <button
                onClick={openGoogleMaps}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all"
            >
                <Navigation className="w-4 h-4" />
                Get Directions
            </button>
        </>
    )

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-x-4 bottom-4 md:inset-auto md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-white rounded-3xl shadow-2xl z-50 max-h-[85vh] overflow-y-auto"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Content */}
                        <div className="p-6">
                            {type === 'request' && renderBloodRequestDetails()}
                            {type === 'campaign' && renderCampaignDetails()}
                            {type === 'bloodbank' && renderBloodBankDetails()}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default DetailsModal
