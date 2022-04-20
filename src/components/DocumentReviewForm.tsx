import React, { useEffect, useState } from 'react'
import { getIn, useFormik } from 'formik'
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
  const initialValues: { status: RegisterInput['reviewStatus'] } = {
    status: {},
  }
  for (const { id, name, formatted, required, version } of docsToBeReviewed) {
    fieldsConfig.push({
      type: 'checkbox',
      name: `status.${id}`,
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

    initialValues.status[id] = false
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  useEffect(() => () => setIsSubmitting(false), [])

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: ({ status }) => {
      setIsSubmitting(true)
      onReview(status).catch(setError)
    },
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    formik.setFieldValue(e.target.name, e.target.checked)
  }

  const hasUnreviewedDoc = !Object.values(formik.values.status).every(Boolean)

  return (
    <form onSubmit={formik.handleSubmit}>
      {fieldsConfig.map((fieldConfig) => (
        <div className="my-4" key={fieldConfig.name}>
          <Field
            config={fieldConfig}
            value={getIn(formik.values, fieldConfig.name)}
            onChange={handleChange}
          />
        </div>
      ))}
      <div className="flex flex-wrap justify-center mt-8">
        <Button type="submit" disabled={hasUnreviewedDoc || isSubmitting}>
          {isSubmitting ? 'Completing...' : 'Complete'}
        </Button>
      </div>
    </form>
  )
}

export default DocumentReviewForm
