import React from 'react'
import DropdownSection from './DropdownSection'
import TrialCard from './TrialCard'
import { MatchDetails, Study } from '../model'

type MatchResultProps = {
  matchDetails: MatchDetails
  matchIds: number[]
  studies: Study[]
}

function MatchResult({ matchDetails, matchIds, studies }: MatchResultProps) {
  const matched = studies.filter(({ id }) => matchIds.includes(id))
  const unmatched = studies.filter(({ id }) => !matchIds.includes(id))

  return (
    <>
      <DropdownSection name={`Matched (${matched.length})`}>
        {matched.map((study, i) => (
          <TrialCard
            matchInfoAlgorithm={matchDetails[study.id]}
            study={study}
            key={i}
          />
        ))}
      </DropdownSection>
      <DropdownSection name={`Unmatched (${unmatched.length})`}>
        {unmatched.map((study, i) => (
          <TrialCard
            matchInfoAlgorithm={matchDetails[study.id]}
            study={study}
            key={i}
          />
        ))}
      </DropdownSection>
    </>
  )
}

export default MatchResult
