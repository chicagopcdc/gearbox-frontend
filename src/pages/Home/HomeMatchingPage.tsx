import { useState } from 'react'
import Button from '../../components/Inputs/Button'
import MatchForm from '../../components/MatchForm'
import MatchResult from '../../components/MatchResult'
import useScreenSize from '../../hooks/useScreenSize'
import {
  EligibilityCriterion,
  MatchCondition,
  MatchFormConfig,
  MatchFormValues,
  Study,
} from '../../model'

export type HomeMatchingPageProps = {
  conditions: MatchCondition[]
  config: MatchFormConfig
  criteria: EligibilityCriterion[]
  studies: Study[]
  userInput: MatchFormValues
  updateUserInput(values: MatchFormValues): void
}

function HomeMatchingPage({
  conditions,
  config,
  criteria,
  studies,
  userInput,
  updateUserInput,
}: HomeMatchingPageProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const isMatchDataReady =
    config.fields !== undefined && Object.keys(userInput).length > 0

  const screenSize = useScreenSize()
  const [view, setView] = useState('form')

  return isMatchDataReady ? (
    <>
      {screenSize.smAndDown && (
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
      )}
      <div className="md:flex">
        {(screenSize.mdAndUp || view === 'form') && (
          <section className="md:w-1/2 p-4 lg:px-8">
            <h1 className="uppercase text-primary font-bold">
              Patient Information
            </h1>
            <MatchForm
              {...{ config, userInput, updateUserInput, setIsUpdating }}
            />
          </section>
        )}
        {(screenSize.mdAndUp || view === 'result') && (
          <section
            className={`md:w-1/2 p-4 lg:px-8 ${
              isUpdating ? 'bg-gray-100' : ''
            }`}
          >
            <h1 className="uppercase text-primary font-bold">Open Trials</h1>
            <MatchResult
              {...{ criteria, conditions, config, studies, userInput }}
            />
          </section>
        )}
      </div>
    </>
  ) : (
    <div>Loading...</div>
  )
}

export default HomeMatchingPage
