import { useEffect, useState } from 'react'
import { getStudyVersions } from '../api/studyVersions'
import { ApiStatus, StudyVersion, StudyVersionStatus } from '../model'

export function useStudyVersions(
  status: StudyVersionStatus
): [StudyVersion[], (svs: StudyVersion[]) => void, ApiStatus, () => void] {
  const [studyVersions, setStudyVersions] = useState<StudyVersion[]>([])
  const [loadingStatus, setLoadingStatus] = useState<ApiStatus>('not started')

  const fetchStudyVersions = (studyVersionStatus: StudyVersionStatus) => {
    setLoadingStatus('sending')
    getStudyVersions(studyVersionStatus)
      .then((studyVersions) => {
        setStudyVersions(studyVersions)
        setLoadingStatus('success')
      })
      .catch((err) => {
        console.error(err)
        setLoadingStatus('error')
      })
  }
  useEffect(() => {
    fetchStudyVersions(status)
  }, [status])

  return [
    studyVersions,
    setStudyVersions,
    loadingStatus,
    () => fetchStudyVersions(status),
  ]
}
