import type { StudyVersionStatus } from '../model'
import { StudyVersion } from '../model'
import { fetchGearbox } from './utils'

export function getStudyVersions(
  status: StudyVersionStatus
): Promise<StudyVersion[]> {
  return fetchGearbox(`/gearbox/study-versions/${status}`).then((res) => {
    if (res.status === 404) {
      // If the endpoint returns 404, return an empty array instead of throwing
      return [] as StudyVersion[]
    }
    if (!res.ok) {
      throw new Error('Failed to get study versions')
    }
    return res.json() as Promise<StudyVersion[]>
  })
}

export function getStudyVersionById(id: number) {
  return fetchGearbox(`/gearbox/study-version/${id}`).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to get study version ${id} (HTTP ${res.status})`)
    }
    return res.json() as Promise<StudyVersion>
  })
}

export function updateStudyVersion(studyVersion: StudyVersion) {
  return fetchGearbox('/gearbox/update-study-version', {
    method: 'POST',
    body: JSON.stringify(studyVersion),
  })
}

export function publishStudyVersion(studyVersionId: number) {
  return fetchGearbox(`/gearbox/publish-study-version/${studyVersionId}`, {
    method: 'POST',
  })
}
