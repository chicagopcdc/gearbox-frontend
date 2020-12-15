import React from 'react'
import { Info } from 'react-feather'
import ReactTooltip from 'react-tooltip'
import { MatchInfoAlgorithm } from '../model'

type TrialMatchInfoProps = {
  studyId: number
  studyMatchInfo: MatchInfoAlgorithm
}

function TrialMatchInfo({ studyId, studyMatchInfo }: TrialMatchInfoProps) {
  const matchInfoId = `match-info-${studyId}`
  const matchInfoDetail = <pre>{JSON.stringify(studyMatchInfo, null, 2)}</pre>
  return (
    <>
      <Info className="mr-2" data-tip data-for={matchInfoId} />
      <ReactTooltip id={matchInfoId} effect="solid">
        {matchInfoDetail}
      </ReactTooltip>
    </>
  )
}

export default TrialMatchInfo
