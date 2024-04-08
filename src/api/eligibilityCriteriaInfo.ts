import { fetchGearbox } from './utils'
import { EligibilityCriteriaInfo } from '../model'

export function updateEligibilityCriteriaInfo(
  infoId: number,
  info: EligibilityCriteriaInfo
) {
  return fetchGearbox(`/gearbox/update-eligibility-criteria-info/${infoId}`, {
    method: 'POST',
    body: JSON.stringify(info),
  }).then((res) => res.json() as Promise<EligibilityCriteriaInfo>)
}
