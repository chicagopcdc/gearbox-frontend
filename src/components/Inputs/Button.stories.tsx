import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Button from './Button'
import '../../index.css'

export default {
  title: 'Inputs/Button',
  components: Button,
} as ComponentMeta<typeof Button>

export const Basic: ComponentStory<typeof Button> = (args) => (
  <div className="m-4">
    <Button {...args} />
  </div>
)

Basic.args = {
  children: 'Click me',
  disabled: false,
  onClick: action('click'),
  outline: false,
}

Basic.argTypes = {
  size: {
    options: [undefined, 'small', 'large'],
    control: { type: 'radio' },
  },
}
