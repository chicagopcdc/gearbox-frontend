import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import TextField from './TextField'
import '../../index.css'

function onChange(e: React.BaseSyntheticEvent) {
  return action(`${e.target.value}`)(e)
}

export default {
  title: 'Inputs/TextField',
  component: TextField,
} as ComponentMeta<typeof TextField>

export const Basic: ComponentStory<typeof TextField> = (args) => (
  <div className="m-4">
    <TextField {...args} />
  </div>
)

Basic.args = {
  label: 'A basic text field',
  name: 'basic-field',
  onChange,
  placeholder: 'placeholder',
}

export const Text = Basic.bind({})

Text.args = {
  label: 'A text field',
  name: 'text-field',
  onChange,
  placeholder: 'Some text',
  type: 'text',
}

Text.argTypes = {
  type: {
    table: { disable: true },
  },
  max: {
    table: { disable: true },
  },
  min: {
    table: { disable: true },
  },
  step: {
    table: { disable: true },
  },
}

export const Password = Basic.bind({})

Password.args = {
  label: 'A password field',
  name: 'password-field',
  onChange,
  placeholder: 'Some password',
  type: 'password',
}

Password.argTypes = {
  type: {
    table: { disable: true },
  },
  max: {
    table: { disable: true },
  },
  min: {
    table: { disable: true },
  },
  step: {
    table: { disable: true },
  },
}

export const Number = Basic.bind({})

Number.args = {
  label: 'A number field',
  name: 'number-field',
  onChange,
  placeholder: 'Some number',
  type: 'number',
}

Number.argTypes = {
  type: {
    table: { disable: true },
  },
  pattern: {
    table: { disable: true },
  },
}
