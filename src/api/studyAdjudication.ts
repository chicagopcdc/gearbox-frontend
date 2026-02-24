import { fetchGearbox } from './utils'
import { StudyVersionAdjudication } from '../model'

export function getStudyVersionsAdjudication(): Promise<
  StudyVersionAdjudication[]
> {
  return fetchGearbox('/gearbox/study-versions-adjudication').then((res) => {
    if (!res.ok) {
      throw new Error(
        `Failed to load study versions adjudication (HTTP ${res.status})`
      )
    }
    return res.json() as Promise<StudyVersionAdjudication[]>
  })
}
