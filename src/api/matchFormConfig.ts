import type { MatchFormConfig } from '../model'
import { fetchGearbox } from './utils'

function sortDiagnosisOptions(matchForm: MatchFormConfig): MatchFormConfig {
  return {
    ...matchForm,
    fields: matchForm.fields.map((f) => {
      if (f.name !== 'diagnosis' || !f.options) return f
      return {
        ...f,
        options: [...f.options].sort((a, b) =>
          a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })
        ),
      }
    }),
  }
}

export function getMatchFormConfig() {
  return fetchGearbox('/gearbox-middleware/match-form')
    .then((res) => res.json())
    .then(fetch)
    .then((res) => res.json() as Promise<MatchFormConfig>)
    .then(sortDiagnosisOptions)
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
