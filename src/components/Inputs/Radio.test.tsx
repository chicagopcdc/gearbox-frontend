import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import Radio from './Radio'

const NAME = 'radio'
const SELECTOR = `input[type="radio"][name="${NAME}"]`
const OPTIONS = [
  { value: 0, label: 'foo' },
  { value: 1, label: 'bar' },
  { value: 2, label: 'baz' },
]

test('renders', () => {
  const { container, getByLabelText } = render(
    <Radio name={NAME} options={OPTIONS} />
  )

  const allRadioButtons = container.querySelectorAll(SELECTOR)
  expect(allRadioButtons).toHaveLength(OPTIONS.length)

  for (const [i, radioButton] of allRadioButtons.entries())
    expect(radioButton).toStrictEqual(getByLabelText(OPTIONS[i].label))
})

test('renders with group label', () => {
  const label = 'Radio'
  const { container, getByLabelText } = render(
    <Radio name={NAME} label={label} options={OPTIONS} />
  )

  // this label is applied to the radio button group <div>
  expect(getByLabelText(label)).toBeInTheDocument()

  const allRadioButtons = container.querySelectorAll(SELECTOR)
  expect(allRadioButtons).toHaveLength(OPTIONS.length)

  for (const [i, radioButton] of allRadioButtons.entries())
    expect(radioButton).toStrictEqual(getByLabelText(OPTIONS[i].label))
})

test('updates on click (uncontrolled)', async () => {
  const user = userEvent.setup()
  const { container, getByLabelText } = render(
    <Radio name={NAME} options={OPTIONS} />
  )

  const allRadioButtons = container.querySelectorAll(SELECTOR)
  expect(allRadioButtons).toHaveLength(OPTIONS.length)

  // try clicking radio buttons in order
  for (const { label } of OPTIONS) {
    await user.click(getByLabelText(label))

    for (const [i, radioButton] of allRadioButtons.entries())
      if (label === OPTIONS[i].label) expect(radioButton).toBeChecked()
      else expect(radioButton).not.toBeChecked()
  }
})

function ControlledRadio() {
  const [value, setValue] = useState(OPTIONS[0].value)
  return (
    <Radio
      name={NAME}
      options={OPTIONS}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

test('updates on click (controlled)', async () => {
  const user = userEvent.setup()
  const { container, getByLabelText } = render(<ControlledRadio />)

  const allRadioButtons = container.querySelectorAll(SELECTOR)
  expect(allRadioButtons).toHaveLength(OPTIONS.length)

  // try clicking radio buttons in order
  for (const { label } of OPTIONS) {
    await user.click(getByLabelText(label))

    for (const [i, radioButton] of allRadioButtons.entries())
      if (label === OPTIONS[i].label) expect(radioButton).toBeChecked()
      else expect(radioButton).not.toBeChecked()
  }
})
