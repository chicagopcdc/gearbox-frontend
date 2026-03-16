import type {
  PublishFailureResponse,
  PublishIssue,
  StudyVersionStatus,
} from '../model'
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
  return fetchGearbox(`/gearbox/study-version/${id}`).then(
    (res) => res.json() as Promise<StudyVersion>
  )
}

export function updateStudyVersion(studyVersion: StudyVersion) {
  return fetchGearbox('/gearbox/update-study-version', {
    method: 'POST',
    body: JSON.stringify(studyVersion),
  })
}

export function publishStudyVersion(
  studyVersionId: number,
  opts?: { ignore_warnings?: boolean }
): Promise<PublishFailureResponse | null> {
  return fetchGearbox(`/gearbox/publish-study-version/${studyVersionId}`, {
    method: 'POST',
    body: JSON.stringify({ ignore_warnings: !!opts?.ignore_warnings }),
  }).then((res) => {
    if (res.ok) return null

    return res
      .json()
      .catch(() => null)
      .then((payload) => {
        if (isPublishFailureResponse(payload)) {
          return {
            detail: {
              publish_errors: normalizeIssues(payload.detail.publish_errors),
              publish_warnings: normalizeIssues(
                payload.detail.publish_warnings
              ),
            },
          }
        }
        return {
          detail: {
            publish_errors: [
              { message: 'Publish failed. Please try again.', details: null },
            ],
            publish_warnings: [],
          },
        }
      })
  })
}

function isPublishFailureResponse(x: any): x is PublishFailureResponse {
  return x && typeof x === 'object' && x.detail && typeof x.detail === 'object'
}

function normalizeIssues(x: any): PublishIssue[] {
  if (!Array.isArray(x)) return []
  return x
    .filter((i) => i && typeof i === 'object' && typeof i.message === 'string')
    .map((i) => ({
      message: i.message,
      details: Array.isArray(i.details) ? i.details : i.details ?? null,
    }))
}
