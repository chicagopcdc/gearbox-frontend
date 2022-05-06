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
