import type { Components, JSX } from "../dist/types/components";

interface IxFieldLabel extends Components.IxFieldLabel, HTMLElement {}
export const IxFieldLabel: {
    prototype: IxFieldLabel;
    new (): IxFieldLabel;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
