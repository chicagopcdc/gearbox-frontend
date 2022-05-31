import { useState } from 'react'
import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Checkbox from './Checkbox'
import '../../index.css'

export default {
  title: 'Inputs/Checkbox',
  component: Checkbox,
} as ComponentMeta<typeof Checkbox>

export const Basic: ComponentStory<typeof Checkbox> = (args) => (
  <div className="m-4">
    <Checkbox {...args} />
  </div>
)

Basic.args = {
  disabled: false,
  label: 'A basic checkbox',
  name: 'checkbox',
  readOnly: false,
  onChange: (e) => action(`${e.target.checked}`)(e),
}

Basic.argTypes = {
  checked: {
    options: [undefined, false, true],
    control: 'select',
  },
}

export const Controlled: ComponentStory<typeof Checkbox> = (args) => {
  const [value, setValue] = useState<boolean>()
  const buttonClassName = 'm-1 px-2 py-1 bg-gray-200 hover:bg-gray-300 text-sm'

  return (
    <div className="m-4">
      <Checkbox
        {...args}
        checked={value}
        onChange={(e) => {
          args.onChange?.(e)
          setValue(e.target.checked)
        }}
      />
      <div className="mt-4">
        <span className="mr-2 italic">Controls:</span>
        <button
          className={buttonClassName}
          type="button"
          onClick={() => {
            action(`(controlled) true`)({})
            setValue(true)
          }}
        >
          Check
        </button>
        <button
          className={buttonClassName}
          type="button"
          onClick={() => {
            action(`(controlled) false`)({})
            setValue(false)
          }}
        >
          Uncheck
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
  disabled: false,
  label: 'A controlled checkbox',
  name: 'controlled-checkbox',
  readOnly: false,
  onChange: (e) => action(`${e.target.checked}`)(e),
}
