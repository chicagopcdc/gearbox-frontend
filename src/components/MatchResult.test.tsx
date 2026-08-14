import { fireEvent, render } from '@testing-library/react'
import MatchResult from './MatchResult'

const mockTrialMapModalSpy = jest.fn()

jest.mock('./TrialMapModal', () => ({
  __esModule: true,
  default: (props: unknown) => {
    mockTrialMapModalSpy(props)
    return null
  },
}))

test('labels undetermined trial results as potential matches', () => {
  const { getByRole, getByText, queryByText } = render(
    <MatchResult
      matchDetails={{}}
      matchGroups={{ matched: [], undetermined: [], unmatched: [] }}
      allMatchGroups={{ matched: [], undetermined: [], unmatched: [] }}
      mapErrorDetail={null}
      studies={[]}
      matchCounts={{ matched: 0, undetermined: 12, unmatched: 0 }}
      pageSize={10}
      matchPages={{ matched: 1, undetermined: 1, unmatched: 1 }}
      onChangeMatchPage={jest.fn()}
      onSetMatchPage={jest.fn()}
    />
  )

  expect(
    getByRole('heading', { name: 'Potential Match (12)' })
  ).toBeInTheDocument()
  expect(getByText('Potential Match: 1-10 of 12')).toBeInTheDocument()
  expect(queryByText(/Undetermined/i)).not.toBeInTheDocument()
})

test('passes the full match groups, not the paginated page, to the map modal', () => {
  const paginatedMatchGroups = { matched: [1], undetermined: [], unmatched: [] }
  const allMatchGroups = { matched: [1, 2, 3, 4, 5], undetermined: [6], unmatched: [] }

  const { getByText } = render(
    <MatchResult
      matchDetails={{}}
      matchGroups={paginatedMatchGroups}
      allMatchGroups={allMatchGroups}
      mapErrorDetail={null}
      studies={[]}
      matchCounts={{ matched: 5, undetermined: 1, unmatched: 0 }}
      pageSize={4}
      matchPages={{ matched: 1, undetermined: 1, unmatched: 1 }}
      onChangeMatchPage={jest.fn()}
      onSetMatchPage={jest.fn()}
    />
  )

  fireEvent.click(getByText('Map View'))

  expect(mockTrialMapModalSpy).toHaveBeenCalledWith(
    expect.objectContaining({ matchGroups: allMatchGroups })
  )
})

test('shows mapErrorDetail near the Map View button when set', () => {
  const { getByText } = render(
    <MatchResult
      matchDetails={{}}
      matchGroups={{ matched: [], undetermined: [], unmatched: [] }}
      allMatchGroups={{ matched: [], undetermined: [], unmatched: [] }}
      mapErrorDetail="Failed to get match groups"
      studies={[]}
      matchCounts={{ matched: 0, undetermined: 0, unmatched: 0 }}
      pageSize={4}
      matchPages={{ matched: 1, undetermined: 1, unmatched: 1 }}
      onChangeMatchPage={jest.fn()}
      onSetMatchPage={jest.fn()}
    />
  )

  expect(getByText('Failed to get match groups')).toBeInTheDocument()
})
