import {
  MatchDetails,
  MatchFormValues,
  MatchGroupLocationOptions,
  MatchGroups,
} from '../model'
import { fetchGearbox } from './utils'

const baseUrl = '/gearbox-middleware'

export function getMatchGroups(
  values: MatchFormValues,
  location?: MatchGroupLocationOptions
): Promise<MatchGroups> {
  const queryParams = encodeURIComponent(JSON.stringify(values))

  let url = `${baseUrl}/get_match_groups?values=${queryParams}`

  if (location) {
    const { lat, lon, range, unit } = location
    url += `&lat=${encodeURIComponent(String(lat))}`
    url += `&lon=${encodeURIComponent(String(lon))}`
    url += `&range=${encodeURIComponent(String(range))}`
    url += `&unit=${encodeURIComponent(unit)}`
  }

  return fetchGearbox(url).then((res) => res.json() as Promise<MatchGroups>)
}

export function getMatchDetails(
  values: MatchFormValues
): Promise<MatchDetails> {
  const queryParams = encodeURIComponent(JSON.stringify(values))

  const url = `${baseUrl}/get_match_details?values=${queryParams}`

  return fetchGearbox(url).then((res) => res.json() as Promise<MatchDetails>)
}

export function getVersion(): Promise<string> {
  const url = `${baseUrl}/_version`

  return fetchGearbox(url).then((res) => res.json() as Promise<string>)
}
