import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { RegisterDocument } from '../model'
import RegisterForm from './RegisterForm'

const DOCS_TO_BE_REVIEWED: RegisterDocument[] = [
  { formatted: '', id: 0, name: 'Foo', required: true },
  { formatted: '', id: 1, name: 'Bar', required: true },
  { formatted: '', id: 2, name: 'Baz', required: false },
]

test('renders with all input elements', () => {
  const { container, getAllByRole, getByLabelText } = render(
    <RegisterForm
      docsToBeReviewed={DOCS_TO_BE_REVIEWED}
      onRegister={() => /* noop */ Promise.resolve()}
    />
  )
  const form = container.querySelector('form')
  expect(form).toBeInTheDocument()

  const initialValues = {
    firstName: '',
    lastName: '',
    institution: '',
    role: '',
    'reviewStatus.0': false,
    'reviewStatus.1': false,
    'reviewStatus.2': false,
  }
  expect(form).toHaveFormValues(initialValues)

  // user info text fields
  for (const labelText of ['First name', 'Last name', 'Institution', 'Role'])
    expect(getByLabelText(labelText)).toBeRequired()

  // docs to review checkboxes
  const allDocsCheckboxes = getAllByRole('checkbox')
  expect(allDocsCheckboxes).toHaveLength(DOCS_TO_BE_REVIEWED.length)

  for (const document of DOCS_TO_BE_REVIEWED) {
    const labelText = `I have read and agree to the ${document.name}`
    const checkbox = getByLabelText(labelText)

    if (document.required) expect(checkbox).toBeRequired()
    else expect(checkbox).not.toBeRequired()
  }
})

test('can submit if all required inputs filled', async () => {
  const user = userEvent.setup()
  const { container, getAllByRole, getByLabelText, getByRole } = render(
    <RegisterForm
      docsToBeReviewed={DOCS_TO_BE_REVIEWED}
      onRegister={() => /* noop */ Promise.resolve()}
    />
  )

  const form = container.querySelector('form')
  const initialValues = {
    firstName: '',
    lastName: '',
    institution: '',
    role: '',
    'reviewStatus.0': false,
    'reviewStatus.1': false,
    'reviewStatus.2': false,
  }
  expect(form).toHaveFormValues(initialValues)

  const submitButton = getByRole('button')
  expect(submitButton).toHaveTextContent('Register')

  // fill out: first name, last name, institution
  for (const labelText of ['First name', 'Last name', 'Institution']) {
    await user.click(getByLabelText(labelText))
    await user.keyboard('Foo')
  }
  expect(form).toHaveFormValues({
    firstName: 'Foo',
    lastName: 'Foo',
    institution: 'Foo',
  })

  // cannot submit; missing role
  /**
   * SKIP: RTL cannot test native form validation for missing required inputs
   * See https://github.com/testing-library/react-testing-library/issues/1013
   */
  // await user.click(submitButton)
  // expect(submitButton).toHaveTextContent('Register')

  // fill out: role (other)
  await user.selectOptions(getByLabelText('Role'), [
    getByRole('option', { name: 'Other' }),
  ])
  await user.click(getByLabelText('Type in your role'))
  await user.keyboard('Bar')
  expect(form).toHaveFormValues({
    role: 'other',
    roleOther: 'Bar',
  })

  // cannot submit; missing required document reivews
  /**
   * SKIP: RTL cannot test native form validation for missing required inputs
   * See https://github.com/testing-library/react-testing-library/issues/1013
   */
  // await user.click(submitButton)
  // expect(submitButton).toHaveTextContent('Register')

  // check all required checkboxes
  const allCheckboxes = getAllByRole('checkbox')
  for (const [i, document] of DOCS_TO_BE_REVIEWED.entries())
    if (document.required) await user.click(allCheckboxes[i])
  expect(form).toHaveFormValues({
    'reviewStatus.0': true,
    'reviewStatus.1': true,
  })

  // can submit
  await user.click(submitButton)
  expect(submitButton).toHaveTextContent('Registering...')
})
