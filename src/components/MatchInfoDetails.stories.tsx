import MatchInfoDetails from './MatchInfoDetails'
import '../index.css'

export default {
  title: 'MatchInfoDetails',
  component: MatchInfoDetails,
  decorators: [
    (storyFn: () => JSX.Element) => <div className="m-4">{storyFn()}</div>,
  ],
}

export const exampleCase = () => (
  <MatchInfoDetails
    matchInfoAlgorithm={{
      criteria: [
        {
          fieldName: 'foo',
          fieldValue: 0,
          fieldValueLabel: 'x',
          isMatched: true,
          operator: 'eq',
        },
        {
          criteria: [
            {
              fieldName: 'foo',
              fieldValue: 0,
              fieldValueLabel: 'y',
              isMatched: false,
              operator: 'ne',
            },
            {
              fieldName: 'bar',
              fieldValue: 10,
              isMatched: true,
              operator: 'gt',
            },
            {
              criteria: [
                {
                  fieldName: 'bar',
                  fieldValue: 15,
                  isMatched: false,
                  operator: 'lte',
                },
                {
                  fieldName: 'baz',
                  fieldValue: [0, 1],
                  fieldValueLabel: ['lorem', 'ipsum'],
                  isMatched: true,
                  operator: 'in',
                },
              ],
              operator: 'OR',
            },
          ],
          operator: 'AND',
        },
      ],
      operator: 'OR',
    }}
  />
)
