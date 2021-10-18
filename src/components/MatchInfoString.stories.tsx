import MatchInfoString from './MatchInfoString'
import '../index.css'

export default {
  title: 'MatchInfoString',
  component: MatchInfoString,
  decorators: [
    (storyFn: () => JSX.Element) => <div className="m-4">{storyFn()}</div>,
  ],
}

export const EQ = () => (
  <>
    <MatchInfoString
      fieldName="foo"
      fieldValue={0}
      isMatched={undefined}
      operator="eq"
    />
    <br />
    <MatchInfoString fieldName="foo" fieldValue={0} isMatched operator="eq" />
    <br />
    <MatchInfoString
      fieldName="foo"
      fieldValue={0}
      isMatched={false}
      operator="eq"
    />
    <br />
    <MatchInfoString
      fieldName="bar"
      fieldValue={0}
      fieldValueLabel="baz"
      isMatched={undefined}
      operator="eq"
    />
    <br />
    <MatchInfoString
      fieldName="bar"
      fieldValue={0}
      fieldValueLabel="baz"
      isMatched
      operator="eq"
    />
    <br />
    <MatchInfoString
      fieldName="bar"
      fieldValue={0}
      fieldValueLabel="baz"
      isMatched={false}
      operator="eq"
    />
  </>
)

export const NE = () => (
  <>
    <MatchInfoString
      fieldName="foo"
      fieldValue={0}
      isMatched={undefined}
      operator="ne"
    />
    <br />
    <MatchInfoString fieldName="foo" fieldValue={0} isMatched operator="ne" />
    <br />
    <MatchInfoString
      fieldName="foo"
      fieldValue={0}
      isMatched={false}
      operator="ne"
    />
    <br />
    <MatchInfoString
      fieldName="bar"
      fieldValue={0}
      fieldValueLabel="baz"
      isMatched={undefined}
      operator="ne"
    />
    <br />
    <MatchInfoString
      fieldName="bar"
      fieldValue={0}
      fieldValueLabel="baz"
      isMatched
      operator="ne"
    />
    <br />
    <MatchInfoString
      fieldName="bar"
      fieldValue={0}
      fieldValueLabel="baz"
      isMatched={false}
      operator="ne"
    />
  </>
)

export const GTAndGTE = () => (
  <>
    <MatchInfoString
      fieldName="foo"
      fieldValue={0}
      isMatched={undefined}
      operator="gt"
    />
    <br />
    <MatchInfoString fieldName="foo" fieldValue={0} isMatched operator="gt" />
    <br />
    <MatchInfoString
      fieldName="foo"
      fieldValue={0}
      isMatched={false}
      operator="gt"
    />
    <br />
    <MatchInfoString
      fieldName="bar"
      fieldValue={0}
      isMatched={undefined}
      operator="gte"
    />
    <br />
    <MatchInfoString fieldName="bar" fieldValue={0} isMatched operator="gte" />
    <br />
    <MatchInfoString
      fieldName="bar"
      fieldValue={0}
      isMatched={false}
      operator="gte"
    />
  </>
)

export const LTAndLTE = () => (
  <>
    <MatchInfoString
      fieldName="foo"
      fieldValue={0}
      isMatched={undefined}
      operator="lt"
    />
    <br />
    <MatchInfoString fieldName="foo" fieldValue={0} isMatched operator="lt" />
    <br />
    <MatchInfoString
      fieldName="foo"
      fieldValue={0}
      isMatched={false}
      operator="lt"
    />
    <br />
    <MatchInfoString
      fieldName="bar"
      fieldValue={0}
      isMatched={undefined}
      operator="lte"
    />
    <br />
    <MatchInfoString fieldName="bar" fieldValue={0} isMatched operator="lte" />
    <br />
    <MatchInfoString
      fieldName="bar"
      fieldValue={0}
      isMatched={false}
      operator="lte"
    />
  </>
)

export const IN = () => (
  <>
    <MatchInfoString
      fieldName="foo"
      fieldValue={[0, 1]}
      isMatched={undefined}
      operator="in"
    />
    <br />
    <MatchInfoString
      fieldName="foo"
      fieldValue={[0, 1]}
      isMatched
      operator="in"
    />
    <br />
    <MatchInfoString
      fieldName="foo"
      fieldValue={[0, 1]}
      fieldValueLabel={['bar', 'baz']}
      isMatched={false}
      operator="in"
    />
  </>
)
