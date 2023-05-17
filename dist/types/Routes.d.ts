import { Accessor } from "solid-js";
import { Route } from "./Route";
import { JSX } from "solid-js/types/jsx";
import { Dictionary } from "./types";
declare type Match = [string, Dictionary<string>] | false;
declare type PatternedRoute = Route & {
    pattern: string;
    parent?: Route;
};
declare type MatchedRoute = PatternedRoute & {
    match: Match;
    matchParams: Dictionary<string>;
    firstMatch: boolean;
};
declare type CalculatedRoute = MatchedRoute & {
    patternPrefix: string;
    linkPrefix: string;
};
export declare const createMatcher: (path: string, end?: boolean) => (pathToCheck: string) => [string, Dictionary<string>] | false;
export declare const matchPath: (pattern: string, path: string) => Match;
export declare function Routes({ fallback, onRoute, depsMemo, children, }: {
    fallback?: any;
    onRoute?: ({ route, parentRoute }: {
        route?: CalculatedRoute;
        parentRoute: CalculatedRoute;
    }) => void;
    depsMemo?: Accessor<any>;
    children?: JSX.Element;
}): JSX.Element;
export {};
