import React from 'react'
import TextField from './TextField'
import '../../index.css'

export default {
  title: 'TextField',
  component: TextField,
  decorators: [
    (storyFn: () => JSX.Element) => <div className="m-4">{storyFn()}</div>,
  ],
}

export const defaultView = () => (
  <TextField
    label="default text field"
    placeholder="some text"
    onChange={(e) => console.log(e.target.value)}
  />
)

export const readonly = () => (
  <TextField
    label="read only"
    value="cannot be changed"
    readonly
    onChange={(e) => console.log(e.target.value)}
  />
)

export const typePassword = () => (
  <TextField
    label="password"
    placeholder="some password"
    type="password"
    onChange={(e) => console.log(e.target.value)}
  />
)

export const typeNumber = () => (
  <>
    <TextField
      label="number field"
      type="number"
      placeholder="some number"
      onChange={(e) => console.log(e.target.value)}
    />
    <br />
    <br />
    <TextField
      label="with min and max"
      type="number"
      placeholder="between 0 and 10"
      numberAttrs={{ min: 0, max: 10 }}
      onChange={(e) => console.log(e.target.value)}
    />
    <br />
    <br />
    <TextField
      label="with step"
      type="number"
      placeholder="by 0.1"
      numberAttrs={{ step: 0.1 }}
      onChange={(e) => console.log(e.target.value)}
    />
  </>
)
