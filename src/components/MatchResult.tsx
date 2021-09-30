import DropdownSection from './DropdownSection'
import TrialCard from './TrialCard'
import type {
  EligibilityCriterion,
  MatchCondition,
  MatchFormConfig,
  MatchFormValues,
  Study,
} from '../model'
import { getMatchDetails, getMatchGroups } from '../utils'

export type MatchResultProps = {
  conditions: MatchCondition[]
  config: MatchFormConfig
  criteria: EligibilityCriterion[]
  matchInput: MatchFormValues
  studies: Study[]
}

function MatchResult({
  criteria,
  conditions,
  config,
  matchInput,
  studies,
}: MatchResultProps) {
  const matchDetails = getMatchDetails(criteria, conditions, config, matchInput)
  const { matched, undetermined, unmatched } = getMatchGroups(matchDetails)
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
