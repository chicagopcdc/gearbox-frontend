import { fetchGearbox } from './utils'
import { StudyVersionAdjudication } from '../model'
import { getStudyVersions } from './studyVersions'

export type AdminStudyVersionGroups = {
  needsInput: StudyVersionAdjudication[]
  published: StudyVersionAdjudication[]
}

const STUDY_ADJUDICATION_PATH = '/gearbox/study-versions-adjudication'

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

export async function getStudyVersionsAdjudication(): Promise<
  StudyVersionAdjudication[]
> {
  try {
    const res = await fetchGearbox(STUDY_ADJUDICATION_PATH)

    if (res.status === 404) {
      console.info('No studies requiring adjudication were found', {
        endpoint: STUDY_ADJUDICATION_PATH,
        status: res.status,
        statusText: res.statusText,
      })
      return []
    }
    if (!res.ok) {
      throw new Error(
        `Failed to get studies requiring input (${res.status} ${res.statusText})`
      )
    }
    return (await res.json()) as StudyVersionAdjudication[]
  } catch (error) {
    console.error('Failed to load studies requiring adjudication', {
      endpoint: STUDY_ADJUDICATION_PATH,
      error,
    })
    throw error
  }
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
