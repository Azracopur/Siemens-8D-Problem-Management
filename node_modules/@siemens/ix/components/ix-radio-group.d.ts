import type { Components, JSX } from "../dist/types/components";

interface IxRadioGroup extends Components.IxRadioGroup, HTMLElement {}
export const IxRadioGroup: {
    prototype: IxRadioGroup;
    new (): IxRadioGroup;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
