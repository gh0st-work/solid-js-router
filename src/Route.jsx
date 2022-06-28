import {splitProps} from "solid-js";

export const Route = (props) => {
  const [local, others] = splitProps(props, ['fallback', 'path'])
  return ({...local, _isRoute: true, fallback: !!local.fallback, others})
}