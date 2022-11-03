import { MatchCondition } from '../model'
import { fetchGearbox } from './utils'

export function getMatchConditions() {
  return fetchGearbox('/gearbox/match-conditions')
    .then((res) => res.json())
    .then(fetch)
    .then((res) => res.json() as Promise<MatchCondition[]>)
}
