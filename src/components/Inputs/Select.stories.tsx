import React from 'react'
import Select from './Select'
import '../../index.css'

export default {
  title: 'Select',
  component: Select,
  decorators: [
    (storyFn: () => JSX.Element) => <div className="m-4">{storyFn()}</div>,
  ],
}

const options = [{ value: 'foo' }, { value: 'bar' }, { value: 'baz' }]

export const defaultView = () => (
  <Select
    label="simple select"
    options={options}
    placeholder="Select from options"
    onChange={(e) => console.log(e.target.value)}
  />
)

export const disabled = () => (
  <Select
    label="simple select"
    options={options}
    disabled
    placeholder="Disabled"
    value="foo"
  />
)
