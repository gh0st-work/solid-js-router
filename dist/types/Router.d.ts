import { BrowserHistory, Location } from "history";
import { Accessor, Setter, ParentProps } from "solid-js";
import { JSX } from "solid-js/types/jsx";
interface RouterValue extends BrowserHistory {
    pathname: Accessor<string>;
    setPathname: Setter<string>;
}
export declare const RouterContext: import("solid-js").Context<RouterValue>;
export declare const useRouter: () => RouterValue;
export declare const useHistory: () => RouterValue;
export declare const useLocation: () => Location;
interface RouterProps extends ParentProps {
    history?: BrowserHistory;
}
export declare function Router(props: RouterProps): JSX.Element;
export {};
