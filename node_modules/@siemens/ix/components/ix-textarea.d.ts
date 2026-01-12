import type { Components, JSX } from "../dist/types/components";

interface IxTextarea extends Components.IxTextarea, HTMLElement {}
export const IxTextarea: {
    prototype: IxTextarea;
    new (): IxTextarea;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
