import type { Components, JSX } from "../dist/types/components";

interface IxCheckbox extends Components.IxCheckbox, HTMLElement {}
export const IxCheckbox: {
    prototype: IxCheckbox;
    new (): IxCheckbox;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
