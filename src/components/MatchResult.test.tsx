import { render } from '@testing-library/react'
import MatchResult from './MatchResult'

test('labels undetermined trial results as potential matches', () => {
  const { getByRole, getByText, queryByText } = render(
    <MatchResult
      matchDetails={{}}
      matchGroups={{ matched: [], undetermined: [], unmatched: [] }}
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
