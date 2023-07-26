import { useEffect, useState } from 'react'
import { getStudyVersions } from '../api/studyVersions'
import { LoadingStatus, StudyVersion, StudyVersionStatus } from '../model'

export function useStudyVersions(
  status: StudyVersionStatus
): [StudyVersion[], LoadingStatus, () => void] {
  const [studyVersions, setStudyVersions] = useState<StudyVersion[]>([])
  const [loadingStatus, setLoadingStatus] =
    useState<LoadingStatus>('not started')

  const fetchStudyVersions = (studyVersionStatus: StudyVersionStatus) => {
    setLoadingStatus('loading')
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

  return [studyVersions, loadingStatus, () => fetchStudyVersions(status)]
}
