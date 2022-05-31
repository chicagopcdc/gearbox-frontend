import { useState } from 'react'
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

export const Controlled: ComponentStory<typeof TextField> = (args) => {
  const [value, setValue] = useState<string>()
  const buttonClassName = 'm-1 px-2 py-1 bg-gray-200 hover:bg-gray-300 text-sm'

  return (
    <div className="m-4">
      <TextField
        {...args}
        onChange={(e) => {
          args.onChange?.(e)
          setValue(e.target.value)
        }}
        value={value}
      />
      <div className="mt-4">
        <span className="mr-2 italic">Controls:</span>
        <button
          className={buttonClassName}
          type="button"
          onClick={() => {
            action('(controlled) foo')({})
            setValue('foo')
          }}
        >
          {'"foo"'}
        </button>
        <button
          className={buttonClassName}
          type="button"
          onClick={() => {
            action('(controlled) bar')({})
            setValue('bar')
          }}
        >
          {'"bar"'}
        </button>
        <button
          className={buttonClassName}
          type="button"
          onClick={() => {
            action('(controlled) Clear')({})
            setValue(undefined)
          }}
        >
          Clear
        </button>
      </div>
    </div>
  )
}

Controlled.args = {
  label: 'A controlled field',
  name: 'controlled-field',
  onChange,
  placeholder: 'placeholder',
}
