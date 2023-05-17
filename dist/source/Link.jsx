import { useHistory } from "./Router.js";
import { createMemo, splitProps } from "solid-js";
export function Link(props) {
    const [local, others] = splitProps(props, ['href', 'hrefMemo', 'beforeRedirect', 'afterRedirect']);
    const { href, hrefMemo, beforeRedirect, afterRedirect } = local;
    const history = useHistory();
    const realHref = createMemo(() => (hrefMemo ? hrefMemo() : null) ?? href);
    return (<a {...others} href={realHref()} onClick={(e) => {
            e.preventDefault();
            beforeRedirect && beforeRedirect({ href: realHref(), e });
            history.push(realHref());
            afterRedirect && afterRedirect({ href: realHref(), e });
        }}/>);
}
