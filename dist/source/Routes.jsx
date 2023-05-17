import { children as childrenSolid, createContext, createEffect, createMemo, createSignal, onCleanup, onMount, useContext, } from "solid-js";
import { isDictsSame, normalizeChildren } from "./utils";
import { useRouter } from "./Router";
import { parse } from "regexparam";
const RoutesLegacy = createContext({});
const useRoutesLegacy = () => useContext(RoutesLegacy);
const _pathMatchers = {};
export const createMatcher = (path, end = false) => {
    const { keys, pattern } = parse(path, !end);
    return (pathToCheck) => {
        const matches = pattern.exec(pathToCheck);
        if (!matches) {
            return false;
        }
        const params = keys.reduce((acc, _, i) => {
            acc[keys[i]] = matches[i + 1];
            return acc;
        }, {});
        return [matches[0] || '/', params];
    };
};
export const matchPath = (pattern, path) => {
    if (path === undefined) {
        return false;
    }
    else if (_pathMatchers[pattern] === undefined) {
        _pathMatchers[pattern] = createMatcher(pattern);
    }
    return _pathMatchers[pattern](path);
};
export function Routes({ fallback = null, onRoute = () => null, depsMemo = () => null, children, }) {
    const router = useRouter();
    const parent = useRoutesLegacy();
    const parentRoute = createMemo(() => (parent?.route ? parent.route() : null));
    const createPattern = (route) => {
        let prefix = (parentRoute() && !route.full && parentRoute()?.patternPrefix !== undefined ? parentRoute().patternPrefix : '');
        return {
            ...route,
            pattern: prefix + route.path,
            parent: parentRoute(),
        };
    };
    const matchRoute = (route, matchPath_ = matchPath) => (route && route.pattern ? matchPath_(route.pattern, router.pathname()) : false);
    const c = childrenSolid(() => children);
    const routesRaw = createMemo(() => normalizeChildren(c()));
    const calculateRoute = (...deps) => {
        let routes = routesRaw().map((r, i) => ({ i, ...r })).filter(r => r._isRoute).map(r => createPattern(r));
        let fallbackRoute;
        let firstMatchRoute;
        let r = routes.map((route) => {
            let match = matchRoute(route);
            let newRoute = {
                ...route,
                match,
                matchParams: (match ? match[1] : route.fallbackParams),
                firstMatch: match && !firstMatchRoute
            };
            if (newRoute.firstMatch) {
                firstMatchRoute = newRoute;
            }
            if (!fallbackRoute && route.fallback) {
                fallbackRoute = newRoute;
            }
            return newRoute;
        });
        let activeRoute = (firstMatchRoute ?? fallbackRoute);
        if (!activeRoute) {
            return null;
        }
        let patternPrefix = '' + (parentRoute()?.patternPrefix ?? '');
        let linkPrefix = '' + (parentRoute()?.linkPrefix ?? '');
        if (activeRoute.match && activeRoute.matchParams) {
            let path = activeRoute.match[0];
            // TODO: match forwarding
            patternPrefix = '' + (activeRoute.path ?? '');
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
        };
    };
    const [route, setRoute] = createSignal(null, {
        equals: (prev, next) => ((next?.pattern === prev?.pattern) && isDictsSame(next?.matchParams, prev?.matchParams))
    });
    const [mounted, setMounted] = createSignal(false, { equals: (prev, next) => prev === next });
    onMount(() => {
        setMounted(true);
    });
    createEffect(() => {
        let newRoute = calculateRoute(routesRaw(), parentRoute(), router.pathname());
        if (mounted()) {
            setRoute(newRoute);
        }
    });
    onCleanup(() => {
        setMounted(false);
    });
    createEffect(() => {
        if (typeof onRoute === 'function') {
            onRoute({ route: route(), parentRoute: parentRoute() });
        }
    });
    const context = {
        route
    };
    const Children = ({ route, fallback = false }) => {
        const children = createMemo(() => {
            if (route()) {
                let { match, matchParams, others, depsMemo: rDepsMemo } = route();
                if (rDepsMemo) {
                    let x = rDepsMemo();
                }
                if (depsMemo) {
                    let x = depsMemo();
                }
                let routeChildren = others.children;
                if (matchParams && Object.keys(matchParams).length && typeof routeChildren === 'function') {
                    return routeChildren(matchParams);
                }
                else {
                    return routeChildren;
                }
            }
            else {
                return fallback;
            }
        });
        return (<>{children()}</>);
    };
    return (<RoutesLegacy.Provider value={context} children={(<Children route={route} fallback={fallback ?? null}/>)}/>);
}
