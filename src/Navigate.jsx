import {useHistory} from "./Router";
import {onMount} from "solid-js";

export const Navigate = ({to = '/'}) => {
  const history = useHistory()
  onMount(() => history.push(to))
  return null
}
