import {ParentProps, splitProps, Accessor, Component} from "solid-js";
import {JSX} from "solid-js/types/jsx";
import {Dictionary} from "./types";

export interface RouteProps {
  path: string,
  full?: boolean,
  fallback?: boolean,
  fallbackParams?: Dictionary<string>,
  depsMemo?: Accessor<any>,
  children?: JSX.Element|Component<Dictionary<string>>
}

export type Route = {
  path: string,
  full: boolean,
  fallback: Dictionary<string>|boolean,
  fallbackParams: Dictionary<string>,
  depsMemo: Accessor<any>,
  _isRoute: true,
  others: Omit<RouteProps, "fallback" | "path" | "depsMemo">,
}

export const Route = (props: RouteProps): Route => {
  const [local, others] = splitProps(props, ['fallback', 'path', 'depsMemo', 'full', 'fallbackParams'])

  const nullDepsMemp = (() => null)

  return ({
    _isRoute: true,
    path: local.path,
    depsMemo: local.depsMemo ?? nullDepsMemp,
    fallback: !!local.fallback,
    fallbackParams: local.fallbackParams ?? {},
    full: !!local.full,
    others
  })
}
