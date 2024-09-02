import React, { useEffect, useState } from 'react'
import {
  getCriterionStaging,
  getStudyVersionsAdjudication,
  getValues,
} from '../api/studyAdjudication'
import {
  ApiStatus,
  CriteriaValue,
  InputType,
  StagingCriterionWithValueList,
  StudyVersionAdjudication,
} from '../model'
import Field from '../components/Inputs/Field'
import { QuestionAdjudication } from '../components/QuestionAdjudication'
import { getInputTypes } from '../api/inputTypes'
import { ErrorRetry } from '../components/ErrorRetry'

export function QuestionAdjudicationPage() {
  const [studyVersionsAdjudication, setStudyVersionsAdjudication] = useState<
    StudyVersionAdjudication[]
  >([])
  const [svaIndex, setSvaIndex] = useState<number>(-1)
  const [stagingCriteria, setStagingCriteria] = useState<
    StagingCriterionWithValueList[]
  >([])
  const [values, setValues] = useState<CriteriaValue[]>([])
  const [inputTypes, setInputTypes] = useState<InputType[]>([])
  const [loadingStatus, setLoadingStatus] = useState<ApiStatus>('not started')

  const loadPage = () => {
    Promise.all([getStudyVersionsAdjudication(), getValues(), getInputTypes()])
      .then(([studyVersions, values, inputTypes]) => {
        setStudyVersionsAdjudication(studyVersions)
        setValues(values)
        setInputTypes(inputTypes)
        setLoadingStatus('success')
      })
      .catch((err) => {
        console.error(err)
        setLoadingStatus('error')
      })
  }
  useEffect(() => {
    setLoadingStatus('sending')
    loadPage()
  }, [])

  const studyAdjudicationChanged = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const index = +event.target.value
    setSvaIndex(index)
    getCriterionStaging(
      studyVersionsAdjudication[index].eligibility_criteria_id
    )
      .then(setStagingCriteria)
      .catch(() => setStagingCriteria([]))
  }

  if (loadingStatus === 'not started' || loadingStatus === 'sending') {
    return <div>Loading...</div>
  } else if (loadingStatus === 'error') {
    return <ErrorRetry retry={loadPage} />
  }

  return (
    <div>
      <Field
        config={{
          type: 'select',
          label: 'Select a Study to Adjudicate',
          placeholder: 'Select One',
          name: 'studyVersion',
          options: studyVersionsAdjudication.map((sva, index) => ({
            value: index,
            label: `${sva.study.code} - ${sva.study.name}`,
          })),
        }}
        value={svaIndex}
        onChange={studyAdjudicationChanged}
      />
      {stagingCriteria.length ? (
        stagingCriteria
          .sort((a, b) => a.id - b.id)
          .map((sc) => (
            <QuestionAdjudication
              key={sc.id}
              stagingCriterion={sc}
              lookupValues={values}
              inputTypes={inputTypes}
              setLookupValues={setValues}
            />
          ))
      ) : (
        <div className="mt-4">No Staging Criteria Found</div>
      )}
    </div>
  )
}
