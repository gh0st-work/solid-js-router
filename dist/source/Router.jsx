import { createBrowserHistory } from "history";
import { createContext, createMemo, createSignal, useContext, onCleanup } from "solid-js";
import { invariant } from "./utils";
export const RouterContext = createContext();
export const useRouter = () => invariant(useContext(RouterContext), 'Wrap your app in one instance of <Router>');
export const useHistory = useRouter;
export const useLocation = () => (useHistory().location);
export function Router(props) {
    const history = props.history ?? createBrowserHistory();
    const [pathname, setPathname] = createSignal(history.location.pathname);
    const cleanupHandler = history.listen(({ location: { pathname } }) => {
        setPathname(pathname);
    });
    onCleanup(() => cleanupHandler());
    const routerContext = createMemo(() => ({
        ...history,
        pathname,
        setPathname,
    }));
    return (<RouterContext.Provider value={routerContext()} children={props.children}/>);
}
