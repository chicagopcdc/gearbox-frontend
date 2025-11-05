import React, { useEffect, useMemo, useState } from 'react'
import { getStudyVersionsAdjudication } from '../api/studyAdjudication'
import {
  ApiStatus,
  CriteriaValue,
  Criterion,
  CriterionStaging,
  CriterionStagingWithValueList,
  InputType,
  RawCriterion,
  StudyVersionAdjudication,
} from '../model'
import Field from '../components/Inputs/Field'
import { CriteriaAnnotationVerification } from '../components/CriteriaAnnotationVerification'
import { getInputTypes } from '../api/inputTypes'
import { ErrorRetry } from '../components/ErrorRetry'
import { getValues } from '../api/value'
import { getCriterionStaging } from '../api/criterionStaging'
import { getCriteria } from '../api/criterion'
import Button from '../components/Inputs/Button'
import { useManageItemScrollPosition } from '../hooks/useManageItemScrollPosition'
import DropdownSection from '../components/DropdownSection'
import { useModal } from '../hooks/useModal'
import { Eye, XCircle } from 'react-feather'
import { RawCriterionHighlighter } from '../components/RawCriterionHighlighter'
import { getRawCriterion } from '../api/rawCriteria'

type Status = CriterionStaging['criterion_adjudication_status']
const statusOrder: Status[] = ['NEW', 'IN_PROCESS', 'EXISTING', 'ACTIVE']

export function CriteriaAnnotationVerificationPage() {
  const [studyVersionsAdjudication, setStudyVersionsAdjudication] = useState<
    StudyVersionAdjudication[]
  >([])
  const [eligibilityCriteriaId, setEligibilityCriteriaId] = useState<
    number | ''
  >('')
  const [stagingCriteria, setStagingCriteria] = useState<
    CriterionStagingWithValueList[]
  >([])
  const [criteria, setCriteria] = useState<Criterion[]>([])
  const [values, setValues] = useState<CriteriaValue[]>([])
  const [inputTypes, setInputTypes] = useState<InputType[]>([])
  const [loadingStatus, setLoadingStatus] = useState<ApiStatus>('not started')
  const [showModal, openModal, closeModal] = useModal()
  const [rawCriterion, setRawCriterion] = useState<RawCriterion | null>(null)

  const { topRef, createScrollItemRef, scrollToTop, showBackToTop } =
    useManageItemScrollPosition<number>({
      topOffset: 96, // set to sticky header height; use 0 if relying on CSS scroll-mt
      behavior: 'smooth',
      trackBackToTop: true,
      onAfterScrollToItem: (el) => {
        // optional flash highlight, replaces old class toggling
        el.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2', 'rounded')
        setTimeout(() => {
          el.classList.remove(
            'ring-2',
            'ring-blue-500',
            'ring-offset-2',
            'rounded'
          )
        }, 1200)
      },
    })
  // Collapsible groups
  const [open, setOpen] = useState<Record<Status, boolean>>({
    NEW: true,
    IN_PROCESS: true,
    EXISTING: true,
    ACTIVE: true,
  })

  const loadPage = () => {
    Promise.all([
      getStudyVersionsAdjudication(),
      getValues(),
      getInputTypes(),
      getCriteria(),
    ])
      .then(([studyVersions, values, inputTypes, criteria]) => {
        setStudyVersionsAdjudication(studyVersions)
        setValues(values.filter((v) => !v.is_numeric && v.unit_id === 1))
        setInputTypes(inputTypes)
        setCriteria(criteria)
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

  const onStudyChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const ebcId = +event.target.value
    Promise.all([getCriterionStaging(ebcId), getRawCriterion(ebcId)])
      .then(([sc, rc]) => {
        setStagingCriteria(sc)
        setRawCriterion(rc)
        setEligibilityCriteriaId(ebcId)
      })
      .catch(() => {
        setStagingCriteria([])
        setRawCriterion(null)
      })
  }

  // Group once, render many
  const grouped = useMemo(() => {
    return stagingCriteria.reduce((acc, sc) => {
      const st = sc.criterion_adjudication_status
      ;(acc[st] ??= []).push(sc)
      return acc
    }, {} as Record<Status, CriterionStagingWithValueList[]>)
  }, [stagingCriteria])

  const counts = {
    NEW: grouped.NEW?.length ?? 0,
    IN_PROCESS: grouped.IN_PROCESS?.length ?? 0,
    EXISTING: grouped.EXISTING?.length ?? 0,
    ACTIVE: grouped.ACTIVE?.length ?? 0,
  }

  // When a child updates, regroup and plan a scroll-to-row
  const handleStagingUpdated = (updated: CriterionStagingWithValueList) => {
    setStagingCriteria((prev) =>
      prev.map((x) => (x.id === updated.id ? updated : x))
    )
  }

  if (loadingStatus === 'not started' || loadingStatus === 'sending') {
    return <div>Loading...</div>
  }
  if (loadingStatus === 'error') {
    return <ErrorRetry retry={loadPage} />
  }

  return (
    <div>
      {/* top sentinel: NOT sticky; first child in the scroll area */}
      <div ref={topRef} className="h-px w-px" aria-hidden />
      {showBackToTop && (
        <Button
          size="small"
          onClick={() => scrollToTop()}
          otherClassName="fixed bottom-6 right-6 rounded-full shadow-lg z-50"
          aria-label="Back to top"
        >
          Back to Top
        </Button>
      )}

      {/* Study selector */}
      <Field
        config={{
          type: 'select',
          label: 'Select a Study to Adjudicate',
          placeholder: 'Select One',
          name: 'studyVersion',
          options: studyVersionsAdjudication.map((sva) => ({
            value: sva.eligibility_criteria_id,
            label: `${sva.study.code} - ${sva.study.name}`,
          })),
        }}
        value={eligibilityCriteriaId}
        onChange={onStudyChanged}
      />

      {/* Jump Bar (uses section ids instead of refs) */}
      <div className="mt-3 top-24 z-40 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm rounded-md">
        <div className="p-2 flex flex-wrap items-center gap-2">
          {/* left: status chips */}
          <div className="flex flex-wrap gap-2">
            {statusOrder.map((st) => (
              <button
                key={st}
                className="px-3 py-1 rounded-full border hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                onClick={() =>
                  document
                    .getElementById(`section-${st}`)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              >
                {st.replace('_', ' ')} ({counts[st]})
              </button>
            ))}
          </div>

          {/* right: view raw highlighter trigger */}
          <button
            type="button"
            onClick={openModal}
            disabled={!rawCriterion}
            aria-controls="match-info-modal"
            className={[
              'ml-auto inline-flex items-center gap-1 px-3 py-1 rounded-full',
              'text-blue-600 hover:underline hover:bg-blue-50',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              !rawCriterion
                ? 'opacity-50 cursor-not-allowed pointer-events-none'
                : 'cursor-pointer',
            ].join(' ')}
            title={
              rawCriterion
                ? 'Open highlighted raw criterion'
                : 'Select a study first'
            }
          >
            <Eye size={16} aria-hidden="true" />
            View Highlighted Raw Eligibility Criteria
          </button>
        </div>
      </div>
      {showModal && (
        <div
          id="match-info-modal"
          className="fixed w-screen h-screen left-0 top-0 flex items-center justify-center z-50"
          style={{ background: '#cccc' }}
          role="dialog"
          aria-labelledby="eligibility-criteria-dialog-title"
          aria-modal="true"
        >
          <div
            className="bg-white overflow-scroll w-full lg:w-3/4 xl:w-2/3 h-full"
            style={{ maxHeight: '95%', maxWidth: '95%' }}
          >
            <div className="text-sm sm:text-base px-4 pb-4 pt-2 sm:px-8 sm:pb-8">
              <div className="flex items-baseline justify-between border-b py-2 sm:py-4 mb-4 sticky top-0 bg-white">
                <h3
                  id="eligibility-criteria-dialog-title"
                  className="font-bold mr-4"
                >
                  <span className="text-gray-500 text-sm">
                    Highlighted Annotation for Raw Eligibility Criteria
                  </span>
                  <span className="italic block">
                    {rawCriterion?.nct || ''}
                  </span>
                </h3>
                <button
                  className="ml-2 hover:text-red-700"
                  onClick={closeModal}
                  aria-label="Close Trial Match Info dialog"
                >
                  <XCircle className="inline" />
                </button>
              </div>
              <RawCriterionHighlighter rawCriterion={rawCriterion} />
            </div>
          </div>
        </div>
      )}
      {/* Grouped sections */}
      {statusOrder.map((st) => {
        const list = (grouped[st] ?? []).slice().sort((a, b) => a.id - b.id)
        if (!list.length) return null

        return (
          <DropdownSection
            key={st}
            id={`section-${st}`} // keeps jump bar working
            name={`${st.replace('_', ' ')} (${list.length})`}
            isOpen={open[st]} // controlled by state
            onToggle={(next) => setOpen((o) => ({ ...o, [st]: next }))}
            backgroundColor="bg-white"
            headerClassName="top-0" // matches previous sticky top-0
          >
            {list.map((sc) => (
              <div
                key={sc.id}
                ref={createScrollItemRef(sc.id)}
                id={`crit-${sc.id}`}
                className="scroll-mt-24"
              >
                <CriteriaAnnotationVerification
                  stagingCriterion={sc}
                  criteria={criteria}
                  lookupValues={values}
                  inputTypes={inputTypes}
                  setLookupValues={setValues}
                  onStagingUpdated={handleStagingUpdated}
                />
              </div>
            ))}
          </DropdownSection>
        )
      })}
    </div>
  )
}
