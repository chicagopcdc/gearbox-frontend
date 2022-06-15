import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import TextField from './TextField'

const NAME = 'text'
const SELECTOR = `input[type="text"][name="${NAME}"]`

test('renders', () => {
  const { container } = render(<TextField name={NAME} />)
  expect(container.querySelector(SELECTOR)).toBeInTheDocument()
})

test('renders with label', () => {
  const { container, getByLabelText } = render(
    <TextField name={NAME} label="Text field" />
  )
  expect(container.querySelector(SELECTOR)).toStrictEqual(
    getByLabelText('Text field')
  )
})

test('renders with placeholder', () => {
  const { container, getByPlaceholderText } = render(
    <TextField name={NAME} placeholder="placeholder" />
  )
  expect(container.querySelector(SELECTOR)).toStrictEqual(
    getByPlaceholderText('placeholder')
  )
})

test('updates on input (uncontrolled)', async () => {
  const user = userEvent.setup()
  const { container } = render(<TextField name={NAME} />)

  const textField = container.querySelector(SELECTOR) as HTMLInputElement
  await user.click(textField)

  const userInput = 'foo'
  await user.keyboard(userInput)
  expect(textField).toHaveValue(userInput)

  await user.clear(textField)
  expect(textField).toHaveValue('')
})

function ControlledTextField() {
  const [value, setValue] = useState('')
  return (
    <TextField
      name={NAME}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

test('updates on input (controlled)', async () => {
  const user = userEvent.setup()
  const { container } = render(<ControlledTextField />)

  const textField = container.querySelector(SELECTOR) as HTMLInputElement
  await user.click(textField)

  const userInput = 'foo'
  await user.keyboard(userInput)
  expect(textField).toHaveValue(userInput)

  await user.clear(textField)
  expect(textField).toHaveValue('')
})
