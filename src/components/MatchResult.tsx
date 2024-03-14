import DropdownSection from './DropdownSection'
import TrialCard from './TrialCard'
import type { MatchDetails, MatchGroups, Study } from '../model'
import TrialMatchInfo from './TrialMatchInfo'

export type MatchResultProps = {
  matchDetails: MatchDetails
  matchGroups: MatchGroups
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
            <TrialCard study={studyById[id]} key={id}>
              {matchDetails[id] && (
                <TrialMatchInfo
                  study={studyById[id]}
                  studyMatchInfo={matchDetails[id]}
                />
              )}
            </TrialCard>
          ))}
        </div>
      </DropdownSection>
      <DropdownSection name={`Undetermined (${undetermined.length})`}>
        <div className="mx-2">
          {undetermined.map((id) => (
            <TrialCard study={studyById[id]} key={id}>
              {matchDetails[id] && (
                <TrialMatchInfo
                  study={studyById[id]}
                  studyMatchInfo={matchDetails[id]}
                />
              )}
            </TrialCard>
          ))}
        </div>
      </DropdownSection>
      <DropdownSection name={`Unmatched (${unmatched.length})`}>
        <div className="mx-2">
          {unmatched.map((id) => (
            <TrialCard study={studyById[id]} key={id}>
              {matchDetails[id] && (
                <TrialMatchInfo
                  study={studyById[id]}
                  studyMatchInfo={matchDetails[id]}
                />
              )}
            </TrialCard>
          ))}
        </div>
      </DropdownSection>
    </>
  )
}

export default MatchResult
