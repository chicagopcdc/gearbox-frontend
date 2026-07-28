import { useCallback, useState } from 'react'
import { GeocodeFn, LocationFilterState, LocationParams } from '../model'

export function useLocationFilter(geocodeAddress?: GeocodeFn) {
  const [filter, setFilter] = useState<LocationFilterState>({
    mode: 'coordinates',
    lat: '',
    lon: '',
    distance: '',
    unit: 'km',
    address: '',
  })
  const [params, setParams] = useState<LocationParams>(null)
  const [error, setError] = useState<string | null>(null)
  const [isResolving, setIsResolving] = useState(false)

  const DEFAULT_LOCATION_DISTANCE = 25

  const clear = useCallback(() => {
    setFilter((prev) => ({
      mode: prev.mode,
      lat: '',
      lon: '',
      distance: '',
      unit: 'km',
      address: '',
    }))

    setParams(null)
    setError(null)
  }, [])

  const apply = useCallback(async () => {
    const distanceText = filter.distance.trim()
    const distance =
      distanceText === '' ? DEFAULT_LOCATION_DISTANCE : parseFloat(distanceText)

    if (Number.isNaN(distance) || distance <= 0) {
      setError('Please enter a positive max distance.')
      return
    }

    // COORDINATES MODE
    if (filter.mode === 'coordinates') {
      const lat = parseFloat(filter.lat)
      const lon = parseFloat(filter.lon)

      if (Number.isNaN(lat) || Number.isNaN(lon)) {
        setError('Please enter valid latitude and longitude.')
        return
      }

      if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        setError(
          'Latitude must be between -90 and 90, longitude between -180 and 180.'
        )
        return
      }

      setParams({
        lat,
        lon,
        range: distance,
        unit: filter.unit,
      })

      setError(null)
      return
    }

    // ADDRESS MODE
    const address = filter.address.trim()

    if (!address) {
      setError('Please enter an address.')
      return
    }

    const existingLat = parseFloat(filter.lat)
    const existingLon = parseFloat(filter.lon)

    if (
      !Number.isNaN(existingLat) &&
      !Number.isNaN(existingLon) &&
      existingLat >= -90 &&
      existingLat <= 90 &&
      existingLon >= -180 &&
      existingLon <= 180
    ) {
      setParams({
        lat: existingLat,
        lon: existingLon,
        range: distance,
        unit: filter.unit,
      })

      setError(null)
      return
    }

    // Optional fallback if you still want manual address geocoding later.
    // For the Geoapify autocomplete-only flow, this usually will not run.
    if (!geocodeAddress) {
      setError('Please select an address from the suggestions.')
      return
    }

    try {
      setIsResolving(true)
      setError(null)

      const { lat, lon } = await geocodeAddress(address)

      setParams({
        lat,
        lon,
        range: distance,
        unit: filter.unit,
      })

      setFilter((prev) => ({
        ...prev,
        address,
        lat: String(lat),
        lon: String(lon),
      }))
    } catch (e) {
      console.error(e)
      setError(
        e instanceof Error
          ? e.message
          : 'Could not resolve address. Please check it and try again.'
      )
    } finally {
      setIsResolving(false)
    }
  }, [filter, geocodeAddress])

  const isActive = !!params

  return {
    filter,
    setFilter,
    params,
    error,
    apply,
    clear,
    isActive,
    isResolving,
  }
}
