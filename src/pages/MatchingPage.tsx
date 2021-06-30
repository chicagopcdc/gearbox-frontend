import { useState } from 'react'
import Button from '../components/Inputs/Button'
import MatchForm from '../components/MatchForm'
import MatchResult from '../components/MatchResult'
import useScreenSize from '../hooks/useScreenSize'
import {
  EligibilityCriterion,
  MatchCondition,
  MatchFormConfig,
  MatchFormValues,
  Study,
} from '../model'

export type MatchingPageProps = {
  conditions: MatchCondition[]
  config: MatchFormConfig
  criteria: EligibilityCriterion[]
  studies: Study[]
  userInput: MatchFormValues
  updateUserInput(values: MatchFormValues): void
}

function MatchingPage({
  conditions,
  config,
  criteria,
  studies,
  userInput,
  updateUserInput,
}: MatchingPageProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const isMatchDataReady =
    config.fields !== undefined && Object.keys(userInput).length > 0

  const screenSize = useScreenSize()
  const [view, setView] = useState<'form' | 'result'>('form')

  return isMatchDataReady ? (
    screenSize.smAndDown ? (
      <>
        <div className="flex justify-center sticky top-0 bg-white">
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
            {...{ config, userInput, updateUserInput, setIsUpdating }}
          />
        </section>
        <section
          className={`p-4 lg:px-8 ${isUpdating ? 'bg-gray-100' : ''} ${
            view === 'result' ? '' : 'hidden'
          } `}
        >
          <MatchResult
            {...{ criteria, conditions, config, studies, userInput }}
          />
        </section>
      </>
    ) : (
      <div className="flex h-screen pb-8">
        <section className="h-full overflow-scroll w-1/2">
          <h1 className="sticky top-0 bg-white uppercase text-primary font-bold pl-4 lg:pl-8 py-2">
            Patient Information
          </h1>
          <div className="px-4 lg:px-8 pb-4">
            <MatchForm
              {...{ config, userInput, updateUserInput, setIsUpdating }}
            />
          </div>
        </section>
        <section className="h-full overflow-scroll w-1/2">
          <h1 className="sticky top-0 bg-white uppercase text-primary font-bold pl-4 lg:pl-8 py-2">
            Open Trials
          </h1>
          <div
            className={`px-4 lg:px-8 pb-4 ${isUpdating ? 'bg-gray-100' : ''}`}
          >
            <MatchResult
              {...{ criteria, conditions, config, studies, userInput }}
            />
          </div>
        </section>
      </div>
    )
  ) : (
    <div>Loading...</div>
  )
}

export default MatchingPage
