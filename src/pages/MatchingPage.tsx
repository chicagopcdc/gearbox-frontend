import React, { useEffect, useState } from 'react'
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
import { getMatchGroups, getMatchInfo } from '../api/middleware'
import {
  MatchDetails,
  MatchFormFieldConfig,
  MatchFormValues,
  MatchGroupCounts,
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
import { useLocationFilter } from '../hooks/useLocationFilter'
import { LocationFilterSection } from '../components/LocationFilterSection'

export type MatchingPageProps = ReturnType<typeof useGearboxData>

const MATCH_PAGE_SIZE = 4

type MatchGroupKey = keyof MatchGroups

const INITIAL_MATCH_PAGES: Record<MatchGroupKey, number> = {
  matched: 1,
  unmatched: 1,
  undetermined: 1,
}

const INITIAL_MATCH_COUNTS: MatchGroupCounts = {
  matched: 0,
  unmatched: 0,
  undetermined: 0,
}

function MatchingPage({
  action,
  state,
  status,
  importantQuestionsConfig,
}: MatchingPageProps) {
  const { fetchAll } = action
  const { conditions, config, criteria, studies } = state //Add

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

  // Unlike matchGroups (paginated, drives the results list), this always holds every
  // matched/undetermined/unmatched study id, so Map View can show all trials regardless
  // of which list page is currently selected.
  const [allMatchGroups, setAllMatchGroups] = useState<MatchGroups>({
    matched: [],
    unmatched: [],
    undetermined: [],
  })

  const [allUnmatchedStudyIds, setAllUnmatchedStudyIds] = useState<number[]>([])
  const [matchCounts, setMatchCounts] =
    useState<MatchGroupCounts>(INITIAL_MATCH_COUNTS)

  const [matchPages, setMatchPages] =
    useState<Record<MatchGroupKey, number>>(INITIAL_MATCH_PAGES)

  const [allUserInput, setAllUserInput] = useState<UserInputUi[]>([])
  const [currentUserInput, setCurrentUserInput] = useState<UserInputUi>({
    values: {},
  })
  const [markedFields, setMarkedFields] = useState<MatchFormFieldConfig[]>([])
  const [showAllUserInput, setShowAllUserInput] = useState<boolean>(true)
  const [showModal, openModal, closeModal] = useModal()
  const [errorDetail, setErrorDetail] = useState<string | null>(null)
  const [triedBrowserLocation, setTriedBrowserLocation] =
    useState<boolean>(false)

  const {
    filter: locationFilter,
    setFilter: setLocationFilter,
    params: locationParams,
    error: locationError,
    apply: applyLocationFilter,
    clear: clearLocationFilter,
    isActive: isLocationActive,
    isResolving: isLocationResolving,
  } = useLocationFilter()

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
    setMatchPages(INITIAL_MATCH_PAGES)
  }, [currentUserInput.values, locationParams])

  useEffect(() => {
    let ignore = false

    const matchInput = currentUserInput.values

    const locationForApi = locationParams
      ? {
          lat: locationParams.lat,
          lon: locationParams.lon,
          range: locationParams.range,
          unit: locationParams.unit,
        }
      : undefined

    getMatchInfo(matchInput, locationForApi, {
      offsetMatched: (matchPages.matched - 1) * MATCH_PAGE_SIZE,
      limitMatched: MATCH_PAGE_SIZE,

      offsetUnmatched: (matchPages.unmatched - 1) * MATCH_PAGE_SIZE,
      limitUnmatched: MATCH_PAGE_SIZE,

      offsetUndetermined: (matchPages.undetermined - 1) * MATCH_PAGE_SIZE,
      limitUndetermined: MATCH_PAGE_SIZE,
    })
      .then(({ groups, match_details, total_counts, all_unmatched }) => {
        if (ignore) return

        setMatchGroups(groups)
        setMatchDetails(match_details)
        setMatchCounts(total_counts)
        setAllUnmatchedStudyIds(all_unmatched)
        setErrorDetail(null)
      })
      .catch((e: Error) => {
        if (ignore) return

        console.error(e)
        setErrorDetail(e.message)
      })

    return () => {
      ignore = true
    }
  }, [currentUserInput.values, locationParams, matchPages])

  // Separate from the paginated getMatchInfo effect above (and deliberately not keyed on
  // matchPages) so that changing the list's page never triggers a refetch of the full groups.
  useEffect(() => {
    let ignore = false

    const matchInput = currentUserInput.values

    const locationForApi = locationParams
      ? {
          lat: locationParams.lat,
          lon: locationParams.lon,
          range: locationParams.range,
          unit: locationParams.unit,
        }
      : undefined

    getMatchGroups(matchInput, locationForApi)
      .then((groups) => {
        if (ignore) return

        setAllMatchGroups(groups)
      })
      .catch((e: Error) => {
        if (ignore) return

        console.error(e)
      })

    return () => {
      ignore = true
    }
  }, [currentUserInput.values, locationParams])

  useEffect(() => {
    setMarkedFields(
      markRelevantMatchFields({
        conditions,
        criteria,
        fields: config.fields,
        unmatched: allUnmatchedStudyIds,
        values: currentUserInput.values,
        studies: studies,
      })
    )
  }, [
    conditions,
    criteria,
    config.fields,
    currentUserInput,
    studies,
    allUnmatchedStudyIds,
  ])

  useEffect(() => {
    if (triedBrowserLocation) return
    if (!navigator.geolocation) return
    if (locationFilter.lat || locationFilter.lon) return

    setTriedBrowserLocation(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationFilter({
          ...locationFilter,
          mode: 'coordinates',
          lat: String(position.coords.latitude),
          lon: String(position.coords.longitude),
        })
      },
      (error) => {
        console.error('Unable to get browser location', error)
      }
    )
  }, [
    triedBrowserLocation,
    locationFilter.lat,
    locationFilter.lon,
    locationFilter,
    setLocationFilter,
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
      postUserInput(newMatchedInput, currentUserInput.id, currentUserInput.name)
        .then((res) => {
          setCurrentUserInput(res)
          setErrorDetail(null)
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
        .catch((e: Error) => setErrorDetail(e.message))
    }
  }

  const patientValuesByFieldName = Object.fromEntries(
    config.fields.flatMap((field) => {
      const value = currentUserInput.values[field.id]
      const names = [field.name, field.label].filter(
        (name): name is string => typeof name === 'string' && name !== ''
      )

      return names.map((name) => [name, value])
    })
  )

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
    setErrorDetail(null)
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

  function changeMatchPage(group: MatchGroupKey, direction: -1 | 1) {
    setMatchPages((pages) => {
      const pageCount = Math.max(
        1,
        Math.ceil(matchCounts[group] / MATCH_PAGE_SIZE)
      )

      return {
        ...pages,
        [group]: Math.min(pageCount, Math.max(1, pages[group] + direction)),
      }
    })
  }

  function setMatchPage(group: MatchGroupKey, page: number) {
    setMatchPages((pages) => {
      const pageCount = Math.max(
        1,
        Math.ceil(matchCounts[group] / MATCH_PAGE_SIZE)
      )

      return {
        ...pages,
        [group]: Math.min(pageCount, Math.max(1, page)),
      }
    })
  }

  const locationFilterSection = (
    <LocationFilterSection
      filter={locationFilter}
      onChange={setLocationFilter}
      onApply={applyLocationFilter}
      onClear={clearLocationFilter}
      isActive={isLocationActive}
      error={locationError}
      isResolving={isLocationResolving}
    />
  )

  return (
    <>
      {/* Global validation banner (shown once for both layouts) */}
      {errorDetail && (
        <div
          role="alert"
          aria-live="polite"
          className="mx-4 lg:mx-8 my-3 rounded-md border border-red-300 bg-red-50 p-3 text-red-800"
        >
          <p className="text-sm">{errorDetail}</p>
          <button
            onClick={handleReset}
            className="mt-2 underline decoration-red-400 hover:opacity-80"
          >
            Reset and start over
          </button>
        </div>
      )}
      {screenSize.smAndDown ? (
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
                              Filter to display the relevant questions only or
                              see all
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
          <section
            className={`p-4 lg:px-8 ${view === 'form' ? '' : 'hidden'} `}
          >
            <MatchForm
              {...{
                config: { groups: config.groups, fields: markedFields },
                matchInput: currentUserInput.values,
                isFilterActive,
                updateMatchInput,
                setIsUpdating,
                importantQuestionsConfig,
                locationFilterSection,
              }}
            />
          </section>
          <section
            className={`p-4 lg:px-8 transition-colors duration-300 ${
              isUpdating ? 'bg-gray-100' : 'bg-white'
            } ${view === 'result' ? '' : 'hidden'} `}
          >
            <MatchResult
              matchDetails={matchDetails}
              matchGroups={matchGroups}
              allMatchGroups={allMatchGroups}
              studies={studies}
              matchCounts={matchCounts}
              pageSize={MATCH_PAGE_SIZE}
              patientValuesByFieldName={patientValuesByFieldName}
              matchPages={matchPages}
              onChangeMatchPage={changeMatchPage}
              onSetMatchPage={setMatchPage}
            />
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
                  importantQuestionsConfig,
                  locationFilterSection,
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
              <MatchResult
                matchDetails={matchDetails}
                matchGroups={matchGroups}
                allMatchGroups={allMatchGroups}
                studies={studies}
                matchCounts={matchCounts}
                pageSize={MATCH_PAGE_SIZE}
                patientValuesByFieldName={patientValuesByFieldName}
                matchPages={matchPages}
                onChangeMatchPage={changeMatchPage}
                onSetMatchPage={setMatchPage}
              />
            </div>
          </section>
        </div>
      )}
    </>
  )
}

export default MatchingPage
