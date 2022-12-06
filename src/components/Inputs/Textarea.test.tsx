import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import Textarea from './Textarea'

const NAME = 'textarea'
const SELECTOR = 'textarea'

test('renders', () => {
  const { container } = render(<Textarea name={NAME} />)
  expect(container.querySelector(SELECTOR)).toBeInTheDocument()
})

test('renders with label', () => {
  const label = 'Textarea'
  const { container, getByLabelText } = render(
    <Textarea name={NAME} label={label} />
  )
  expect(container.querySelector(SELECTOR)).toStrictEqual(getByLabelText(label))
})

test('renders with placeholder', () => {
  const placeholder = 'placeholder'
  const { container, getByPlaceholderText } = render(
    <Textarea name={NAME} placeholder={placeholder} />
  )
  expect(container.querySelector(SELECTOR)).toStrictEqual(
    getByPlaceholderText(placeholder)
  )
})

test('updates on input (uncontrolled)', async () => {
  const user = userEvent.setup()
  const { container } = render(<Textarea name={NAME} />)

  const textarea = container.querySelector(SELECTOR) as HTMLTextAreaElement
  await user.click(textarea)

  const userInput = 'foo'
  await user.keyboard(userInput)
  expect(textarea).toHaveValue(userInput)

  await user.clear(textarea)
  expect(textarea).toHaveValue('')
})

function ControlledTextarea() {
  const [value, setValue] = useState('')
  return (
    <Textarea
      name={NAME}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

test('updates on input (controlled)', async () => {
  const user = userEvent.setup()
  const { container } = render(<ControlledTextarea />)

  const textarea = container.querySelector(SELECTOR) as HTMLTextAreaElement
  await user.click(textarea)

  const userInput = 'foo'
  await user.keyboard(userInput)
  expect(textarea).toHaveValue(userInput)

  await user.clear(textarea)
  expect(textarea).toHaveValue('')
})
