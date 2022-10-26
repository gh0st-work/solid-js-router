import {useHistory} from "./Router.js";
import {onMount} from "solid-js";

export const Navigate = ({
  to = '/'
} : {
  to: string,
}) : null => {
  const history = useHistory()
  onMount(() => history.push(to))
  return null
}
