import {
  MatchDetails,
  MatchFormValues,
  MatchGroupLocationOptions,
  MatchGroups,
  MatchInfoResponse,
} from '../model'
import { fetchGearbox } from './utils'

const baseUrl = '/gearbox-middleware'
type MatchInfoOptions = {
  offsetMatched?: number
  limitMatched?: number
  offsetUnmatched?: number
  limitUnmatched?: number
  offsetUndetermined?: number
  limitUndetermined?: number
}

function buildLocationUrl(location: MatchGroupLocationOptions): string {
  const { lat, lon, range, unit } = location
  return `&lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(
    String(lon)
  )}&range=${encodeURIComponent(String(range))}&unit=${encodeURIComponent(
    unit
  )}`
}

function appendLocationParams(
  params: URLSearchParams,
  location?: MatchGroupLocationOptions
) {
  if (!location) return

  params.set('lat', String(location.lat))
  params.set('lon', String(location.lon))
  params.set('range', String(location.range))
  params.set('unit', location.unit)
}

export function getMatchGroups(
  values: MatchFormValues,
  location?: MatchGroupLocationOptions
): Promise<MatchGroups> {
  const queryParams = encodeURIComponent(JSON.stringify(values))

  let url = `${baseUrl}/get_match_groups?values=${queryParams}`

  if (location) {
    url += buildLocationUrl(location)
  }

  return fetchGearbox(url).then((res) => res.json() as Promise<MatchGroups>)
}

export function getMatchDetails(
  values: MatchFormValues,
  location?: MatchGroupLocationOptions
): Promise<MatchDetails> {
  const queryParams = encodeURIComponent(JSON.stringify(values))

  let url = `${baseUrl}/get_match_details?values=${queryParams}`
  if (location) {
    url += buildLocationUrl(location)
  }

  return fetchGearbox(url).then((res) => res.json() as Promise<MatchDetails>)
}

export function getVersion(): Promise<string> {
  const url = `${baseUrl}/_version`

  return fetchGearbox(url).then((res) => res.json() as Promise<string>)
}

export function getMatchInfo(
  values: MatchFormValues,
  location: MatchGroupLocationOptions | undefined,
  options: MatchInfoOptions
): Promise<MatchInfoResponse> {
  const params = new URLSearchParams()

  params.set('values', JSON.stringify(values))

  params.set('offset_matched', String(options.offsetMatched))
  params.set('limit_matched', String(options.limitMatched))

  params.set('offset_unmatched', String(options.offsetUnmatched))
  params.set('limit_unmatched', String(options.limitUnmatched))

  params.set('offset_undetermined', String(options.offsetUndetermined))
  params.set('limit_undetermined', String(options.limitUndetermined))

  appendLocationParams(params, location)

  return fetchGearbox(`${baseUrl}/get_match_info?${params.toString()}`).then(
    (res) => {
      if (!res.ok) {
        throw new Error('Failed to get match info')
      }

      return res.json() as Promise<MatchInfoResponse>
    }
  )
}
