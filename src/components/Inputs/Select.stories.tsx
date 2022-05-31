import { useState } from 'react'
import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Select from './Select'
import '../../index.css'

const options = [
  { value: 0, label: 'foo' },
  { value: 1, label: 'bar' },
  { value: 2, label: 'baz' },
]

export default {
  title: 'Inputs/Select',
  component: Select,
} as ComponentMeta<typeof Select>

export const Basic: ComponentStory<typeof Select> = (args) => (
  <div className="m-4">
    <Select {...args} />
  </div>
)

Basic.args = {
  label: 'A simple select',
  name: 'select',
  onChange: (e) => action(`${e.target.value}`)(e),
  options,
  placeholder: 'Select from options',
}

Basic.argTypes = {
  value: {
    options: [undefined, ...options.map((o) => o.value)],
    control: 'select',
  },
}

export const Controlled: ComponentStory<typeof Select> = (args) => {
  const [value, setValue] = useState<number>()
  const buttonClassName = 'm-1 px-2 py-1 bg-gray-200 hover:bg-gray-300 text-sm'

  return (
    <div className="m-4">
      <Select
        {...args}
        value={value}
        onChange={(e) => {
          args.onChange?.(e)
          setValue(Number(e.target.value))
        }}
      />
      <div className="mt-4">
        <span className="mr-2 italic">Controls:</span>
        <button
          className={buttonClassName}
          type="button"
          onClick={() => {
            action(`(controlled) 0`)({})
            setValue(0)
          }}
        >
          {'"foo"'}
        </button>
        <button
          className={buttonClassName}
          type="button"
          onClick={() => {
            action(`(controlled) 1`)({})
            setValue(1)
          }}
        >
          {'"bar"'}
        </button>
        <button
          className={buttonClassName}
          type="button"
          onClick={(e) => {
            action(`(controlled) Clear`)({})
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
  label: 'A controlled select',
  name: 'controlled-select',
  onChange: (e) => action(`${e.target.value}`)(e),
  options,
  placeholder: 'Select from options',
}
