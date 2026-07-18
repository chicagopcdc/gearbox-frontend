import { fetchGearbox } from './utils'
import { StudyVersionAdjudication } from '../model'
import { getStudyVersions } from './studyVersions'

export type AdminStudyVersionGroups = {
  needsInput: StudyVersionAdjudication[]
  published: StudyVersionAdjudication[]
}

function sortByStudyCode(
  studyVersions: StudyVersionAdjudication[]
): StudyVersionAdjudication[] {
  return [...studyVersions].sort((a, b) =>
    a.study.code.localeCompare(b.study.code, undefined, {
      numeric: true,
      sensitivity: 'base',
    })
  )
}

export function getStudyVersionsAdjudication(): Promise<
  StudyVersionAdjudication[]
> {
  return fetchGearbox('/gearbox/study-versions-adjudication').then((res) => {
    if (res.status === 404) return []
    if (!res.ok) throw new Error('Failed to get studies requiring input')
    return res.json() as Promise<StudyVersionAdjudication[]>
  })
}

export async function getAdminStudyVersionGroups(): Promise<AdminStudyVersionGroups> {
  const [needsInput, activeStudyVersions] = await Promise.all([
    getStudyVersionsAdjudication(),
    getStudyVersions('ACTIVE'),
  ])
  const studiesNeedingInput = new Set(needsInput.map((sv) => sv.study.id))
  const published = activeStudyVersions.filter(
    (sv) => !studiesNeedingInput.has(sv.study.id)
  )

  return {
    needsInput: sortByStudyCode(needsInput),
    published: sortByStudyCode(published),
  }
}
