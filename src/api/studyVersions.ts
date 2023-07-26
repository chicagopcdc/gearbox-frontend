import type { StudyVersionStatus } from '../model'
import { StudyVersion } from '../model'
import { fetchGearbox } from './utils'

export function getStudyVersions(status: StudyVersionStatus) {
  return fetchGearbox(`/gearbox/study-versions/${status}`)
    .then((res) => res.json() as Promise<StudyVersion[]>)
    .catch(() => {
      console.error('Error fetching study version')
      return []
    })
}
