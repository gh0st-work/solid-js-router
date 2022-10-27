import { Accessor, ParentComponent } from "solid-js";
export interface LinkProps {
    href?: string;
    hrefMemo?: Accessor<string | null>;
    beforeRedirect: ({ href, e }: {
        href: string;
        e: any;
    }) => void;
    afterRedirect: ({ href, e }: {
        href: string;
        e: any;
    }) => void;
}
export declare const Link: ParentComponent<LinkProps>;
