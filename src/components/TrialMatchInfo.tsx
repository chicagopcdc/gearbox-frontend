import { useState } from 'react'
import { Info, XCircle } from 'react-feather'
import ReactTooltip from 'react-tooltip'
import { MatchInfo, MatchInfoAlgorithm } from '../model'

type MatchInfoDetailsProps = {
  matchInfoId: string
  matchInfoAlgorithm: MatchInfoAlgorithm
  level?: number
}

function MatchInfoString({
  fieldName,
  fieldValue,
  fieldValueLabel,
  isMatched,
  operator,
}: MatchInfo) {
  let operatorString: string
  switch (operator) {
    case 'eq':
      operatorString = 'is equal to'
      break
    case 'gt':
      operatorString = 'is greater than'
      break
    case 'gte':
      operatorString = 'is greater than/equal to'
      break
    case 'lt':
      operatorString = 'is less than'
      break
    case 'lte':
      operatorString = 'is less than/equal to'
      break
    case 'ne':
      operatorString = 'is not'
  }

  const valueStringClassName =
    isMatched === undefined
      ? 'text-gray-700'
      : isMatched
      ? 'text-green-700'
      : 'text-red-700'

  return (
    <>
      {fieldName} <span className="italic text-gray-500">{operatorString}</span>{' '}
      <span className={valueStringClassName}>
        {fieldValueLabel !== undefined
          ? `"${fieldValueLabel}"`
          : typeof fieldValue === 'number'
          ? fieldValue
          : `"${fieldValue}"`}
      </span>
    </>
  )
}

function MatchInfoDetails({
  matchInfoId,
  matchInfoAlgorithm,
  level = 0,
}: MatchInfoDetailsProps) {
  const { criteria, operator } = matchInfoAlgorithm
  const space = 8
  return (
    <span>
      {criteria.map((crit, i) => (
        <span key={`${matchInfoId}-${level}-${i}`}>
          {level > 0 && i === 0 && (
            <>
              <span className="whitespace-pre">
                {' '.repeat((level - 1) * space) + '('}
              </span>
              <br />
            </>
          )}
          {i > 0 && (
            <>
              <span className="text-gray-500 italic"> {operator}</span>
              <br />
            </>
          )}
          {Object.prototype.hasOwnProperty.call(crit, 'fieldName') ? (
            <>
              <span className="whitespace-pre">
                {' '.repeat(level * space)}
              </span>
              <MatchInfoString {...(crit as MatchInfo)} />
            </>
          ) : (
            <MatchInfoDetails
              matchInfoId={matchInfoId}
              matchInfoAlgorithm={crit as MatchInfoAlgorithm}
              level={level + 1}
            />
          )}
          {level > 0 && i === criteria.length - 1 && (
            <>
              <br />
              <span className="whitespace-pre">
                {' '.repeat((level - 1) * space) + ')'}
              </span>
            </>
          )}
        </span>
      ))}
    </span>
  )
}

type TrialMatchInfoProps = {
  studyId: number
  studyMatchInfo: MatchInfoAlgorithm
  studyTitle: string
}

function TrialMatchInfo({
  studyId,
  studyMatchInfo,
  studyTitle,
}: TrialMatchInfoProps) {
  const matchInfoId = `match-info-${studyId}`

  const [showModal, setShowModal] = useState(false)
  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)

  return (
    <>
      <button
        className={`mr-2 ${showModal ? 'text-red-700' : 'hover:text-red-700'}`}
        onClick={openModal}
        data-tip
        data-for={matchInfoId}
        aria-label="Open Eligibility Criteria dialog"
      >
        <Info />
      </button>

      {showModal ? (
        <div
          id="match-info-modal"
          className="fixed w-screen h-screen left-0 top-0 flex items-center justify-center z-10"
          style={{ background: '#cccc' }}
          role="dialog"
          aria-labelledby="eligibility-criteria-dialog-title"
          aria-modal="true"
        >
          <div
            className="bg-white overflow-scroll"
            style={{ maxHeight: '95%', maxWidth: '95%' }}
          >
            <div className="text-sm sm:text-base p-4 sm:p-8">
              <div className="flex justify-between border-b pb-4 mb-4">
                <h3
                  id="eligibility-criteria-dialog-title"
                  className="font-bold mr-4"
                >
                  Eligibility Criteria for {studyTitle}
                </h3>
                <button
                  className="hover:text-red-700"
                  onClick={closeModal}
                  aria-label="Close Eligibility Criteria dialog"
                >
                  <XCircle />
                </button>
              </div>
              <MatchInfoDetails
                matchInfoId={matchInfoId}
                matchInfoAlgorithm={studyMatchInfo}
              />
            </div>
          </div>
        </div>
      ) : (
        <ReactTooltip
          id={matchInfoId}
          border
          borderColor="black"
          effect="solid"
          type="light"
        >
          <span>Click to see Eligibility Criteria</span>
        </ReactTooltip>
      )}
    </>
  )
}

export default TrialMatchInfo
