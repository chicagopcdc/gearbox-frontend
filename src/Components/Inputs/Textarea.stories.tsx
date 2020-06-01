import React from 'react'
import Textarea from './Textarea'
import '../../index.css'

export default {
  title: 'Textarea',
  component: Textarea,
  decorators: [
    (storyFn: () => JSX.Element) => <div className="m-4">{storyFn()}</div>,
  ],
}

export const defaultView = () => (
  <Textarea
    label="default text field"
    placeholder="placeholder"
    onChange={(e) => console.log(e.target.value)}
  />
)

export const readonly = () => (
  <Textarea
    label="Read only"
    value="cannot be changed"
    readonly
    onChange={(e) => console.log(e.target.value)}
  />
)

export const disabled = () => (
  <Textarea
    label="Disabled"
    value="disabled"
    disabled
    onChange={(e) => console.log(e.target.value)}
  />
)
