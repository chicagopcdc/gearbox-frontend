import DropdownSection from './DropdownSection'
import TrialCard from './TrialCard'
import type { MatchDetails, Study } from '../model'

export type MatchResultProps = {
  matchDetails: MatchDetails
  matchGroups: {
    [group in 'matched' | 'undetermined' | 'unmatched']: number[]
  }
  studies: Study[]
}

function MatchResult({ matchDetails, matchGroups, studies }: MatchResultProps) {
  const { matched, undetermined, unmatched } = matchGroups
  const studyById: { [id: number]: Study } = {}
  for (const study of studies) studyById[study.id] = study

  return (
    <>
      <DropdownSection name={`Matched (${matched.length})`}>
        <div className="mx-2">
          {matched.map((id) => (
            <TrialCard
              matchInfoAlgorithm={matchDetails[id]}
              study={studyById[id]}
              key={id}
            />
          ))}
        </div>
      </DropdownSection>
      <DropdownSection name={`Undetermined (${undetermined.length})`}>
        <div className="mx-2">
          {undetermined.map((id) => (
            <TrialCard
              matchInfoAlgorithm={matchDetails[id]}
              study={studyById[id]}
              key={id}
            />
          ))}
        </div>
      </DropdownSection>
      <DropdownSection name={`Unmatched (${unmatched.length})`}>
        <div className="mx-2">
          {unmatched.map((id) => (
            <TrialCard
              matchInfoAlgorithm={matchDetails[id]}
              study={studyById[id]}
              key={id}
            />
          ))}
        </div>
      </DropdownSection>
    </>
  )
}

export default MatchResult
