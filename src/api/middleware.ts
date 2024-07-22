import { MatchDetails, MatchFormValues, MatchGroups } from '../model'
import { fetchGearbox } from './utils'

const baseUrl = '/gearbox-middleware'

export function getMatchGroups(values: MatchFormValues): Promise<MatchGroups> {
  const queryParams = encodeURIComponent(JSON.stringify(values))

  const url = `${baseUrl}/get_match_groups?values=${queryParams}`

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
