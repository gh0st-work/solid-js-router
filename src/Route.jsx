import {splitProps} from "solid-js";

export const Route = (props) => {
  const [local, others] = splitProps(props, ['fallback', 'path', 'depsMemo'])
  return ({...local, _isRoute: true, fallback: !!local.fallback, others})
}