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

const options = [
  { value: 0, label: 'foo' },
  { value: 1, label: 'bar' },
  { value: 2, label: 'baz' },
]

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
