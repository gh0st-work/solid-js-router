import {useHistory} from "./Router";
import {createMemo} from "solid-js";


export const linkBind = ({
  href,
  hrefMemo = () => null,
  beforeRedirect = ({href, e}) => {},
  afterRedirect = ({href, e}) => {},
}) => {
  const history = useHistory()
  
  const realHref = createMemo(() => hrefMemo() ?? href)
  
  return {
    href: realHref(),
    onClick: (e) => {
      e.preventDefault()
      beforeRedirect({href: realHref(), e})
      history.push(realHref())
      afterRedirect({href: realHref(), e})
    }
  }
}

export const Link = ({
  href,
  hrefMemo = () => null,
  children,
  beforeRedirect = ({href, e}) => {},
  afterRedirect = ({href, e}) => {},
  ...otherProps
}) => {
  
  return (
    <a
      {...otherProps}
      {...linkBind({
        href,
        hrefMemo,
        beforeRedirect,
        afterRedirect
      })}
    >
      {children}
    </a>
  )
}