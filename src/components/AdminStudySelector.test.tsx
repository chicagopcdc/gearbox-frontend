import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { StudyVersionAdjudication } from '../model'
import { AdminStudySelector } from './AdminStudySelector'

function studyVersion(
  id: number,
  code: string,
  status: StudyVersionAdjudication['status']
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
      name: `${code} study`,
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
  expect(onChange).toHaveBeenCalledTimes(1)
})
