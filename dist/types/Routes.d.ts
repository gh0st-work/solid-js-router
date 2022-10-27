import { Component } from "solid-js";
import { Dictionary } from "./types";
declare type Match = [string, Dictionary<string>] | false;
export declare const createMatcher: (path: string, end?: boolean) => (pathToCheck: string) => [string, Dictionary<string>] | false;
export declare const matchPath: (pattern: string, path: string) => Match;
export declare const Routes: Component;
export {};
