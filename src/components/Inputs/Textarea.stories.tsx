import { useState } from 'react'
import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Textarea from './Textarea'
import '../../index.css'

export default {
  title: 'Inputs/Textarea',
  component: Textarea,
} as ComponentMeta<typeof Textarea>

export const Basic: ComponentStory<typeof Textarea> = (args) => (
  <div className="m-4">
    <form
      onChange={(e: React.ChangeEvent<HTMLFormElement>) =>
        action(`${e.target.value}`)(e)
      }
      onSubmit={(e) => e.preventDefault()}
    >
      <Textarea {...args} />
    </form>
  </div>
)

Basic.args = {
  label: 'A basic text area',
  name: 'textarea',
  placeholder: 'Type some text here',
}

export const Controlled: ComponentStory<typeof Textarea> = (args) => {
  const [value, setValue] = useState<string>()
  const buttonClassName = 'm-1 px-2 py-1 bg-gray-200 hover:bg-gray-300 text-sm'

  return (
    <div className="m-4">
      <Textarea
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
  label: 'A controlled text area',
  name: 'controlled-textarea',
  placeholder: 'Type some text here',
  onChange: (e) => action(`${e.target.value}`)(e),
}
