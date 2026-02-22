import { useMemo } from 'react'
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
  const { matched = [], undetermined = [], unmatched = [] } = matchGroups

  const studyById = useMemo(() => {
    const dict: Record<number, Study> = {}
    studies.forEach((s) => { dict[s.id] = s })
    return dict
  }, [studies])

  const renderList = (ids: number[]) => (
    <div className="mx-2">
      {ids.map((id) => {
        const study = studyById[id]
        if (!study) return null

        return (
          <TrialCard study={study} key={id}>
            {matchDetails[id] && (
              <TrialMatchInfo
                study={study}
                studyMatchInfo={matchDetails[id]}
              />
            )}
          </TrialCard>
        )
      })}
    </div>
  )

  return (
    <>
      <DropdownSection name={`Matched (${matched.length})`}>
        {renderList(matched)}
      </DropdownSection>

      <DropdownSection name={`Undetermined (${undetermined.length})`}>
        {renderList(undetermined)}
      </DropdownSection>

      <DropdownSection name={`Unmatched (${unmatched.length})`}>
        {renderList(unmatched)}
      </DropdownSection>
    </>
  )
}

export default MatchResult