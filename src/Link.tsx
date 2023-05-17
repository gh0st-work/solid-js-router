import {useHistory} from "./Router.js";
import {Accessor, createMemo, ParentProps, splitProps} from "solid-js";
import {JSX} from "solid-js/types/jsx";


export function Link(props: ParentProps<{
  href?: string,
  hrefMemo?: Accessor<string|null>
  beforeRedirect?: ({href, e}: {href: string, e: any}) => void,
  afterRedirect?: ({href, e}: {href: string, e: any}) => void,
  [key: string]: any,
}>): JSX.Element {

  const [local, others] = splitProps(props, ['href', 'hrefMemo', 'beforeRedirect', 'afterRedirect'])

  const {href, hrefMemo, beforeRedirect, afterRedirect} = local

  const history = useHistory()
  
  const realHref = createMemo<string>(() => (hrefMemo ? hrefMemo() : null) ?? href)
  
  return (
    <a
      {...others}
      href={realHref()}
      onClick={(e) => {
        e.preventDefault()
        beforeRedirect && beforeRedirect({href: realHref(), e})
        history.push(realHref())
        afterRedirect && afterRedirect({href: realHref(), e})
      }}
    />
  )
}