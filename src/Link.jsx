import {useHistory} from "./Router";


export const Link = ({href, children, beforeRedirect = ({href, e}) => {}, afterRedirect = ({href, e}) => {}, ...otherProps}) => {
  const history = useHistory()
  
  return (
    <a
      {...otherProps}
      href={href}
      onClick={(e) => {
        e.preventDefault()
        beforeRedirect({href, e})
        history.push(href)
        afterRedirect({href, e})
      }}
    >
      {children}
    </a>
  )
}