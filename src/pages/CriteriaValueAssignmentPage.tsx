import React, { useEffect, useRef, useState } from 'react'
import {
  ApiStatus,
  CriteriaValue,
  CriterionStagingWithValueList,
  InputType,
  Unit,
} from '../model'
import {
  AdminStudyVersionGroups,
  getAdminStudyVersionGroups,
} from '../api/studyAdjudication'
import { ErrorRetry } from '../components/ErrorRetry'
import { CriteriaValueAssignment } from '../components/CriteriaValueAssignment'
import { getInputTypes } from '../api/inputTypes'
import { getUnits } from '../api/units'
import { getElCriteriaHasCriterionsByElId } from '../api/elCriteriaHasCriterion'
import { getValues } from '../api/value'
import { getCriterionStaging } from '../api/criterionStaging'
import { AdminStudySelector } from '../components/AdminStudySelector'

export function CriteriaValueAssignmentPage() {
  const [studyVersionGroups, setStudyVersionGroups] =
    useState<AdminStudyVersionGroups>({ needsInput: [], published: [] })
  const [eligibilityCriteriaId, setEligibilityCriteriaId] = useState<
    number | ''
  >('')
  const [activeStagingCriteria, setActiveStagingCriteria] = useState<
    CriterionStagingWithValueList[]
  >([])
  const [inputTypes, setInputTypes] = useState<InputType[]>([])
  const [numericValues, setNumericValues] = useState<CriteriaValue[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [loadingStatus, setLoadingStatus] = useState<ApiStatus>('not started')
  const requestedEligibilityCriteriaId = useRef<number | ''>('')

  const loadPage = () => {
    Promise.all([
      getAdminStudyVersionGroups(),
      getValues(),
      getInputTypes(),
      getUnits(),
    ])
      .then(([studyVersions, values, inputTypes, units]) => {
        setStudyVersionGroups(studyVersions)
        setNumericValues(values.filter((v) => v.is_numeric))
        setInputTypes(inputTypes)
        setUnits(units)
        setLoadingStatus('success')
      })
      .catch((err) => {
        setLoadingStatus('error')
        console.error(err)
      })
  }

  const onStudyChanged = (eligibilityCriteriaId: number | '') => {
    requestedEligibilityCriteriaId.current = eligibilityCriteriaId
    setEligibilityCriteriaId(eligibilityCriteriaId)
    if (eligibilityCriteriaId === '') {
      setActiveStagingCriteria([])
      return
    }

    Promise.all([
      getCriterionStaging(eligibilityCriteriaId),
      getElCriteriaHasCriterionsByElId(eligibilityCriteriaId),
    ])
      .then(([stagingCriteria]) => {
        if (requestedEligibilityCriteriaId.current !== eligibilityCriteriaId)
          return
        const activeStagingCriteria = stagingCriteria.filter(
          (sc) => sc.criterion_adjudication_status === 'ACTIVE'
        )
        setActiveStagingCriteria(activeStagingCriteria)
      })
      .catch(() => {
        if (requestedEligibilityCriteriaId.current !== eligibilityCriteriaId)
          return
        setActiveStagingCriteria([])
      })
  }

  useEffect(() => {
    setLoadingStatus('sending')
    loadPage()
  }, [])

  if (loadingStatus === 'not started' || loadingStatus === 'sending') {
    return <div>Loading...</div>
  } else if (loadingStatus === 'error') {
    return <ErrorRetry retry={loadPage} />
  }

  return (
    <div>
      <AdminStudySelector
        groups={studyVersionGroups}
        label="Select a Study"
        name="studyVersion"
        value={eligibilityCriteriaId}
        onChange={onStudyChanged}
      />
      {activeStagingCriteria.length ? (
        activeStagingCriteria
          .sort((a, b) => a.id - b.id)
          .map((sc) => (
            <CriteriaValueAssignment
              key={sc.id}
              stagingCriterion={sc}
              inputTypes={inputTypes}
              numericValues={numericValues}
              setNumericValues={setNumericValues}
              units={units}
              setUnits={setUnits}
            />
          ))
      ) : (
        <div className="mt-4">No Active Staging Criteria Found</div>
      )}
    </div>
  )
}
