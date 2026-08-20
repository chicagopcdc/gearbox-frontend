import { AddressSuggestion, GeoapifyAutocompleteResponse } from '../model'
import { fetchGearbox } from './utils'

export async function autocompleteAddress(
  text: string,
  signal?: AbortSignal
): Promise<AddressSuggestion[]> {
  const trimmed = text.trim()

  if (trimmed.length < 3) {
    return []
  }

  const params = new URLSearchParams({
    text: trimmed,
  })

  const lang = navigator.language?.slice(0, 2)
  if (lang) {
    params.set('lang', lang)
  }

  // gearbox-middleware proxies this to Geoapify so the API key stays server
  // side and is never sent to the browser.
  const res = await fetchGearbox(
    `/gearbox-middleware/address-autocomplete?${params.toString()}`,
    { signal }
  )

  if (!res.ok) {
    throw new Error('Unable to search addresses.')
  }

  const data = (await res.json()) as GeoapifyAutocompleteResponse

  return (data.results || [])
    .filter((result) => result.lat != null && result.lon != null)
    .map((result, index) => ({
      id: result.place_id || `${result.lat},${result.lon},${index}`,
      formatted: result.formatted || '',
      addressLine1: result.address_line1,
      addressLine2: result.address_line2,
      lat: Number(result.lat),
      lon: Number(result.lon),
    }))
    .filter((suggestion) => suggestion.formatted)
}
