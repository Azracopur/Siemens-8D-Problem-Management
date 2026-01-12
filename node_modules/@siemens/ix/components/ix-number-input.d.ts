import type { Components, JSX } from "../dist/types/components";

interface IxNumberInput extends Components.IxNumberInput, HTMLElement {}
export const IxNumberInput: {
    prototype: IxNumberInput;
    new (): IxNumberInput;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
