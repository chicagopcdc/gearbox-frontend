import React from 'react'
import Checkbox from './Checkbox'
import '../../index.css'

export default {
  title: 'Checkbox',
  component: Checkbox,
  decorators: [
    (storyFn: () => JSX.Element) => <div className="m-4">{storyFn()}</div>,
  ],
}

export const defaultView = () => (
  <Checkbox
    label="default checkbox"
    onChange={(e) => console.log(e.target.checked)}
  />
)

export const checked = () => <Checkbox label="checked" checked readOnly />

export const unchecked = () => (
  <Checkbox label="unchecked" checked={false} readOnly />
)
