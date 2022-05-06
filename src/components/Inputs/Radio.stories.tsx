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
