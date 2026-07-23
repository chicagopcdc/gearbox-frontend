import React, { useMemo, useRef, useState } from 'react'
import { Search, X } from 'react-feather'
import type { AdminStudyVersionGroups } from '../api/studyAdjudication'

type AdminStudySelectorProps = {
  groups: AdminStudyVersionGroups
  label: string
  name: string
  value: number | ''
  onChange: (value: number | '') => void
}

function studyLabel(code: string, name: string): string {
  return `${code} - ${name}`
}

function matchesSearch(code: string, name: string, searchQuery: string) {
  const query = searchQuery.trim().toLocaleLowerCase()
  if (!query) return true
  return studyLabel(code, name).toLocaleLowerCase().includes(query)
}

export function AdminStudySelector({
  groups,
  label,
  name,
  value,
  onChange,
}: AdminStudySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const selectRef = useRef<HTMLSelectElement>(null)
  const filteredGroups = useMemo(
    () => ({
      needsInput: groups.needsInput.filter((studyVersion) =>
        matchesSearch(
          studyVersion.study.code,
          studyVersion.study.name,
          searchQuery
        )
      ),
      published: groups.published.filter((studyVersion) =>
        matchesSearch(
          studyVersion.study.code,
          studyVersion.study.name,
          searchQuery
        )
      ),
    }),
    [groups, searchQuery]
  )
  const resultCount =
    filteredGroups.needsInput.length + filteredGroups.published.length
  const updateSearchQuery = (nextSearchQuery: string) => {
    setSearchQuery(nextSearchQuery)
    if (value === '') return

    const selectedStudy = [...groups.needsInput, ...groups.published].find(
      (studyVersion) => studyVersion.eligibility_criteria_id === value
    )
    if (
      !selectedStudy ||
      !matchesSearch(
        selectedStudy.study.code,
        selectedStudy.study.name,
        nextSearchQuery
      )
    ) {
      onChange('')
    }
  }

  return (
    <section aria-label="Study status" className="space-y-2">
      <div className="flex flex-wrap gap-2 text-sm" aria-label="Study counts">
        <span className="inline-flex items-center rounded border border-yellow-500 bg-yellow-50 px-2 py-1 text-yellow-900">
          Needs input ({groups.needsInput.length})
        </span>
        <span className="inline-flex items-center rounded border border-green-600 bg-green-50 px-2 py-1 text-green-900">
          Published ({groups.published.length})
        </span>
      </div>

      <div className="flex flex-col">
        <label className="mb-1" htmlFor={name}>
          {label}
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            aria-label="Search trials"
            className="w-full rounded-none border border-b-0 border-solid border-black py-2 pl-9 pr-9"
            onChange={(event) => updateSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                selectRef.current?.focus()
              }
            }}
            placeholder="Search by trial code or title"
            type="search"
            value={searchQuery}
          />
          {searchQuery && (
            <button
              aria-label="Clear trial search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
              onClick={() => updateSearchQuery('')}
              title="Clear trial search"
              type="button"
            >
              <X aria-hidden="true" size={18} />
            </button>
          )}
        </div>
        <select
          className="w-full rounded-none border border-solid border-black p-1"
          id={name}
          name={name}
          ref={selectRef}
          value={value}
          onChange={(event) => {
            onChange(event.target.value ? +event.target.value : '')
            setSearchQuery('')
          }}
        >
          <option value="" hidden>
            Select One
          </option>
          {filteredGroups.needsInput.length > 0 && (
            <optgroup
              label={`Needs input (${filteredGroups.needsInput.length})`}
            >
              {filteredGroups.needsInput.map((studyVersion) => (
                <option
                  key={studyVersion.id}
                  value={studyVersion.eligibility_criteria_id}
                >
                  {studyLabel(studyVersion.study.code, studyVersion.study.name)}
                </option>
              ))}
            </optgroup>
          )}
          {filteredGroups.published.length > 0 && (
            <optgroup label={`Published (${filteredGroups.published.length})`}>
              {filteredGroups.published.map((studyVersion) => (
                <option
                  key={studyVersion.id}
                  value={studyVersion.eligibility_criteria_id}
                  disabled
                >
                  {studyLabel(studyVersion.study.code, studyVersion.study.name)}
                </option>
              ))}
            </optgroup>
          )}
          {resultCount === 0 && (
            <option value="" disabled>
              No matching trials
            </option>
          )}
        </select>
        <span
          aria-live="polite"
          className="mt-1 text-sm text-gray-600"
          role="status"
        >
          {searchQuery
            ? `${resultCount} ${resultCount === 1 ? 'trial' : 'trials'} found`
            : ''}
        </span>
      </div>

      <p className="text-sm text-gray-600">
        Studies needing input are listed first. Published studies are complete
        and read-only.
      </p>
    </section>
  )
}
