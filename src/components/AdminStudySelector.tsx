import React from 'react'
import type { AdminStudyVersionGroups } from '../api/studyAdjudication'

type AdminStudySelectorProps = {
  groups: AdminStudyVersionGroups
  label: string
  name: string
  value: number | ''
  onChange: React.ChangeEventHandler<HTMLSelectElement>
}

function studyLabel(code: string, name: string): string {
  return `${code} - ${name}`
}

export function AdminStudySelector({
  groups,
  label,
  name,
  value,
  onChange,
}: AdminStudySelectorProps) {
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
        <select
          className="w-full rounded-none border border-solid border-black p-1"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
        >
          <option value="" hidden>
            Select One
          </option>
          <optgroup label={`Needs input (${groups.needsInput.length})`}>
            {groups.needsInput.map((studyVersion) => (
              <option
                key={studyVersion.id}
                value={studyVersion.eligibility_criteria_id}
              >
                {studyLabel(studyVersion.study.code, studyVersion.study.name)}
              </option>
            ))}
          </optgroup>
          <optgroup label={`Published (${groups.published.length})`}>
            {groups.published.map((studyVersion) => (
              <option
                key={studyVersion.id}
                value={studyVersion.eligibility_criteria_id}
                disabled
              >
                {studyLabel(studyVersion.study.code, studyVersion.study.name)}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      <p className="text-sm text-gray-600">
        Studies needing input are listed first. Published studies are complete
        and read-only.
      </p>
    </section>
  )
}
