import React from 'react'
import AgeField from './AgeField'
import '../../index.css'

export default {
  title: 'AgeField',
  components: AgeField,
  decorators: [
    (storyFn: () => JSX.Element) => <div className="m-4">{storyFn()}</div>,
  ],
}

export const defaultView = () => (
  <AgeField
    label="default age field"
    onChange={(e) => console.log(e.target.value)}
  />
)
