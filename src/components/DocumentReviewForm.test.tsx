import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { RegisterDocument } from '../model'
import DocumentReviewForm from './DocumentReviewForm'

const DOCS_TO_BE_REVIEWED: RegisterDocument[] = [
  { formatted: '', id: 0, name: 'Foo', required: true },
  { formatted: '', id: 1, name: 'Bar', required: true },
  { formatted: '', id: 2, name: 'Baz', required: false },
]

test('renders with all input elements', () => {
  const { container, getAllByRole, getByLabelText } = render(
    <DocumentReviewForm
      docsToBeReviewed={DOCS_TO_BE_REVIEWED}
      onReview={() => /* noop */ Promise.resolve()}
    />
  )
  const form = container.querySelector('form')
  expect(form).toBeInTheDocument()

  const initialValues = {
    '0': false,
    '1': false,
    '2': false,
  }
  expect(form).toHaveFormValues(initialValues)

  const allCheckboxes = getAllByRole('checkbox')
  expect(allCheckboxes).toHaveLength(DOCS_TO_BE_REVIEWED.length)

  for (const document of DOCS_TO_BE_REVIEWED) {
    const labelText = `I have read and agree to the ${document.name}`
    const checkbox = getByLabelText(labelText)

    if (document.required) expect(checkbox).toBeRequired()
    else expect(checkbox).not.toBeRequired()
  }
})

test('can submit if all required docs reviewed', async () => {
  const user = userEvent.setup()
  const { getByLabelText, getByRole } = render(
    <DocumentReviewForm
      docsToBeReviewed={DOCS_TO_BE_REVIEWED}
      onReview={() => Promise.resolve()}
    />
  )

  const submitButton = getByRole('button')
  expect(submitButton).toHaveTextContent('Complete')

  // cannot submit; missing required checkboxes
  /**
   * SKIPPED: RTL cannot test native form validation for missing required inputs
   * See https://github.com/testing-library/react-testing-library/issues/1013
   */
  // await user.click(submitButton)
  // expect(submitButton).toHaveTextContent('Complete')

  // check all required checkboxes
  for (const document of DOCS_TO_BE_REVIEWED) {
    const labelText = `I have read and agree to the ${document.name}`
    if (document.required) await user.click(getByLabelText(labelText))
  }

  // can submit
  await user.click(submitButton)
  expect(submitButton).toHaveTextContent('Completing...')
})
