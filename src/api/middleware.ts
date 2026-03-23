import {
  MatchDetails,
  MatchFormValues,
  MatchGroupLocationOptions,
  MatchGroups,
} from '../model'
import { fetchGearbox } from './utils'

const baseUrl = '/gearbox-middleware'

function buildLocationUrl(location: MatchGroupLocationOptions): string {
  const { lat, lon, range, unit } = location
  return `&lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(
    String(lon)
  )}&range=${encodeURIComponent(String(range))}&unit=${encodeURIComponent(
    unit
  )}`
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
