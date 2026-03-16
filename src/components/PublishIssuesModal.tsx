import React from 'react'
import { XCircle } from 'react-feather'
import { PublishIssue } from '../model'
import Button from './Inputs/Button'

function IssueBlock({
  title,
  issues,
  variant,
}: {
  title: string
  issues: PublishIssue[]
  variant: 'error' | 'warning'
}) {
  if (!issues.length) return null

  const heading = variant === 'error' ? 'text-red-700' : 'text-amber-700'
  const box =
    variant === 'error'
      ? 'border-red-200 bg-red-50'
      : 'border-amber-200 bg-amber-50'

  return (
    <div className="mt-6">
      <h4 className={`font-bold mb-2 ${heading}`}>{title}</h4>

      <div className="space-y-3">
        {issues.map((issue, idx) => (
          <div key={`${title}-${idx}`} className={`rounded border p-3 ${box}`}>
            <div className="text-sm font-medium">{issue.message}</div>

            {issue.details && issue.details.length > 0 && (
              <ul className="mt-2 list-disc pl-6 text-sm text-gray-700">
                {issue.details.map((d, j) => (
                  <li key={`${d.code}-${j}`}>
                    <span className="font-mono">{d.code}</span>
                    {d.value !== undefined && (
                      <>
                        {': '}
                        <span className="font-mono">{d.value ?? '—'}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function PublishIssuesModal({
  onClose,
  onIgnoreWarnings,
  errors,
  warnings,
  loading,
  studyCode,
  studyName,
}: {
  onClose: () => void
  onIgnoreWarnings: () => void
  errors: PublishIssue[]
  warnings: PublishIssue[]
  loading: boolean
  studyCode?: string
  studyName?: string
}) {
  const hasErrors = errors.length > 0
  const hasWarnings = warnings.length > 0
  const canIgnoreWarnings = hasWarnings && !hasErrors

  return (
    <div
      id="publish-issues-modal"
      className="fixed w-screen h-screen left-0 top-0 flex items-center justify-center z-50"
      style={{ background: '#cccc' }}
      role="dialog"
      aria-labelledby="publish-issues-dialog-title"
      aria-modal="true"
    >
      <div
        className="bg-white w-full lg:w-3/4 xl:w-2/3 flex flex-col"
        style={{ maxHeight: '95%', maxWidth: '95%' }}
      >
        <div className="text-sm sm:text-base px-4 pb-4 pt-2 sm:px-8 sm:pb-8 relative overflow-y-auto">
          {/* Sticky header (matches CriteriaBuilderModal) */}
          <div
            className="flex items-baseline justify-between border-b py-2 sm:py-4 mb-4 z-10 sticky top-0 bg-white"
            style={{ maxHeight: 'calc(95vh - 2rem)' }}
          >
            <h3 id="publish-issues-dialog-title" className="font-bold mr-4">
              <span className="text-gray-500 text-sm block">
                Publish failed
              </span>

              {(studyCode || studyName) && (
                <span className="italic block">
                  {studyCode ? `${studyCode}: ` : ''}
                  {studyName ?? ''}
                </span>
              )}
            </h3>

            <div className="min-w-max flex items-center">
              <button
                className="ml-4 hover:text-red-700 disabled:opacity-60"
                onClick={onClose}
                aria-label="Close Publish Issues dialog"
                disabled={loading}
              >
                <XCircle className="inline" />
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-4">
            Review the issues below. Fix errors and retry. If there are only
            warnings, you can publish while ignoring warnings.
          </p>

          <IssueBlock title="Errors" issues={errors} variant="error" />
          <IssueBlock title="Warnings" issues={warnings} variant="warning" />

          <div className="mt-6 pt-4 border-t flex justify-end items-center">
            {canIgnoreWarnings && (
              <Button onClick={onIgnoreWarnings} disabled={loading}>
                {loading ? 'Publishing…' : 'Publish (ignore warnings)'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
