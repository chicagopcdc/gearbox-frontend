import LinkExternal from './components/LinkExternal'
import {
  DOMNode,
  HTMLReactParserOptions,
  Element,
  domToReact,
  attributesToProps,
} from 'html-react-parser'
import { gaEvents } from './hooks/useGoogleAnalytics'

type ComponentMapType = {
  [key: string]: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: (props: any) => JSX.Element
    onClick?: () => void
  }
}
const componentMap: ComponentMapType = {
  linkexternal: {
    component: LinkExternal,
    onClick: gaEvents.clickLLSLinkEvent,
  },
}

export const replace: HTMLReactParserOptions['replace'] = (
  domNode: DOMNode
) => {
  const element = domNode as Element
  if (element.type === 'tag' && componentMap[element.name]) {
    const Component = componentMap[element.name]
    const props = attributesToProps(element.attribs)
    return (
      <Component.component onClick={Component.onClick} {...props}>
        {domToReact(element.children, { replace })}
      </Component.component>
    )
  }
}
