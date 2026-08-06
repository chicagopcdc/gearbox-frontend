import { AddressSuggestion, GeoapifyAutocompleteResponse } from '../model'

export async function autocompleteAddress(
  text: string,
  signal?: AbortSignal
): Promise<AddressSuggestion[]> {
  const apiKey = window.RUNTIME_CONFIG?.GEOAPIFY_API_KEY

  if (!apiKey) {
    throw new Error('Geoapify API key is not configured.')
  }

  const trimmed = text.trim()

  if (trimmed.length < 3) {
    return []
  }

  const params = new URLSearchParams({
    text: trimmed,
    format: 'json',
    limit: '5',
    apiKey,
  })

  const lang = navigator.language?.slice(0, 2)
  if (lang) {
    params.set('lang', lang)
  }

  const res = await fetch(
    `https://api.geoapify.com/v1/geocode/autocomplete?${params.toString()}`,
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
