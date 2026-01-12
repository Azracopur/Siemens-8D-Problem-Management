import type { Components, JSX } from "../dist/types/components";

interface IxCustomField extends Components.IxCustomField, HTMLElement {}
export const IxCustomField: {
    prototype: IxCustomField;
    new (): IxCustomField;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
