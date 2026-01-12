import type { Components, JSX } from "../dist/types/components";

interface IxInput extends Components.IxInput, HTMLElement {}
export const IxInput: {
    prototype: IxInput;
    new (): IxInput;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
