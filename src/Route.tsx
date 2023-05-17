import {splitProps, Accessor, Component} from "solid-js";
import {JSX} from "solid-js/types/jsx";
import {Dictionary} from "./types";

export interface RouteProps {
  path: string,
  full?: boolean,
  fallback?: boolean,
  fallbackParams?: Dictionary<string>,
  depsMemo?: Accessor<any>,
  children?: JSX.Element|Component<Dictionary<string>>,
  [key: string]: any,
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

export const Route = (props: RouteProps = {
  path: '',
  depsMemo: (() => null),
  fallback: false,
  fallbackParams: {},
  full: false
}): JSX.Element => {
  const [local, others] = splitProps(props, ['fallback', 'path', 'depsMemo', 'full', 'fallbackParams'])

  const route: Route = {
    _isRoute: true,
    path: local.path,
    depsMemo: local.depsMemo,
    fallback: !!local.fallback,
    fallbackParams: local.fallbackParams,
    full: !!local.full,
    others
  }

  return ((route as unknown) as JSX.Element)
}
