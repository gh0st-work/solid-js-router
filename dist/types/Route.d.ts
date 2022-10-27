import { Accessor, Component } from "solid-js";
import { JSX } from "solid-js/types/jsx";
import { Dictionary } from "./types";
export interface RouteProps {
    path: string;
    full?: boolean;
    fallback?: boolean;
    fallbackParams?: Dictionary<string>;
    depsMemo?: Accessor<any>;
    children?: JSX.Element | Component<Dictionary<string>>;
}
export declare type Route = {
    path: string;
    full: boolean;
    fallback: Dictionary<string> | boolean;
    fallbackParams: Dictionary<string>;
    depsMemo: Accessor<any>;
    _isRoute: true;
    others: Omit<RouteProps, "fallback" | "path" | "depsMemo">;
};
export declare const Route: (props: RouteProps) => Route;
