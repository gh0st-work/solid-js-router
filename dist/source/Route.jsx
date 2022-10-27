import { splitProps } from "solid-js";
export const Route = (props) => {
    const [local, others] = splitProps(props, ['fallback', 'path', 'depsMemo', 'full', 'fallbackParams']);
    const nullDepsMemp = (() => null);
    return ({
        _isRoute: true,
        path: local.path,
        depsMemo: local.depsMemo ?? nullDepsMemp,
        fallback: !!local.fallback,
        fallbackParams: local.fallbackParams ?? {},
        full: !!local.full,
        others
    });
};
