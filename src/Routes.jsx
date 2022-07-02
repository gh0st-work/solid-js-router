import {
  children as childrenSolid,
  createContext,
  createEffect,
  createMemo,
  useContext,
  createSignal,
  onMount,
  onCleanup,
} from "solid-js";
import {Dynamic} from 'solid-js/web';
import {normalizeChildren} from "./utils";
import {useRouter} from "./Router";
import {parse} from "regexparam";

const RoutesLegacy = createContext({})
const useRoutesLegacy = () => useContext(RoutesLegacy)


const _pathMatchers = {}
export const createMatcher = (
  path,
  end,
) => {
  const { keys, pattern } = parse(path, !end)
  return (p) => {
    const matches = pattern.exec(p)
    if (!matches) {
      return null
    }
    const params = keys.reduce((acc, _, i) => {
      acc[keys[i]] = matches[i + 1];
      return acc;
    }, {})
    return [matches[0] || '/', params]
  }
}
export const matchPath = (pattern, path) => {
  if (path === undefined) {
    return false
  } else if (_pathMatchers[pattern] === undefined) {
    _pathMatchers[pattern] = createMatcher(pattern)
  }
  return _pathMatchers[pattern](path)
}




export const Routes = (props) => {
  const router = useRouter()
  const parent = useRoutesLegacy()
  const parentRoute = createMemo(() => (parent?.route ? parent.route() : null))
  
  const createPattern = (route) => {
    let prefix = (parentRoute() && !route.full && parentRoute()?.patternPrefix !== undefined ? parentRoute().patternPrefix : '')
    if (parentRoute()) {
      route.parent = parentRoute()
    }
    if (route.path) {
      // TODO: suffix add
      // let suffix = '/__suffix*'
      // route.pattern = prefix + route.path + (route.prefix ? suffix : '')
      route.pattern = prefix + route.path
    }
    return route
  }
  
  const matchRoute = (
    route,
    matchPath_ = matchPath,
  ) => (route && route.pattern ? matchPath_(route.pattern, router.pathname()) : false)
  
  const c = childrenSolid(() => props.children)
  const children = createMemo(() => normalizeChildren(c()))
  
  const calculateRoute = () => {
    let routes = children().map((r, i) => ({i, ...r})).filter(r => r._isRoute).map(r => createPattern(r))
    let fallbackRoute = routes.find(r => r.fallback)
    let firstMatchRoute = null
    routes.map((route, i) => {
      if (route._isRoute) {
        route.match = matchRoute(route)
        route.firstMatch = (route.match && !firstMatchRoute ? route.match : false)
        if (route.firstMatch) {
          firstMatchRoute = route
        }
      }
      return route
    })
    let activeRoute = (firstMatchRoute ?? fallbackRoute)
    if (activeRoute) {
      activeRoute.patternPrefix  = '' + (parentRoute()?.patternPrefix ?? '')
      activeRoute.linkPrefix = '' + (parentRoute()?.linkPrefix ?? '')
      if (activeRoute.match && activeRoute.match[1]) {
        let path = activeRoute.match[0]
        let match = activeRoute.match[1]
        // TODO: match forwarding
        activeRoute.patternPrefix = '' + (activeRoute.path ?? '')
        // TODO: suffix link prefix
        // const suffix = match['__suffix']
        // if (typeof suffix === 'string') {
        //   activeRoute.linkPrefix = path.substring(
        //     0,
        //     path.length - suffix.length,
        //   )
        // }
      }
    }
    return activeRoute
  }
  
  const [route, setRoute] = createSignal(null)
  const [mounted, setMounted] = createSignal(false)
  
  onMount(() => {
    setMounted(true)
  })
  
  createEffect(() => {
    let newRoute = calculateRoute(children(), parentRoute(), router.pathname())
    if (mounted() && newRoute !== route()) {
      setRoute(newRoute)
    }
  })
  
  onCleanup(() => {
    setMounted(false)
  })
  
  createEffect(() => {
    if (typeof props.onRoute === 'function') {
      props.onRoute({route: route(), parentRoute: parentRoute()})
    }
  })
  
  const context = {
    route
  }
  
  const DefaultComponent = (props) => (<>{props.children}</>)
  
  return (
    <RoutesLegacy.Provider value={context}>
      <Dynamic component={DefaultComponent}>
        {route() ? (<>{route().others.children}</>) : (props.fallback ?? null)}
      </Dynamic>
    </RoutesLegacy.Provider>
  )
}