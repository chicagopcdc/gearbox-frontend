import { useEffect, useState } from 'react'
import type { MatchingPageProps } from '../pages/MatchingPage'
import {
  MatchDetails,
  MatchFormFieldConfig,
  MatchFormValues,
  MatchGroupCounts,
  MatchGroups,
  UserInputUi,
} from '../model'
import { getDefaultValues, markRelevantMatchFields } from '../utils'
import { getMatchInfo } from '../api/middleware'
import {
  getAllUserInput,
  getLatestUserInput,
  postUserInput,
} from '../api/userInput'
import { useLocationFilter } from './useLocationFilter'

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

export function useMatchingSession({ action, state }: MatchingPageProps) {
  const { fetchAll } = action
  const { conditions, config, criteria, studies } = state

  const [isUpdating, setIsUpdating] = useState(false)
  const [isFilterActive, setIsFilterActive] = useState(true)
  const [matchDetails, setMatchDetails] = useState<MatchDetails>(
    {} as MatchDetails
  )
  const [matchGroups, setMatchGroups] = useState<MatchGroups>({
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

  return {
    isUpdating,
    setIsUpdating,
    isFilterActive,
    matchDetails,
    matchGroups,
    matchCounts,
    matchPages,
    pageSize: MATCH_PAGE_SIZE,
    allUnmatchedStudyIds,
    allUserInput,
    currentUserInput,
    markedFields,
    showAllUserInput,
    errorDetail,
    locationFilter,
    setLocationFilter,
    locationParams,
    locationError,
    applyLocationFilter,
    clearLocationFilter,
    isLocationActive,
    isLocationResolving,
    updateMatchInput,
    patientValuesByFieldName,
    createMatchInput,
    handleReset,
    toggleFilter,
    loadUserInput,
    changeMatchPage,
    setMatchPage,
    config,
    studies,
    fetchAll,
  }
}
