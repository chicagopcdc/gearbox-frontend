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
    <Textarea {...args} />
  </div>
)

Basic.args = {
  label: 'A basic text area',
  name: 'textarea',
  placeholder: 'Type some text here',
  onChange: (e) => action(`${e.target.value}`)(e),
}
