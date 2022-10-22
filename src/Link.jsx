import {useHistory} from "./Router";
import {createMemo} from "solid-js";


export const Link = ({
  href,
  hrefMemo = () => null,
  children,
  beforeRedirect = ({href, e}) => {},
  afterRedirect = ({href, e}) => {},
  ...otherProps
}) => {
  const history = useHistory()
  
  const realHref = createMemo(() => hrefMemo() ?? href)
  
  return (
    <a
      {...otherProps}
      href={realHref()}
      onClick={(e) => {
        e.preventDefault()
        beforeRedirect({href: realHref(), e})
        history.push(realHref())
        afterRedirect({href: realHref(), e})
      }}
    >
      {children}
    </a>
  )
}