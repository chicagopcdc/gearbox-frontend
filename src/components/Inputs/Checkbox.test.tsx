import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import Checkbox from './Checkbox'

const NAME = 'checkbox'
const SELECTOR = `input[type="checkbox"][name="${NAME}"]`

test('renders', () => {
  const { container } = render(<Checkbox name={NAME} />)
  expect(container.querySelector(SELECTOR)).toBeInTheDocument()
})

test('renders with label', () => {
  const label = 'Checkbox'
  const { container, getByLabelText } = render(
    <Checkbox name={NAME} label={label} />
  )
  expect(container.querySelector(SELECTOR)).toStrictEqual(getByLabelText(label))
})

test('updates on click (uncontrolled)', async () => {
  const user = userEvent.setup()
  const { container } = render(<Checkbox name={NAME} />)

  const checkbox = container.querySelector(SELECTOR) as HTMLInputElement
  expect(checkbox).not.toBeChecked()

  // toggle checkbox
  await user.click(checkbox)
  expect(checkbox).toBeChecked()

  await user.click(checkbox)
  expect(checkbox).not.toBeChecked()
})

function ControlledCheckbox() {
  const [checked, setChecked] = useState(true)
  function toggle() {
    setChecked((c) => !c)
  }
  return (
    <Checkbox
      name={NAME}
      label="Checkbox"
      checked={checked}
      onChange={toggle}
    />
  )
}

test('updates on click (controlled)', async () => {
  const user = userEvent.setup()
  const { container } = render(<ControlledCheckbox />)

  const checkbox = container.querySelector(SELECTOR) as HTMLInputElement
  expect(checkbox).toBeChecked()

  // toggle checkbox
  await user.click(checkbox)
  expect(checkbox).not.toBeChecked()

  await user.click(checkbox)
  expect(checkbox).toBeChecked()
})
