import React from 'react'
import DropdownSection from './DropdownSection'
import TrialCard from './TrialCard'
import { Study } from '../model'

type MatchStatusProps = {
  matchIds: number[]
  studies: Study[]
}

const MatchStatus = ({ matchIds, studies }: MatchStatusProps) => {
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

export default MatchStatus
