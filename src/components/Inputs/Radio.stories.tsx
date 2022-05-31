import { useState } from 'react'
import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Radio from './Radio'
import '../../index.css'

const options = [
  { value: 0, label: 'foo' },
  { value: 1, label: 'bar' },
  { value: 2, label: 'baz' },
]

export default {
  title: 'Inputs/Radio',
  component: Radio,
} as ComponentMeta<typeof Radio>

export const Basic: ComponentStory<typeof Radio> = (args) => (
  <div className="m-4">
    <Radio {...args} />
  </div>
)

Basic.args = {
  label: 'A basic radio',
  name: 'radio',
  options,
  onChange: (e) => action(`${e.target.value}`)(e),
}

Basic.argTypes = {
  value: {
    options: [undefined, ...options.map((o) => o.value)],
    control: 'select',
  },
}

export const Controlled: ComponentStory<typeof Radio> = (args) => {
  const [value, setValue] = useState<number>()
  const buttonClassName = 'm-1 px-2 py-1 bg-gray-200 hover:bg-gray-300 text-sm'

  return (
    <div className="m-4">
      <Radio
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
  label: 'A controlled radio',
  name: 'controlled-radio',
  options,
  onChange: (e) => action(`${e.target.value}`)(e),
}
