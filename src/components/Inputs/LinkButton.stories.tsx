import LinkButton from './LinkButton'
import '../../index.css'

export default {
  title: 'LinkButton',
  components: LinkButton,
  decorators: [
    (storyFn: () => JSX.Element) => <div className="m-4">{storyFn()}</div>,
  ],
}

export const defaultView = () => (
  <LinkButton to="https://www.uchicago.edu/">Click me</LinkButton>
)

export const block = () => (
  <LinkButton to="https://www.uchicago.edu/" block>
    Click me
  </LinkButton>
)

export const outline = () => (
  <LinkButton to="https://www.uchicago.edu/" outline>
    Click me
  </LinkButton>
)

export const small = () => (
  <LinkButton to="https://www.uchicago.edu/" size="small">
    Click me
  </LinkButton>
)

export const large = () => (
  <LinkButton to="https://www.uchicago.edu/" size="large">
    Click me
  </LinkButton>
)
