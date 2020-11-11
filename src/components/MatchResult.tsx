import React from 'react'
import DropdownSection from './DropdownSection'
import TrialCard from './TrialCard'
import { Study } from '../model'

type MatchResultProps = {
  matchIds: number[]
  studies: Study[]
}

function MatchResult({ matchIds, studies }: MatchResultProps) {
  const matched = studies.filter(({ id }) => matchIds.includes(id))
  const unmatched = studies.filter(({ id }) => !matchIds.includes(id))

  return (
    <>
      <DropdownSection name={`Matched (${matched.length})`}>
        {matched.map((study, i) => (
          <TrialCard study={study} key={i} />
        ))}
      </DropdownSection>
      <DropdownSection name={`Unmatched (${unmatched.length})`}>
        {unmatched.map((study, i) => (
          <TrialCard study={study} key={i} />
        ))}
      </DropdownSection>
    </>
  )
}

export default MatchResult
