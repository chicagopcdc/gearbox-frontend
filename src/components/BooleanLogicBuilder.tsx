import React, { useState } from 'react'
import { MatchingPageProps } from '../pages/MatchingPage'
import { Check, Edit } from 'react-feather'
import ReactTooltip from 'react-tooltip'
import { Criterion, PublishIssue, StudyVersion } from '../model'
import { useModal } from '../hooks/useModal'
import { CriteriaBuilderModal } from './CriteriaBuilderModal'
import Button from './Inputs/Button'
import { publishStudyVersion, updateStudyVersion } from '../api/studyVersions'
import { getStudies } from '../api/studies'
import { PublishIssuesModal } from './PublishIssuesModal'

export function BooleanLogicBuilder({
  gearboxState,
  studyVersion,
  studyVersions,
  setStudyVersions,
  criteriaNotInMatchForm,
}: {
  gearboxState: MatchingPageProps['state']
  studyVersion: StudyVersion
  studyVersions: StudyVersion[]
  setStudyVersions: (svs: StudyVersion[]) => void
  criteriaNotInMatchForm: Criterion[]
}) {
  const { study, status } = studyVersion
  const matchInfoId = `match-info-${study.id}`

  const [showCriteriaModal, openCriteriaModal, closeCriteriaModal] = useModal()

  const [showPublishIssueModal, openPublishIssueModal, closePublishIssueModal] =
    useModal()

  const [updated, setUpdated] = useState(false)

  const [publishErrors, setPublishErrors] = useState<PublishIssue[]>([])
  const [publishWarnings, setPublishWarnings] = useState<PublishIssue[]>([])
  const [publishing, setPublishing] = useState<boolean>(false)

  const [statusAction, setStatusAction] = useState<
    null | 'publish' | 'markInProgress'
  >(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const isChangingStatus = statusAction !== null

  const attemptPublish = (ignoreWarnings: boolean) => {
    setStatusAction('publish')
    setActionError(null)
    setPublishing(true)
    setPublishErrors([])

    if (!ignoreWarnings) {
      setPublishWarnings([])
    }

    return publishStudyVersion(studyVersion.id, {
      ignore_warnings: ignoreWarnings,
    })
      .then((failure) => {
        if (!failure) {
          return getStudies().then(() => {
            setStudyVersions(
              studyVersions.filter((sv) => sv.id !== studyVersion.id)
            )
            setUpdated(true)
            closePublishIssueModal()
          })
        }

        // failure -> open modal with error/warning details
        setPublishErrors(failure.detail.publish_errors ?? [])
        setPublishWarnings(failure.detail.publish_warnings ?? [])
        openPublishIssueModal()
      })
      .catch((err) => {
        console.error(err)
        setActionError('Publish failed. Please try again.')
        setPublishErrors([
          { message: 'Publish failed. Please try again.', details: null },
        ])
        setPublishWarnings([])
        openPublishIssueModal()
      })
      .finally(() => {
        setPublishing(false)
        setStatusAction(null)
      })
  }

  const changeStudyStatus = () => {
    if (status === 'IN_PROCESS') {
      return attemptPublish(false)
    }

    if (status === 'ACTIVE') {
      const payload: StudyVersion = {
        ...studyVersion,
        status: 'IN_PROCESS',
      }
      setStatusAction('markInProgress')
      setActionError(null)

      return updateStudyVersion(payload)
        .then(getStudies)
        .then(() => {
          setStudyVersions(
            studyVersions.filter((sv) => sv.id !== studyVersion.id)
          )
          setUpdated(true)
        })
        .catch((err) => {
          console.error(err)
          setActionError(
            'Failed to mark study as In Progress. Please try again.'
          )
        })
        .finally(() => {
          setStatusAction(null)
        })
    }
  }

  return (
    <div>
      <div className="flex">
        {updated && (
          <h2 className="text-base text-green-600 mr-4 flex">
            <Check />
            Updated Successfully
          </h2>
        )}
        {actionError && (
          <h2 className="text-base text-red-600 mr-4 flex">{actionError}</h2>
        )}
        <Button onClick={changeStudyStatus} disabled={isChangingStatus}>
          {status === 'ACTIVE'
            ? statusAction === 'markInProgress'
              ? 'Updating…'
              : 'Mark as In Progress'
            : statusAction === 'publish'
            ? 'Publishing…'
            : 'Publish'}
        </Button>
        <button
          className={`mr-2 ml-4 ${
            showCriteriaModal ? 'text-red-700' : 'hover:text-red-700'
          } ${isChangingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={openCriteriaModal}
          data-tip
          data-for={matchInfoId}
          aria-label="Open Edit Eligibility Criteria dialog"
          disabled={isChangingStatus}
        >
          <Edit />
        </button>
      </div>

      {showPublishIssueModal && (
        <PublishIssuesModal
          errors={publishErrors}
          warnings={publishWarnings}
          loading={publishing}
          onClose={closePublishIssueModal}
          onIgnoreWarnings={() => attemptPublish(true)}
          studyName={studyVersion.study.name}
          studyCode={studyVersion.study.code}
        />
      )}

      {showCriteriaModal ? (
        <CriteriaBuilderModal
          matchForm={gearboxState.config}
          criteriaNotInMatchForm={criteriaNotInMatchForm}
          studyVersionId={studyVersion.id}
          closeModal={closeCriteriaModal}
          setUpdated={setUpdated}
        />
      ) : (
        <ReactTooltip
          id={matchInfoId}
          border
          borderColor="black"
          effect="solid"
          type="light"
        >
          <span>Click to edit Eligibility Criteria</span>
        </ReactTooltip>
      )}
    </div>
  )
}
