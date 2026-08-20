import React, { useMemo, useState } from 'react'
import {
  MoreHorizontal,
  RotateCcw,
  ToggleLeft,
  ToggleRight,
} from 'react-feather'
import ReactTooltip from 'react-tooltip'
import { ErrorRetry } from '../components/ErrorRetry'
import { useModal } from '../hooks/useModal'
import { UserInputModal } from '../components/UserInputModal'
import { LocationFilterSection } from '../components/LocationFilterSection'
import type { MatchingPageProps } from './MatchingPage'
import { useMatchingSession } from '../hooks/useMatchingSession'
import { useFieldSearchIndex } from '../components/enhanced/useFieldSearchIndex'
import { useManageItemScrollPosition } from '../hooks/useManageItemScrollPosition'
import ThreePanelLayout from '../components/enhanced/ThreePanelLayout'
import CategorySidebar from '../components/enhanced/CategorySidebar'
import TypeaheadSearch from '../components/enhanced/TypeaheadSearch'
import QuickSelect from '../components/enhanced/QuickSelect'
import EnhancedMatchForm from '../components/enhanced/EnhancedMatchForm'
import SelectedValuesBar from '../components/enhanced/SelectedValuesBar'
import ResultsPanel from '../components/enhanced/ResultsPanel'
import type { CategorySummary } from '../components/enhanced/types'

function EnhancedMatchingPage({
  action,
  state,
  status,
  importantQuestionsConfig,
}: MatchingPageProps) {
  const { fetchAll } = action
  const { config } = state

  const session = useMatchingSession({
    action,
    state,
    status,
    importantQuestionsConfig,
  })

  const [showFormOptions, setShowFormOptions] = useState(false)
  const [showModal, openModal, closeModal] = useModal()
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(
    config.groups.length > 0 ? config.groups[0].id : null
  )
  const [jumpBanner, setJumpBanner] = useState<string | null>(null)
  const [highlightedFieldId, setHighlightedFieldId] = useState<number | null>(
    null
  )

  const centerPanelRef = React.useRef<HTMLDivElement>(null)

  const searchableFields = useFieldSearchIndex(
    { groups: config.groups, fields: session.markedFields },
    session.currentUserInput.values,
    session.isFilterActive
  )

  const { createScrollItemRef } = useManageItemScrollPosition({
    topOffset: 80,
    behavior: 'smooth',
    rootRef: centerPanelRef,
  })

  const categories: CategorySummary[] = useMemo(() => {
    return config.groups.map((group) => {
      const groupFields = session.markedFields.filter(
        (field) => field.groupId === group.id
      )

      const visibleFields = groupFields.filter((field) => {
        const isHidden = session.isFilterActive && !field.relevant
        return !isHidden
      })

      const filledFields = visibleFields.filter(
        (field) =>
          session.currentUserInput.values[field.id] !== undefined &&
          session.currentUserInput.values[field.id] !== ''
      )

      return {
        id: group.id,
        name: group.name,
        visibleCount: visibleFields.length,
        filledCount: filledFields.length,
      }
    })
  }, [
    config.groups,
    session.markedFields,
    session.currentUserInput.values,
    session.isFilterActive,
  ])

  function handleSelectField(id: number) {
    const field = session.markedFields.find((f) => f.id === id)
    if (!field) return

    setActiveCategoryId(field.groupId)

    setTimeout(() => {
      const scrollTarget = centerPanelRef.current?.querySelector(
        `[data-field-id="${id}"]`
      )
      if (scrollTarget instanceof HTMLElement) {
        scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' })
        const firstInput = scrollTarget.querySelector('input, select, textarea')
        if (firstInput instanceof HTMLElement) {
          firstInput.focus()
        }
      }
      setHighlightedFieldId(id)
      setTimeout(() => {
        setHighlightedFieldId(null)
      }, 2500)
    }, 150)

    const fieldLabel = field.label || field.name
    setJumpBanner(`Jumped to: ${fieldLabel}`)
    setTimeout(() => {
      setJumpBanner(null)
    }, 2500)
  }

  function handleClearField(id: number) {
    const newValues = { ...session.currentUserInput.values }
    delete newValues[id]
    session.updateMatchInput(newValues)
  }

  function toggleFormOptions() {
    setShowFormOptions((show) => !show)
  }

  function handleFormOptionsBlur(e: React.FocusEvent) {
    if (showFormOptions && !e.currentTarget.contains(e.relatedTarget))
      setShowFormOptions(false)
  }

  if (status === 'sending') return <div>Loading...</div>
  if (status === 'error') {
    return <ErrorRetry retry={fetchAll} />
  }

  const locationFilterSection = (
    <LocationFilterSection
      filter={session.locationFilter}
      onChange={session.setLocationFilter}
      onApply={session.applyLocationFilter}
      onClear={session.clearLocationFilter}
      isActive={session.isLocationActive}
      error={session.locationError}
      isResolving={session.isLocationResolving}
    />
  )

  function handleSelectCategory(id: number) {
    setActiveCategoryId(id)
    setTimeout(() => {
      const sectionHeader = centerPanelRef.current?.querySelector(
        `[data-group-id="${id}"]`
      )
      if (sectionHeader instanceof HTMLElement) {
        sectionHeader.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 150)
  }

  const sidebar = (
    <div className="p-6">
      <CategorySidebar
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={handleSelectCategory}
      />
    </div>
  )

  const form = (
    <div ref={centerPanelRef} className="h-full overflow-y-auto">
      {session.errorDetail && (
        <div
          role="alert"
          aria-live="polite"
          className="mx-4 my-3 rounded-md border border-red-300 bg-red-50 p-3 text-red-800"
        >
          <p className="text-sm">{session.errorDetail}</p>
          <button
            onClick={session.handleReset}
            className="mt-2 underline decoration-red-400 hover:opacity-80"
          >
            Reset and start over
          </button>
        </div>
      )}

      <div className="sticky top-0 z-20 bg-white border-b border-gray-300">
        <div className="px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-bold">Patient Information</h1>

          <div
            className="relative"
            onBlur={handleFormOptionsBlur}
            tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
          >
            <button
              className={`p-1 ${
                showFormOptions ? 'text-primary' : 'hover:text-primary'
              }`}
              data-for="match-form-menu"
              data-tip
              onClick={toggleFormOptions}
              aria-label="Options menu"
            >
              <MoreHorizontal />
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
              <div className="absolute right-0 origin-top-right w-44 bg-white border border-gray-300 shadow-md mt-2 p-1 z-30">
                <ul className="w-full text-sm text-center text-primary">
                  <li className="hover:bg-red-100">
                    <button
                      className="w-full p-2"
                      data-for="match-form-filter"
                      data-tip
                      onClick={session.toggleFilter}
                    >
                      {session.isFilterActive ? (
                        <ToggleRight className="inline" />
                      ) : (
                        <ToggleLeft className="inline text-gray-500" />
                      )}
                      <span className="mx-2">Filter fields</span>
                    </button>
                    <ReactTooltip
                      border
                      borderColor="black"
                      id="match-form-filter"
                      effect="solid"
                      place="bottom"
                      type="light"
                    >
                      <div style={{ maxWidth: '200px' }}>
                        Filter to display the relevant fields only or see all
                      </div>
                    </ReactTooltip>
                  </li>
                  <li className="hover:bg-red-100">
                    <button
                      className="w-full p-2"
                      data-for="match-form-reset"
                      data-tip
                      onClick={session.handleReset}
                    >
                      <RotateCcw className="inline" size="1rem" />
                      <span className="mx-2">Reset form</span>
                    </button>
                    <ReactTooltip
                      border
                      borderColor="black"
                      id="match-form-reset"
                      effect="solid"
                      place="bottom"
                      type="light"
                    >
                      <span>Clear all fields</span>
                    </ReactTooltip>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {session.showAllUserInput && (
          <div className="px-4 pb-3">
            <label htmlFor="user-input-select" className="block text-sm mb-1">
              Select saved input:
            </label>
            <div className="flex gap-2">
              <select
                id="user-input-select"
                className="flex-1 border border-solid border-black p-1"
                value={session.currentUserInput.id ?? ''}
                onChange={session.loadUserInput}
              >
                {session.allUserInput.map((input) => (
                  <option key={input.id} value={input.id}>
                    {input.name || `Input ${input.id}`}
                  </option>
                ))}
              </select>
              <button
                onClick={openModal}
                className="border border-solid border-black px-3 py-1 hover:bg-gray-100"
              >
                New
              </button>
            </div>
          </div>
        )}
      </div>

      {jumpBanner && (
        <div className="sticky top-16 z-30 mx-4 mt-3">
          <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-2 text-sm">
            {jumpBanner}
          </div>
        </div>
      )}

      <div className="p-6 pb-96 space-y-6">
        <TypeaheadSearch
          fields={searchableFields}
          onSelectField={handleSelectField}
        />

        <QuickSelect
          fields={session.markedFields}
          importantQuestionsConfig={importantQuestionsConfig}
          onSelectField={handleSelectField}
        />

        <SelectedValuesBar
          fields={session.markedFields}
          values={session.currentUserInput.values}
          onClearField={handleClearField}
        />

        <EnhancedMatchForm
          config={{ groups: config.groups, fields: session.markedFields }}
          matchInput={session.currentUserInput.values}
          isFilterActive={session.isFilterActive}
          updateMatchInput={session.updateMatchInput}
          setIsUpdating={session.setIsUpdating}
          importantQuestionsConfig={importantQuestionsConfig}
          locationFilterSection={locationFilterSection}
          activeCategoryId={activeCategoryId}
          onActiveCategoryChange={setActiveCategoryId}
          registerScrollTarget={createScrollItemRef}
          highlightedFieldId={highlightedFieldId}
        />
      </div>

      {showModal && (
        <UserInputModal
          closeModal={closeModal}
          createMatchInput={session.createMatchInput}
        />
      )}
    </div>
  )

  const results = (
    <ResultsPanel
      matchDetails={session.matchDetails}
      matchGroups={session.matchGroups}
      studies={state.studies}
      matchCounts={session.matchCounts}
      pageSize={session.pageSize}
      matchPages={session.matchPages}
      onChangeMatchPage={session.changeMatchPage}
      onSetMatchPage={session.setMatchPage}
      patientValuesByFieldName={session.patientValuesByFieldName}
      isUpdating={session.isUpdating}
    />
  )

  return <ThreePanelLayout sidebar={sidebar} form={form} results={results} />
}

export default EnhancedMatchingPage
