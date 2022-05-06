import type { ComponentMeta, ComponentStory } from '@storybook/react'
import LinkButton from './LinkButton'
import '../index.css'

export default {
  title: 'LinkButton',
  components: LinkButton,
} as ComponentMeta<typeof LinkButton>

export const Basic: ComponentStory<typeof LinkButton> = (args) => (
  <div className="m-4">
    <LinkButton {...args} />
  </div>
)

Basic.args = {
  block: false,
  children: 'Click me',
  outline: false,
  size: undefined,
  to: 'https://www.uchicago.edu/',
}

Basic.argTypes = {
  size: {
    options: [undefined, 'small', 'large'],
    control: 'radio',
  },
}
