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
