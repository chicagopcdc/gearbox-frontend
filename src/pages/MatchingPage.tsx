import { useState } from 'react'
import {
  MoreHorizontal,
  ToggleLeft,
  ToggleRight,
  RotateCcw,
} from 'react-feather'
import ReactTooltip from 'react-tooltip'
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
  getDefaultValues,
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
  const [isFilterActive, setIsFilterActive] = useState(false)
  const screenSize = useScreenSize()
  const [showFormOptions, setShowFormOptions] = useState(false)
  const [view, setView] = useState<'form' | 'result'>('form')

  if (config.fields === undefined || Object.keys(matchInput).length === 0)
    return <div>Loading...</div>

  const defaultValues = getDefaultValues(config)
  const matchDetails = getMatchDetails(criteria, conditions, config, matchInput)
  const matchGroups = getMatchGroups(matchDetails)
  const markedFields = markRelevantMatchFields({
    conditions,
    criteria,
    fields: config.fields,
    unmatched: matchGroups.unmatched,
    values: matchInput,
  })

  function handleReset() {
    updateMatchInput(defaultValues)
  }
  function toggleFilter() {
    setIsFilterActive((isActive) => !isActive)
  }
  function toggleFormOptions() {
    setShowFormOptions((show) => !show)
  }

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
          <div className="w-full relative py-1">
            Patient Info
            {view === 'form' && (
              <div className="normal-case">
                <button
                  className={`ml-2 p-1 absolute right-0 top-0 ${
                    showFormOptions ? 'bg-red-500' : 'hover:bg-red-500'
                  }`}
                  data-for="match-form-menu"
                  data-tip
                  onClick={toggleFormOptions}
                >
                  <MoreHorizontal className="inline" size="1rem" />
                  <ReactTooltip
                    border
                    borderColor="black"
                    id="match-form-menu"
                    effect="solid"
                    place="bottom"
                    type="light"
                  >
                    <span>Options</span>
                  </ReactTooltip>
                </button>
                {showFormOptions && (
                  <div className="absolute right-0 origin-top-right w-44 bg-white border border-gray-300 shadow-md mt-2 p-1">
                    <ul className="w-full text-sm text-center text-primary">
                      <li className="hover:bg-red-100">
                        <button
                          className="w-full p-2"
                          onClick={toggleFilter}
                          data-tip
                          data-for="match-form-filter"
                        >
                          {isFilterActive ? (
                            <ToggleRight className="inline text" />
                          ) : (
                            <ToggleLeft className="inline text-gray-500" />
                          )}
                          <span className="mx-2">Filter questions</span>
                        </button>
                        <ReactTooltip
                          id="match-form-filter"
                          border
                          borderColor="black"
                          effect="solid"
                          place="right"
                          type="light"
                        >
                          <div style={{ maxWidth: '100px' }}>
                            Filter to display the relevant questions only or see
                            all
                          </div>
                        </ReactTooltip>
                      </li>
                      <li className="hover:bg-red-100">
                        <button className="w-full p-2" onClick={handleReset}>
                          <RotateCcw className="inline mr-2" size="1rem" />
                          Reset
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
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
            isFilterActive,
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
        <h1 className="sticky top-0 bg-white uppercase text-primary font-bold px-4 lg:px-8 py-2 z-10 flex items-end justify-between">
          <span>Patient Information</span>
          <div className="inline relative font-normal normal-case text-base">
            <button
              className={`px-2 py-1 ${
                showFormOptions ? 'bg-red-100' : 'hover:bg-red-100'
              }`}
              data-for="match-form-menu"
              data-tip
              onClick={toggleFormOptions}
            >
              <MoreHorizontal className="inline" size="1rem" />
              <ReactTooltip
                border
                borderColor="black"
                id="match-form-menu"
                effect="solid"
                place="left"
                type="light"
              >
                <span>Options</span>
              </ReactTooltip>
            </button>
            {showFormOptions && (
              <div className="absolute right-0 origin-top-right w-44 bg-white border border-gray-300 shadow-md mt-2 p-1">
                <ul className="w-full text-sm text-center">
                  <li className="hover:bg-red-100">
                    <button
                      className="w-full p-2"
                      data-for="match-form-filter"
                      data-tip
                      onClick={toggleFilter}
                    >
                      {isFilterActive ? (
                        <ToggleRight className="inline text" />
                      ) : (
                        <ToggleLeft className="inline text-gray-500" />
                      )}
                      <span className="mx-2">Filter questions</span>
                    </button>
                    <ReactTooltip
                      border
                      borderColor="black"
                      id="match-form-filter"
                      effect="solid"
                      place="left"
                      type="light"
                    >
                      <div style={{ maxWidth: '200px' }}>
                        Filter to display the relevant questions only or see all
                      </div>
                    </ReactTooltip>
                  </li>
                  <li className="hover:bg-red-100">
                    <button className="w-full p-2" onClick={handleReset}>
                      <RotateCcw className="inline mr-2" size="1rem" />
                      Reset
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </h1>
        <div className="px-4 lg:px-8 pb-4">
          <MatchForm
            {...{
              config: { groups: config.groups, fields: markedFields },
              matchInput,
              isFilterActive,
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
