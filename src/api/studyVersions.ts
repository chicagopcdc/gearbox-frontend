import type { StudyVersionStatus } from '../model'
import { StudyVersion } from '../model'
import { fetchGearbox } from './utils'

export function getStudyVersions(status: StudyVersionStatus) {
  return fetchGearbox(`/gearbox/study-versions/${status}`).then(
    (res) => res.json() as Promise<StudyVersion[]>
  )
}

export function getStudyVersionById(id: number) {
  return fetchGearbox(`/gearbox/study-version/${id}`).then(
    (res) => res.json() as Promise<StudyVersion>
  )
}
