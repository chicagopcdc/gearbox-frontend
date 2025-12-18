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

  const clear = useCallback(() => {
    setFilter({
      mode: filter.mode, // keep current mode
      lat: '',
      lon: '',
      distance: '',
      unit: 'km', // or filter.unit if you want to preserve the last unit
      address: filter.mode === 'address' ? '' : filter.address,
    })
    setParams(null)
    setError(null)
  }, [filter.mode, filter.address])

  const apply = useCallback(async () => {
    const distance = parseFloat(filter.distance)
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
        unit: filter.unit, // 'km' or 'mi'
      })
      setError(null)
      return
    }

    // ADDRESS MODE
    if (!geocodeAddress) {
      setError('Address lookup is not configured yet.')
      return
    }

    if (!filter.address.trim()) {
      setError('Please enter an address.')
      return
    }

    try {
      setIsResolving(true)
      setError(null)
      const { lat, lon } = await geocodeAddress(filter.address)

      setParams({
        lat,
        lon,
        range: distance,
        unit: filter.unit, // 'km' or 'mi'
      })

      // Optionally show resolved lat/lon in the fields
      setFilter((prev) => ({
        ...prev,
        lat: String(lat),
        lon: String(lon),
      }))
    } catch (e) {
      console.error(e)
      setError('Could not resolve address. Please check it and try again.')
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
