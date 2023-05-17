import { Accessor, ParentProps } from "solid-js";
import { JSX } from "solid-js/types/jsx";
export declare function Link(props: ParentProps<{
    href?: string;
    hrefMemo?: Accessor<string | null>;
    beforeRedirect?: ({ href, e }: {
        href: string;
        e: any;
    }) => void;
    afterRedirect?: ({ href, e }: {
        href: string;
        e: any;
    }) => void;
    [key: string]: any;
}>): JSX.Element;
