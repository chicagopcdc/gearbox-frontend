import LinkExternal from './components/LinkExternal'
import {
  DOMNode,
  HTMLReactParserOptions,
  Element,
  domToReact,
  attributesToProps,
} from 'html-react-parser'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentMap: { [key: string]: (props: any) => JSX.Element } = {
  linkexternal: LinkExternal,
}

export const replace: HTMLReactParserOptions['replace'] = (
  domNode: DOMNode
) => {
  const element = domNode as Element
  if (element.type === 'tag' && componentMap[element.name]) {
    const Component = componentMap[element.name]
    const props = attributesToProps(element.attribs)

    return (
      <Component {...props}>
        {domToReact(element.children, { replace })}
      </Component>
    )
  }
}
