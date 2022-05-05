import React, { useEffect, useState } from 'react'
import LinkExternal from './LinkExternal'
import Button from './Inputs/Button'
import Field from './Inputs/Field'
import type {
  RegisterFormFieldConfig,
  RegisterDocument,
  RegisterInput,
} from '../model'

type DocumentReviewFormProps = {
  docsToBeReviewed: RegisterDocument[]
  onReview: (status: RegisterInput['reviewStatus']) => Promise<void>
}

function DocumentReviewForm({
  docsToBeReviewed,
  onReview,
}: DocumentReviewFormProps) {
  const [error, setError] = useState(null as Error | null)
  if (error) throw error

  const fieldsConfig: RegisterFormFieldConfig[] = []
  const initialValues: RegisterInput['reviewStatus'] = {}
  for (const { id, name, formatted, required, version } of docsToBeReviewed) {
    fieldsConfig.push({
      type: 'checkbox',
      name: String(id),
      label: (
        <>
          I have read and agree to the{' '}
          <LinkExternal className="underline text-primary" to={formatted}>
            {name}
          </LinkExternal>
          {version ? ` (v${version})` : null}
        </>
      ),
      required,
    })
    initialValues[id] = false
  }
  const [isSubmitting, setIsSubmitting] = useState(false)
  useEffect(() => () => setIsSubmitting(false), [])

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()

    const status: RegisterInput['reviewStatus'] = initialValues
    const formData = new FormData(e.target as HTMLFormElement)
    for (const [k, v] of formData.entries()) status[Number(k)] = v === 'on'

    setIsSubmitting(true)
    onReview(status).catch(setError)
  }

  return (
    <form onSubmit={handleSubmit}>
      {fieldsConfig.map((fieldConfig) => (
        <div className="my-4" key={fieldConfig.name}>
          <Field config={fieldConfig} />
        </div>
      ))}
      <div className="flex flex-wrap justify-center mt-8">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Completing...' : 'Complete'}
        </Button>
      </div>
    </form>
  )
}

export default DocumentReviewForm
