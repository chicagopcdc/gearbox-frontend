import React from 'react'
import Box from './Box'
import '../index.css'

export default {
  title: 'Box',
  component: Box,
  decorators: [
    (storyFn: () => JSX.Element) => <div className="m-4">{storyFn()}</div>,
  ],
}

export const defaultView = () => <Box name="Box name">This is a simple box</Box>
