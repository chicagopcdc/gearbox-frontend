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
        {matched.map((id) => (
          <TrialCard
            matchInfoAlgorithm={matchDetails[id]}
            study={studyById[id]}
            key={id}
          />
        ))}
      </DropdownSection>
      <DropdownSection name={`Undetermined (${undetermined.length})`}>
        {undetermined.map((id) => (
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
