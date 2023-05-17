import {useHistory} from "./Router.js";
import {onMount} from "solid-js";
import {JSX} from "solid-js/types/jsx";

export function Navigate({
  to = '/'
} : {
  to: string,
}) : JSX.Element {
  const history = useHistory()
  onMount(() => history.push(to))
  return null
}
