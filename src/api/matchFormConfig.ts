import type { MatchFormConfig } from '../model'
import { fetchGearbox } from './utils'

export function getMatchFormConfig() {
  return fetchGearbox('/gearbox/match-form')
    .then((res) => res.json())
    .then(fetch)
    .then((res) => res.json() as Promise<MatchFormConfig>)
}

export function updateMatchFormConfig(matchFormConfig: MatchFormConfig) {
  return fetchGearbox('/gearbox/update-match-form', {
    method: 'POST',
    body: JSON.stringify(matchFormConfig),
  }).then((res) => res.json())
}

export function buildMatchForm(save: boolean) {
  return fetchGearbox(`/gearbox/build-match-form/?save=${save}`, {
    method: 'POST',
  }).then((res) => res.json() as Promise<MatchFormConfig>)
}
