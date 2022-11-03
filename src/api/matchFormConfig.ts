import { MatchFormConfig } from '../model'
import { fetchGearbox } from './utils'

export function getMatchFormConfig() {
  return fetchGearbox('/gearbox/match-form')
    .then((res) => res.json())
    .then(fetch)
    .then((res) => res.json() as Promise<MatchFormConfig>)
}
