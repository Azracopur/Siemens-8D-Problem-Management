import type { Components, JSX } from "../dist/types/components";

interface IxFieldWrapper extends Components.IxFieldWrapper, HTMLElement {}
export const IxFieldWrapper: {
    prototype: IxFieldWrapper;
    new (): IxFieldWrapper;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
