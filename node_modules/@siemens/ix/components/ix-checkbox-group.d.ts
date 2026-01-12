import type { Components, JSX } from "../dist/types/components";

interface IxCheckboxGroup extends Components.IxCheckboxGroup, HTMLElement {}
export const IxCheckboxGroup: {
    prototype: IxCheckboxGroup;
    new (): IxCheckboxGroup;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
