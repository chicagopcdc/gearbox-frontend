import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import type { StudyVersionAdjudication } from '../model'
import { AdminStudySelector } from './AdminStudySelector'

function studyVersion(
  id: number,
  code: string,
  status: StudyVersionAdjudication['status'],
  name = `${code} study`
): StudyVersionAdjudication {
  return {
    id,
    study_version_num: 1,
    status,
    eligibility_criteria_id: id * 10,
    study_algorithm_engine_id: null,
    study: {
      id,
      code,
      name,
      create_date: null,
      active: status === 'ACTIVE',
      description: '',
      links: [],
      sites: [],
      follow_up_info: null,
    },
  }
}

test('groups studies by workflow status and keeps published studies read-only', async () => {
  const user = userEvent.setup()
  const onChange = jest.fn()
  const needsInput = studyVersion(1, 'TRIAL-1', 'IN_PROCESS')
  const published = studyVersion(2, 'TRIAL-2', 'ACTIVE')
  const { getByLabelText, getByRole } = render(
    <AdminStudySelector
      groups={{ needsInput: [needsInput], published: [published] }}
      label="Select a Study"
      name="studyVersion"
      value=""
      onChange={onChange}
    />
  )

  expect(getByRole('group', { name: 'Needs input (1)' })).toBeInTheDocument()
  expect(getByRole('group', { name: 'Published (1)' })).toBeInTheDocument()
  expect(
    getByRole('option', { name: 'TRIAL-2 - TRIAL-2 study' })
  ).toBeDisabled()
  expect(
    getByRole('option', { name: 'TRIAL-1 - TRIAL-1 study' })
  ).not.toBeDisabled()

  await user.selectOptions(
    getByLabelText('Select a Study'),
    String(needsInput.eligibility_criteria_id)
  )
  expect(onChange).toHaveBeenCalledWith(needsInput.eligibility_criteria_id)
})

test('searches trials by code or title and clears the filter', async () => {
  const user = userEvent.setup()
  const needsInput = studyVersion(1, 'TRIAL-1', 'IN_PROCESS')
  const published = studyVersion(
    2,
    'TRIAL-2',
    'ACTIVE',
    'Rare disease protocol'
  )
  const { getByLabelText, getByRole, queryByRole } = render(
    <AdminStudySelector
      groups={{ needsInput: [needsInput], published: [published] }}
      label="Select a Study"
      name="studyVersion"
      value=""
      onChange={jest.fn()}
    />
  )
  const search = getByRole('searchbox', { name: 'Search trials' })

  await user.type(search, 'trial-1')

  expect(
    getByRole('option', { name: 'TRIAL-1 - TRIAL-1 study' })
  ).toBeInTheDocument()
  expect(
    queryByRole('option', { name: 'TRIAL-2 - TRIAL-2 study' })
  ).not.toBeInTheDocument()
  expect(getByRole('status')).toHaveTextContent('1 trial found')

  await user.click(getByLabelText('Clear trial search'))

  expect(search).toHaveValue('')
  expect(
    getByRole('option', { name: 'TRIAL-2 - Rare disease protocol' })
  ).toBeInTheDocument()

  await user.type(search, 'rare disease')
  expect(
    getByRole('option', { name: 'TRIAL-2 - Rare disease protocol' })
  ).toBeDisabled()
  expect(
    queryByRole('option', { name: 'TRIAL-1 - TRIAL-1 study' })
  ).not.toBeInTheDocument()
})

test('shows an empty state and supports keyboard handoff to the trial list', async () => {
  const user = userEvent.setup()
  const { getByLabelText, getByRole } = render(
    <AdminStudySelector
      groups={{
        needsInput: [studyVersion(1, 'TRIAL-1', 'IN_PROCESS')],
        published: [],
      }}
      label="Select a Study"
      name="studyVersion"
      value=""
      onChange={jest.fn()}
    />
  )
  const search = getByRole('searchbox', { name: 'Search trials' })

  await user.type(search, 'no result')
  expect(getByRole('option', { name: 'No matching trials' })).toBeDisabled()
  expect(getByRole('status')).toHaveTextContent('0 trials found')

  await user.clear(search)
  await user.type(search, '{ArrowDown}')
  expect(getByLabelText('Select a Study')).toHaveFocus()
})

test('clears the selected study when the search filters it out', async () => {
  const user = userEvent.setup()
  const needsInput = studyVersion(1, 'TRIAL-1', 'IN_PROCESS')
  const otherStudy = studyVersion(2, 'TRIAL-2', 'IN_PROCESS')

  function ControlledSelector() {
    const [value, setValue] = useState<number | ''>('')
    return (
      <>
        <AdminStudySelector
          groups={{
            needsInput: [needsInput, otherStudy],
            published: [],
          }}
          label="Select a Study"
          name="studyVersion"
          value={value}
          onChange={setValue}
        />
        <output aria-label="Selected study">{value || 'None'}</output>
      </>
    )
  }

  const { getByLabelText, getByRole } = render(<ControlledSelector />)
  await user.selectOptions(
    getByLabelText('Select a Study'),
    String(needsInput.eligibility_criteria_id)
  )
  expect(getByRole('status', { name: 'Selected study' })).toHaveTextContent(
    String(needsInput.eligibility_criteria_id)
  )

  await user.type(getByRole('searchbox', { name: 'Search trials' }), 'TRIAL-2')

  await waitFor(() =>
    expect(getByRole('status', { name: 'Selected study' })).toHaveTextContent(
      'None'
    )
  )
  expect(getByLabelText('Select a Study')).toHaveValue('')
})
