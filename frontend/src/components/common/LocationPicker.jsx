import { useState, useCallback, useRef, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api'
import { MapPin, Navigation, User, ExternalLink, Search, Loader2 } from 'lucide-react'

const libraries = ['places']

const mapContainerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '12px'
}

const defaultCenter = {
    lat: 20.5937,
    lng: 78.9629
}

const LocationPicker = ({
    value,
    onChange,
    profileCoordinates = null,
    showProfileButton = true,
    placeholder = 'Search for a location...',
    required = false
}) => {
    const [map, setMap] = useState(null)
    const [marker, setMarker] = useState(value)
    const [gettingLocation, setGettingLocation] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const autocompleteRef = useRef(null)

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        libraries
    })

    useEffect(() => {
        if (value && value.lat && value.lng) {
            setMarker(value)
        }
    }, [value])

    const onMapClick = useCallback((e) => {
        const newPos = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        }
        setMarker(newPos)
        onChange(newPos)
    }, [onChange])

    const onMapLoad = useCallback((mapInstance) => {
        setMap(mapInstance)
    }, [])

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser')
            return
        }

        setGettingLocation(true)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                setMarker(newPos)
                onChange(newPos)
                if (map) {
                    map.panTo(newPos)
                    map.setZoom(15)
                }
                setGettingLocation(false)
            },
            (error) => {
                setGettingLocation(false)
                let message = 'Unable to get location'
                if (error.code === error.PERMISSION_DENIED) message = 'Location permission denied'
                else if (error.code === error.POSITION_UNAVAILABLE) message = 'Location unavailable'
                else if (error.code === error.TIMEOUT) message = 'Location request timed out'
                alert(message)
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        )
    }

    const handleUseProfileCoordinates = () => {
        if (profileCoordinates && profileCoordinates.lat && profileCoordinates.lng) {
            const newPos = {
                lat: parseFloat(profileCoordinates.lat),
                lng: parseFloat(profileCoordinates.lng)
            }
            setMarker(newPos)
            onChange(newPos)
            if (map) {
                map.panTo(newPos)
                map.setZoom(15)
            }
        }
    }

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace()
            if (place.geometry && place.geometry.location) {
                const newPos = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                }
                setMarker(newPos)
                onChange(newPos)
                if (map) {
                    map.panTo(newPos)
                    map.setZoom(15)
                }
                setSearchValue(place.formatted_address || place.name || '')
            }
        }
    }

    const onAutocompleteLoad = (autocomplete) => {
        autocompleteRef.current = autocomplete
    }

    if (loadError) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                Error loading Google Maps. Please check your API key configuration.
            </div>
        )
    }

    if (!isLoaded) {
        return (
            <div className="p-8 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                <span className="ml-2 text-slate-500">Loading map...</span>
            </div>
        )
    }

    const hasValidMarker = marker && typeof marker.lat === 'number' && typeof marker.lng === 'number'
    const hasProfileCoords = profileCoordinates && profileCoordinates.lat && profileCoordinates.lng

    return (
        <div className="space-y-4">
            {/* Search Box */}
            <div className="relative">
                <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged}>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder={placeholder}
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all"
                        />
                    </div>
                </Autocomplete>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    disabled={gettingLocation}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 rounded-lg text-sm font-medium transition-all shadow-sm"
                >
                    {gettingLocation ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Navigation className="w-4 h-4" />
                    )}
                    {gettingLocation ? 'Locating...' : 'Use My Location'}
                </button>

                {showProfileButton && hasProfileCoords && (
                    <button
                        type="button"
                        onClick={handleUseProfileCoordinates}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 rounded-lg text-sm font-medium transition-all shadow-sm"
                    >
                        <User className="w-4 h-4" />
                        Use Profile Location
                    </button>
                )}
            </div>

            {/* Map */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={hasValidMarker ? marker : defaultCenter}
                    zoom={hasValidMarker ? 15 : 5}
                    onClick={onMapClick}
                    onLoad={onMapLoad}
                    options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: true,
                        zoomControl: true
                    }}
                >
                    {hasValidMarker && (
                        <Marker
                            position={marker}
                            animation={window.google?.maps?.Animation?.DROP}
                        />
                    )}
                </GoogleMap>

                {/* Click instruction overlay */}
                {!hasValidMarker && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                        Click on the map to select location
                    </div>
                )}
            </div>

            {/* Selected Coordinates Display */}
            {hasValidMarker && (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm text-emerald-700 font-medium">
                            {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                        </span>
                    </div>
                    <a
                        href={`https://www.google.com/maps?q=${marker.lat},${marker.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                        <ExternalLink className="w-3 h-3" />
                        Open in Maps
                    </a>
                </div>
            )}

            {/* Hidden inputs for form validation if needed */}
            {required && (
                <>
                    <input type="hidden" value={marker?.lat || ''} required />
                    <input type="hidden" value={marker?.lng || ''} required />
                </>
            )}
        </div>
    )
}

export default LocationPicker
