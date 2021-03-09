import React from 'react'
import DropdownSection from './DropdownSection'
import TrialCard from './TrialCard'
import { MatchDetails, Study } from '../model'

export type MatchResultProps = {
  matchDetails: MatchDetails
  matchGroups: {
    matched: number[]
    partiallyMatched: number[]
    unmatched: number[]
  }
  studies: Study[]
}

function MatchResult({ matchDetails, matchGroups, studies }: MatchResultProps) {
  const { matched, partiallyMatched, unmatched } = matchGroups

  const studyById: { [id: number]: Study } = {}
  for (const study of studies) studyById[study.id] = study

  return (
    <>
      <DropdownSection name={`Matched (${matched.length})`}>
        {matched.map((id) => (
          <TrialCard
            matchInfoAlgorithm={matchDetails[id]}
            study={studyById[id]}
            key={id}
          />
        ))}
      </DropdownSection>
      <DropdownSection name={`Partially matched (${partiallyMatched.length})`}>
        {partiallyMatched.map((id) => (
          <TrialCard
            matchInfoAlgorithm={matchDetails[id]}
            study={studyById[id]}
            key={id}
          />
        ))}
      </DropdownSection>
      <DropdownSection name={`Unmatched (${unmatched.length})`}>
        {unmatched.map((id) => (
          <TrialCard
            matchInfoAlgorithm={matchDetails[id]}
            study={studyById[id]}
            key={id}
          />
        ))}
      </DropdownSection>
    </>
  )
}

export default MatchResult
