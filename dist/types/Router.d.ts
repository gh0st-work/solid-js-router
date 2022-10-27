import { BrowserHistory, Location } from "history";
import { Accessor, Setter, ParentProps, Component } from "solid-js";
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
export declare const Router: Component<RouterProps>;
export {};
