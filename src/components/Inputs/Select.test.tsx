import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import Select from './Select'

const NAME = 'select'
const SELECTOR = `select[name="${NAME}"]`
const OPTIONS = [
  { value: 0, label: 'foo' },
  { value: 1, label: 'bar' },
  { value: 2, label: 'baz' },
]

test('renders', () => {
  const { container, getAllByRole, getByText } = render(
    <Select name={NAME} options={OPTIONS} />
  )
  expect(container.querySelector(SELECTOR)).toBeInTheDocument()

  const allOptions = getAllByRole('option')
  expect(allOptions).toHaveLength(OPTIONS.length)
  for (const [i, option] of allOptions.entries())
    expect(option).toStrictEqual(getByText(OPTIONS[i].label))
})

test('renders with label', () => {
  const label = 'Select'
  const { container, getAllByRole, getByLabelText, getByText } = render(
    <Select name={NAME} label={label} options={OPTIONS} />
  )
  expect(container.querySelector(SELECTOR)).toStrictEqual(getByLabelText(label))

  const allOptions = getAllByRole('option')
  expect(allOptions).toHaveLength(OPTIONS.length)
  for (const [i, option] of allOptions.entries())
    expect(option).toStrictEqual(getByText(OPTIONS[i].label))
})

test('renders with placeholder', () => {
  const { container, getAllByRole, getByText } = render(
    <Select name={NAME} placeholder="placeholder" options={OPTIONS} />
  )
  expect(container.querySelector(SELECTOR)).toBeInTheDocument()

  const allOptions = getAllByRole('option')
  expect(allOptions).toHaveLength(OPTIONS.length)
  for (const [i, option] of allOptions.entries())
    expect(option).toStrictEqual(getByText(OPTIONS[i].label))

  // "placeholder" is a hidden option, instead of a real placeholder
  expect(getByText('placeholder')).toStrictEqual(
    getAllByRole('option', { hidden: true })[0]
  )
})

test('updates on click (uncontrolled)', async () => {
  const user = userEvent.setup()
  const { container, getByRole, getAllByRole } = render(
    <Select name={NAME} options={OPTIONS} />
  )

  const select = container.querySelector(SELECTOR) as HTMLSelectElement
  const allOptions = getAllByRole('option') as HTMLOptionElement[]

  // try selecting options in order
  for (const { label } of OPTIONS) {
    await user.selectOptions(select, [getByRole('option', { name: label })])

    for (const [i, option] of allOptions.entries())
      if (OPTIONS[i].label === label) expect(option.selected).toBe(true)
      else expect(option.selected).toBe(false)
  }
})

function ControlledSelect() {
  const [value, setValue] = useState(OPTIONS[0].value)
  return (
    <Select
      name={NAME}
      options={OPTIONS}
      value={value}
      onChange={(e) => setValue(e.target.value as unknown as number)}
    />
  )
}

test('updates on click (controlled)', async () => {
  const user = userEvent.setup()
  const { container, getByRole, getAllByRole } = render(<ControlledSelect />)

  const select = container.querySelector(SELECTOR) as HTMLSelectElement
  const allOptions = getAllByRole('option') as HTMLOptionElement[]

  // try selecting options in order
  for (const { label } of OPTIONS) {
    await user.selectOptions(select, [getByRole('option', { name: label })])

    for (const [i, option] of allOptions.entries())
      if (OPTIONS[i].label === label) expect(option.selected).toBe(true)
      else expect(option.selected).toBe(false)
  }
})
