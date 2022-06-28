import {createBrowserHistory} from "history";
import {
  createContext,
  createMemo,
  createSignal,
  useContext,
  onCleanup
} from "solid-js";
import {invariant} from "./utils";

export const RouterContext = createContext(null)
export const useRouter = () => invariant(useContext(RouterContext), 'Wrap your app in one instance of Router')
export const useHistory = useRouter
export const useLocation = () => (useHistory().location)


export const Router = (props) => {
  const history = props.history ?? createBrowserHistory()
  const [pathname, setPathname] = createSignal(history.location.pathname)
  const [routesPassed, setRoutesPassed] = createSignal([])

  const cleanupHandler = history.listen(({action, location}) => {
    setPathname(location.pathname)
  })
  onCleanup(() => cleanupHandler())
  
  const routerContext = createMemo(() => ({
    ...history,
    pathname,
    setPathname,
    routesPassed,
    setRoutesPassed,
  }))
  
  return (
    <RouterContext.Provider value={routerContext()}>
      {props.children}
    </RouterContext.Provider>
  )
}