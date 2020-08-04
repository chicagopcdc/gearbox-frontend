import React from 'react'
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
      {matched.length > 0 && (
        <>
          <h2 className="font-bold text-center">Matched</h2>
          {matched.map((study, i) => (
            <TrialCard study={study} key={i} />
          ))}
          <br />
        </>
      )}
      {unmatched.length > 0 && (
        <>
          <h2 className="font-bold text-center">Unmatched</h2>
          {unmatched.map((study, i) => (
            <TrialCard study={study} key={i} />
          ))}
        </>
      )}
    </>
  )
}

export default MatchStatus
