import type React from 'react'
import { useState } from 'react'
import {
  MoreHorizontal,
  ToggleLeft,
  ToggleRight,
  RotateCcw,
} from 'react-feather'
import ReactTooltip from 'react-tooltip'
import Button from '../components/Inputs/Button'
import LinkExternal from '../components/LinkExternal'
import MatchForm from '../components/MatchForm'
import MatchResult from '../components/MatchResult'
import type useGearboxData from '../hooks/useGearboxData'
import useScreenSize from '../hooks/useScreenSize'
import {
  getDefaultValues,
  getMatchDetails,
  getMatchGroups,
  markRelevantMatchFields,
} from '../utils'

export type MatchingPageProps = ReturnType<typeof useGearboxData>

function MatchingPage({ action, state, status }: MatchingPageProps) {
  const { fetchAll, updateMatchInput } = action
  const { conditions, config, criteria, studies, matchInput } = state

  const [isUpdating, setIsUpdating] = useState(false)
  const [isFilterActive, setIsFilterActive] = useState(true)
  const screenSize = useScreenSize()
  const [showFormOptions, setShowFormOptions] = useState(false)
  const [view, setView] = useState<'form' | 'result'>('form')

  if (status === 'loading') return <div>Loading...</div>
  if (status === 'error')
    return (
      <>
        <div className="pb-8">
          <p className="pb-4">Something went wrong! Please try again.</p>
          <Button size="normal" onClick={fetchAll}>
            Try again
          </Button>
        </div>
        <div className="pb-4">
          <p>
            &quot;Try again&quot; button did not fix the problem? Please try
            hard refresh.
          </p>
          <ul className="list-disc pl-8">
            <li>
              Chrome or Firefox: Press <strong>Ctrl + F5</strong> on Windows or{' '}
              <strong>Cmd + Shift + R</strong> on Mac
            </li>
            <li>
              Safari (Mac): Press <strong>Cmd + Option + R</strong>
            </li>
          </ul>
        </div>
        <p>
          Hard refresh did not fix the problem? Please reach out to{' '}
          <LinkExternal
            className="underline text-primary"
            to="mailto:gearbox_help@lists.uchicago.edu"
          >
            gearbox_help@lists.uchicago.edu
          </LinkExternal>
          .
        </p>
      </>
    )

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
    updateMatchInput(getDefaultValues(config))
  }
  function toggleFilter() {
    setIsFilterActive((isActive) => !isActive)
  }
  function toggleFormOptions() {
    setShowFormOptions((show) => !show)
  }
  function handleFormOptionsBlur(e: React.FocusEvent) {
    if (showFormOptions && !e.currentTarget.contains(e.relatedTarget))
      setShowFormOptions(false)
  }

  return screenSize.smAndDown ? (
    <>
      <div
        className="flex justify-center sticky top-0 bg-white z-10"
        style={{
          minHeight: '2.5rem',
        }}
      >
        <div
          className="w-full relative"
          onBlur={handleFormOptionsBlur}
          tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
        >
          <Button
            size="small"
            block
            outline={view !== 'form'}
            onClick={() => setView('form')}
          >
            <div className="py-2">Patient Info</div>
          </Button>
          {view === 'form' && (
            <div className="normal-case">
              <button
                className={`ml-2 px-1 absolute right-1 top-2 text-white ${
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
                <div className="absolute right-0 origin-top-right w-44 bg-white border border-gray-300 shadow-md mt-1 p-1">
                  <ul className="w-full text-sm text-center text-primary">
                    <li className="hover:bg-red-100">
                      <button
                        className="w-full p-2 "
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
          <div
            className="inline relative font-normal normal-case text-base"
            onBlur={handleFormOptionsBlur}
            tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
          >
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
