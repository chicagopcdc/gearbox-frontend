import React, { useEffect } from 'react'
import { useState } from 'react'
import {
  MoreHorizontal,
  RotateCcw,
  ToggleLeft,
  ToggleRight,
} from 'react-feather'
import ReactTooltip from 'react-tooltip'
import Button from '../components/Inputs/Button'
import MatchForm from '../components/MatchForm'
import MatchResult from '../components/MatchResult'
import type useGearboxData from '../hooks/useGearboxData'
import useScreenSize from '../hooks/useScreenSize'
import { getDefaultValues, markRelevantMatchFields } from '../utils'
import { ErrorRetry } from '../components/ErrorRetry'
import { getMatchDetails, getMatchGroups } from '../api/middleware'
import {
  MatchDetails,
  MatchFormFieldConfig,
  MatchFormValues,
  MatchGroups,
  UserInputUi,
} from '../model'
import {
  getAllUserInput,
  getLatestUserInput,
  postUserInput,
} from '../api/userInput'
import { useModal } from '../hooks/useModal'
import { UserInputModal } from '../components/UserInputModal'

export type MatchingPageProps = ReturnType<typeof useGearboxData>

function MatchingPage({ action, state, status }: MatchingPageProps) {
  const { fetchAll } = action
  const { conditions, config, criteria, studies } = state

  const [isUpdating, setIsUpdating] = useState(false)
  const [isFilterActive, setIsFilterActive] = useState(true)
  const screenSize = useScreenSize()
  const [showFormOptions, setShowFormOptions] = useState(false)
  const [view, setView] = useState<'form' | 'result'>('form')
  const [matchDetails, setMatchDetails] = useState<MatchDetails>(
    {} as MatchDetails
  )
  const [matchGroups, setMatchGroups] = useState<MatchGroups>({
    matched: [],
    unmatched: [],
    undetermined: [],
  })
  const [allUserInput, setAllUserInput] = useState<UserInputUi[]>([])
  const [currentUserInput, setCurrentUserInput] = useState<UserInputUi>({
    values: {},
  })
  const [markedFields, setMarkedFields] = useState<MatchFormFieldConfig[]>([])
  const [showAllUserInput, setShowAllUserInput] = useState<boolean>(true)
  const [showModal, openModal, closeModal] = useModal()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (process.env.ENABLE_PHI) {
          const allUserInput = await getAllUserInput()
          setAllUserInput(allUserInput)
          setShowAllUserInput(true)
        } else {
          const latestUserInput = await getLatestUserInput()
          setCurrentUserInput(latestUserInput)
          setShowAllUserInput(false)
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const matchInput = currentUserInput.values
    getMatchDetails(matchInput).then(setMatchDetails)
    getMatchGroups(matchInput).then(setMatchGroups)
  }, [currentUserInput])

  useEffect(() => {
    setMarkedFields(
      markRelevantMatchFields({
        conditions,
        criteria,
        fields: config.fields,
        unmatched: matchGroups.unmatched,
        values: currentUserInput.values,
        studies: studies,
      })
    )
  }, [
    conditions,
    criteria,
    config.fields,
    matchGroups.unmatched,
    currentUserInput,
    studies,
  ])
  if (status === 'sending') return <div>Loading...</div>
  if (status === 'error') {
    return ErrorRetry({ retry: fetchAll })
  }

  function updateMatchInput(newMatchedInput: MatchFormValues) {
    if (
      JSON.stringify(newMatchedInput) !==
      JSON.stringify(currentUserInput.values)
    ) {
      postUserInput(
        newMatchedInput,
        currentUserInput.id,
        currentUserInput.name
      ).then((res) => {
        setCurrentUserInput(res)
        if (showAllUserInput) {
          setAllUserInput(
            allUserInput.map((u) => {
              if (u.id === res.id) {
                return res
              } else {
                return u
              }
            })
          )
        }
      })
    }
  }

  function createMatchInput(name?: string) {
    postUserInput({}, undefined, name).then((res) => {
      setCurrentUserInput(res)
      if (showAllUserInput) {
        setAllUserInput([...allUserInput, res])
      }
    })
  }

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

  function loadUserInput(e: React.ChangeEvent<HTMLSelectElement>) {
    const currentUserInput = allUserInput.find(
      (userInput) => userInput.id === +e.target.value
    )
    if (currentUserInput) {
      setCurrentUserInput(currentUserInput)
    }
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
            matchInput: currentUserInput.values,
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
        {showAllUserInput && (
          <div className="flex flex-col px-4 lg:px-8 pt-4">
            <label htmlFor="userInputSelect" className="mb-1">
              User Input
            </label>
            <select
              id="userInputSelect"
              onChange={loadUserInput}
              value={currentUserInput.id || ''}
            >
              <option disabled value="">
                Select One
              </option>
              {allUserInput
                .filter((userInput) => !!userInput.name)
                .map((userInput) => (
                  <option key={userInput.id} value={userInput.id}>
                    {userInput.name}
                  </option>
                ))}
            </select>
            <Button otherClassName="mt-4 w-1/2" onClick={openModal}>
              Add New User Input
            </Button>
          </div>
        )}
        {showModal && (
          <UserInputModal
            closeModal={closeModal}
            createMatchInput={createMatchInput}
          />
        )}
        <div className="px-4 lg:px-8 pb-4">
          <MatchForm
            {...{
              config: { groups: config.groups, fields: markedFields },
              matchInput: currentUserInput.values,
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
