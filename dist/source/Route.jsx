import { splitProps } from "solid-js";
export const Route = (props = {
    path: '',
    depsMemo: (() => null),
    fallback: false,
    fallbackParams: {},
    full: false
}) => {
    const [local, others] = splitProps(props, ['fallback', 'path', 'depsMemo', 'full', 'fallbackParams']);
    const route = {
        _isRoute: true,
        path: local.path,
        depsMemo: local.depsMemo,
        fallback: !!local.fallback,
        fallbackParams: local.fallbackParams,
        full: !!local.full,
        others
    };
    return route;
};
