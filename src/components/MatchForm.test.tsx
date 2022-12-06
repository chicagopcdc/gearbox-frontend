import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import type { MatchFormConfig, MatchFormValues } from '../model'
import MatchForm from './MatchForm'

const CONFIG: MatchFormConfig = {
  groups: [
    { id: 1, name: 'Lorem' },
    { id: 2, name: 'Ipsum' },
  ],
  fields: [
    {
      id: 1,
      groupId: 1,
      type: 'text',
      name: 'foo',
      label: 'Foo',
      relevant: true,
    },
    {
      id: 2,
      groupId: 2,
      type: 'text',
      name: 'bar',
      label: 'Bar',
      relevant: true,
    },
  ],
}

function MatchFormWrapper() {
  const [matchInput, setMatchInput] = useState({} as MatchFormValues)
  return (
    <>
      <MatchForm
        config={CONFIG}
        isFilterActive={false}
        matchInput={matchInput}
        setIsUpdating={() => /* noop */ null}
        updateMatchInput={setMatchInput}
      />
    </>
  )
}

test('renders with only first section expanded', async () => {
  const { container } = render(<MatchFormWrapper />)

  const form = container.querySelector('form')
  expect(form).toBeInTheDocument()

  const sections = container.querySelectorAll('section')
  expect(sections).toHaveLength(CONFIG.groups.length)
  for (const [i, section] of sections.entries()) {
    const sectionName = section.querySelector('h2')
    expect(sectionName).toHaveTextContent(CONFIG.groups[i].name)

    const dropDownButton = section.querySelector('button')
    const initialAriaLabel = i === 0 ? 'Collapse dropdown' : 'Expand dropdown'
    expect(dropDownButton).toHaveAttribute('aria-label', initialAriaLabel)
  }
})

test('updates value on user input', async () => {
  const user = userEvent.setup()
  const { getByLabelText } = render(<MatchFormWrapper />)

  const input = getByLabelText(CONFIG.fields[0].label as string)
  await user.click(input)
  await user.keyboard('foo')
  expect(input).toHaveValue('foo')
})

test.todo('shows temporary "updating" state on input')
