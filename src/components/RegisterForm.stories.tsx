import { action } from '@storybook/addon-actions'
import RegisterForm from './RegisterForm'
import type { RegisterDocument } from '../model'
import '../index.css'

export default {
  title: 'RegisterForm',
  component: RegisterForm,
  decorators: [
    (storyFn: () => JSX.Element) => (
      <div
        className="border border-gray border-solid m-4 p-4"
        style={{ width: 'calc(400px + 4rem)' }}
      >
        {storyFn()}
      </div>
    ),
  ],
}

const docsToBeReviewed: RegisterDocument[] = [
  { formatted: '', id: 0, name: 'Foo', required: true },
  { formatted: '', id: 1, name: 'Bar', required: true },
  { formatted: '', id: 2, name: 'Baz', required: false },
]

export const defaultView: React.FC = () => (
  <RegisterForm
    docsToBeReviewed={docsToBeReviewed}
    onRegister={(input) => Promise.resolve(action('register')(input))}
  />
)
