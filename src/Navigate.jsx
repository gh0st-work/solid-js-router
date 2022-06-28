import {useHistory} from "./Router";
import {createEffect, onMount} from "solid-js";

export const Navigate = ({to = '/'}) => {
  const history = useHistory()
  onMount(() => {
    console.log(to)
    history.push(to)
  })
  return null
}
