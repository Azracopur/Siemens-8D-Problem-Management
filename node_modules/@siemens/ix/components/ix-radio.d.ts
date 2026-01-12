import type { Components, JSX } from "../dist/types/components";

interface IxRadio extends Components.IxRadio, HTMLElement {}
export const IxRadio: {
    prototype: IxRadio;
    new (): IxRadio;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
