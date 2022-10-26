import {useHistory} from "./Router.js";
import {Accessor, createMemo, ParentComponent, splitProps} from "solid-js";

export interface LinkProps {
  href?: string,
  hrefMemo?: Accessor<string|null>
  beforeRedirect: ({href, e}: {href: string, e: any}) => void,
  afterRedirect: ({href, e}: {href: string, e: any}) => void,
}


export const Link: ParentComponent<LinkProps> = (props) => {

  const [local, others] = splitProps(props, ['href', 'hrefMemo', 'beforeRedirect', 'afterRedirect'])

  const {href, hrefMemo, beforeRedirect, afterRedirect} = local

  const history = useHistory()
  
  const realHref = createMemo(() => (hrefMemo ? hrefMemo() : null) ?? href)
  
  return (
    <a
      {...others}
      href={realHref()}
      onClick={(e) => {
        e.preventDefault()
        beforeRedirect && beforeRedirect({href: realHref(), e})
        history.push(realHref())
        beforeRedirect && afterRedirect({href: realHref(), e})
      }}
    />
  )
}