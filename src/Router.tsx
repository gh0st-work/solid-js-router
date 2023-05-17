import {BrowserHistory, createBrowserHistory, Location} from "history";
import {
  createContext,
  createMemo,
  createSignal,
  useContext,
  onCleanup, Accessor, Setter, ParentProps
} from "solid-js";
import {invariant} from "./utils";
import {JSX} from "solid-js/types/jsx";

interface RouterValue extends BrowserHistory {
  pathname: Accessor<string>,
  setPathname: Setter<string>,
}

export const RouterContext = createContext<RouterValue>()
export const useRouter = (): RouterValue => invariant(useContext(RouterContext), 'Wrap your app in one instance of <Router>')
export const useHistory = useRouter
export const useLocation = (): Location => (useHistory().location)

interface RouterProps extends ParentProps {
  history?: BrowserHistory
}

export function Router(props: RouterProps): JSX.Element {
  const history = props.history ?? createBrowserHistory()
  const [pathname, setPathname] = createSignal<string>(history.location.pathname)

  const cleanupHandler = history.listen(({location: {pathname}}) => {
    setPathname(pathname)
  })
  onCleanup(() => cleanupHandler())
  
  const routerContext = createMemo<RouterValue>(() => ({
    ...history,
    pathname,
    setPathname,
  }))
  
  return (
    <RouterContext.Provider value={routerContext()} children={props.children}/>
  )
}