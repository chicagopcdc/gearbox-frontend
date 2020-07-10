import React from 'react'
import Radio from './Radio'
import '../../index.css'

export default {
  title: 'Radio',
  component: Radio,
  decorators: [
    (storyFn: () => JSX.Element) => <div className="m-4">{storyFn()}</div>,
  ],
}

const options = ['foo', 'bar', 'baz']
export const defaultView: React.FC = () => {
  return (
    <Radio
      label="default radio"
      name="radio"
      options={options}
      onChange={(e: any) => console.log(e.target.value)}
    />
  )
}

export const defaultValue: React.FC = () => {
  return (
    <Radio
      label="with default value"
      name="radio"
      options={options}
      value={'foo'}
      onChange={(e: any) => console.log(e.target.value)}
    />
  )
}

export const disabled: React.FC = () => {
  return (
    <Radio
      label="disabled"
      name="radio"
      options={options}
      value={'bar'}
      disabled
      onChange={(e: any) => console.log(e.target.value)}
    />
  )
}
