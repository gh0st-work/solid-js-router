import {
  Accessor,
  children as childrenSolid,
  Component,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  useContext,
} from "solid-js";
import {Dynamic} from 'solid-js/web';
import {isDictsSame, normalizeChildren} from "./utils";
import {useRouter} from "./Router";
import {parse} from "regexparam";
import {Route} from "./Route";
import {JSX} from "solid-js/types/jsx";
import {Dictionary} from "./types";


type Match = [string, Dictionary<string>]|false

interface PatternedRoute extends Route {
  pattern: string,
  parent?: Route,
}

interface MatchedRoute extends PatternedRoute {
  match: Match,
  matchParams: Dictionary<string>,
  firstMatch: boolean,
}

interface CalculatedRoute extends MatchedRoute {
  patternPrefix: string,
  linkPrefix: string,
}

type RoutesLegacyValue = {
  route?: Accessor<CalculatedRoute>,
}

const RoutesLegacy = createContext<RoutesLegacyValue>({})
const useRoutesLegacy = () => useContext(RoutesLegacy)


const _pathMatchers = {}
export const createMatcher = (
  path: string,
  end: boolean = false,
) => {
  const { keys, pattern } = parse(path, !end)
  return (pathToCheck: string): [string, Dictionary<string>]|false => {
    const matches = pattern.exec(pathToCheck)
    if (!matches) {
      return false
    }
    const params = keys.reduce((acc, _, i) => {
      acc[keys[i]] = matches[i + 1];
      return acc;
    }, {})
    return [matches[0] || '/', params]
  }
}
export const matchPath = (pattern: string, path: string): Match => {
  if (path === undefined) {
    return false
  } else if (_pathMatchers[pattern] === undefined) {
    _pathMatchers[pattern] = createMatcher(pattern)
  }
  return _pathMatchers[pattern](path)
}


type RoutesType = {
  depsMemo?: Accessor<any>,

}

export const Routes: Component = ({
  fallback = null,
  onRoute = () => null,
  depsMemo = () => null,
  children,
} : {
  fallback: any,
  onRoute?: ({route, parentRoute} : {route?: CalculatedRoute, parentRoute: CalculatedRoute}) => void,
  depsMemo?: Accessor<any>
  children?: JSX.Element,
}) => {

  const router = useRouter()
  const parent = useRoutesLegacy()
  const parentRoute = createMemo<CalculatedRoute|null>(() => (parent?.route ? parent.route() : null))
  
  const createPattern = (route: Route): PatternedRoute => {
    let prefix = (parentRoute() && !route.full && parentRoute()?.patternPrefix !== undefined ? parentRoute().patternPrefix : '')
    return {
      ...route,
      pattern: prefix + route.path,
      parent: parentRoute(),
    }
  }
  
  const matchRoute = (
    route: PatternedRoute,
    matchPath_: (pattern: string, path: string) => Match = matchPath,
  ) => (route && route.pattern ? matchPath_(route.pattern, router.pathname()) : false)
  
  const c = childrenSolid(() => children)
  const routesRaw: Accessor<Array<Route>> = createMemo(() => normalizeChildren(c()))
  
  const calculateRoute = (...deps): CalculatedRoute|null => {
    let routes = routesRaw().map((r, i) => ({i, ...r})).filter(r => r._isRoute).map(r => createPattern(r))
    let fallbackRoute: MatchedRoute
    let firstMatchRoute: MatchedRoute
    let r = routes.map((route) => {
      let match: Match = matchRoute(route)
      let newRoute: MatchedRoute = {
        ...route,
        match,
        matchParams: (match ? match[1] : route.fallbackParams),
        firstMatch: match && !firstMatchRoute
      }
      if (newRoute.firstMatch) {
        firstMatchRoute = newRoute
      }
      if (!fallbackRoute && route.fallback) {
        fallbackRoute = newRoute
      }
      return newRoute
    })
    console.log(r)

    let activeRoute: MatchedRoute = (firstMatchRoute ?? fallbackRoute)
    if (!activeRoute) {
      return null
    }

    let patternPrefix = '' + (parentRoute()?.patternPrefix ?? '')
    let linkPrefix = '' + (parentRoute()?.linkPrefix ?? '')
    if (activeRoute.match && activeRoute.matchParams) {
      let path = activeRoute.match[0]
      // TODO: match forwarding
      patternPrefix = '' + (activeRoute.path ?? '')
      // TODO: suffix link prefix
      // const suffix = match['__suffix']
      // if (typeof suffix === 'string') {
      //   activeRoute.linkPrefix = path.substring(
      //     0,
      //     path.length - suffix.length,
      //   )
      // }
    }

    return {
      ...activeRoute,
      patternPrefix,
      linkPrefix
    }
  }
  
  const [route, setRoute] = createSignal<CalculatedRoute|null>(null)
  const [mounted, setMounted] = createSignal(false)
  
  onMount(() => {
    setMounted(true)
  })
  
  createEffect(() => {
    let newRoute = calculateRoute(routesRaw(), parentRoute(), router.pathname())
    let notSame = (
      (newRoute?.pattern !== route()?.pattern)
      || !isDictsSame(newRoute?.matchParams, route()?.matchParams)
    )
    if (mounted() && notSame) {
      setRoute(newRoute)
    }
  })
  
  onCleanup(() => {
    setMounted(false)
  })
  
  createEffect(() => {
    if (typeof onRoute === 'function') {
      onRoute({route: route(), parentRoute: parentRoute()})
    }
  })
  
  const context = {
    route
  }
  
  const DefaultComponent = (props) => {
    

  }
  
  const Children = ({
    route,
    fallback = false
  } : {
    route: Accessor<CalculatedRoute|null>,
    fallback: any,
  }) => {

    const children = createMemo(() => {

      if (route()) {
        let {match, matchParams, others, depsMemo: rDepsMemo} = route()
        if (rDepsMemo) {
          let x = rDepsMemo()
        }
        if (depsMemo) {
          let x = depsMemo()
        }
        let routeChildren = others.children
        if (Object.keys(matchParams).length && typeof routeChildren === 'function') {
          return routeChildren(matchParams)
        } else {
          return routeChildren
        }
      } else {
        return fallback
      }

    })

    return (<>{children()}</>)

  }

  return (
    <RoutesLegacy.Provider value={context} children={(
      <Children
        route={route}
        fallback={fallback ?? null}
      />
    )}/>
  )
}