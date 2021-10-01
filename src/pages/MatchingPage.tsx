import { useState } from 'react'
import Button from '../components/Inputs/Button'
import MatchForm from '../components/MatchForm'
import MatchResult from '../components/MatchResult'
import useScreenSize from '../hooks/useScreenSize'
import type {
  EligibilityCriterion,
  MatchCondition,
  MatchFormConfig,
  MatchFormValues,
  Study,
} from '../model'
import {
  getMatchDetails,
  getMatchGroups,
  markRelevantMatchFields,
} from '../utils'

export type MatchingPageProps = {
  conditions: MatchCondition[]
  config: MatchFormConfig
  criteria: EligibilityCriterion[]
  studies: Study[]
  matchInput: MatchFormValues
  updateMatchInput(values: MatchFormValues): void
}

function MatchingPage({
  conditions,
  config,
  criteria,
  studies,
  matchInput,
  updateMatchInput,
}: MatchingPageProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const screenSize = useScreenSize()
  const [view, setView] = useState<'form' | 'result'>('form')

  if (config.fields === undefined || Object.keys(matchInput).length === 0)
    return <div>Loading...</div>

  const matchDetails = getMatchDetails(criteria, conditions, config, matchInput)
  const matchGroups = getMatchGroups(matchDetails)
  const markedFields = markRelevantMatchFields({
    conditions,
    criteria,
    fields: config.fields,
    unmatched: matchGroups.unmatched,
    values: matchInput,
  })

  return screenSize.smAndDown ? (
    <>
      <div
        className="flex justify-center sticky top-0 bg-white z-10"
        style={{
          minHeight: '2.5rem',
        }}
      >
        <Button
          size="small"
          block
          outline={view !== 'form'}
          onClick={() => setView('form')}
        >
          Patient Information
        </Button>
        <Button
          size="small"
          block
          outline={view !== 'result'}
          onClick={() => setView('result')}
        >
          Open Trials
        </Button>
      </div>
      <section className={`p-4 lg:px-8 ${view === 'form' ? '' : 'hidden'} `}>
        <MatchForm
          {...{
            config: { groups: config.groups, fields: markedFields },
            matchInput,
            updateMatchInput,
            setIsUpdating,
          }}
        />
      </section>
      <section
        className={`p-4 lg:px-8 transition-colors duration-300 ${
          isUpdating ? 'bg-gray-100' : 'bg-white'
        } ${view === 'result' ? '' : 'hidden'} `}
      >
        <MatchResult {...{ matchDetails, matchGroups, studies }} />
      </section>
    </>
  ) : (
    <div className="flex h-screen pb-8">
      <section className="h-full overflow-scroll w-1/2">
        <h1 className="sticky top-0 bg-white uppercase text-primary font-bold pl-4 lg:pl-8 py-2 z-10">
          Patient Information
        </h1>
        <div className="px-4 lg:px-8 pb-4">
          <MatchForm
            {...{
              config: { groups: config.groups, fields: markedFields },
              matchInput,
              updateMatchInput,
              setIsUpdating,
            }}
          />
        </div>
      </section>
      <section className="h-full overflow-scroll w-1/2">
        <h1 className="sticky top-0 bg-white uppercase text-primary font-bold pl-4 lg:pl-8 py-2 z-10">
          Open Trials
        </h1>
        <div
          className={`px-4 lg:px-8 pb-4 transition-colors duration-300 ${
            isUpdating ? 'bg-gray-100' : 'bg-white'
          }`}
        >
          <MatchResult {...{ matchDetails, matchGroups, studies }} />
        </div>
      </section>
    </div>
  )
}

export default MatchingPage
