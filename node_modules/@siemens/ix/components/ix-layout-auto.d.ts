import type { Components, JSX } from "../dist/types/components";

interface IxLayoutAuto extends Components.IxLayoutAuto, HTMLElement {}
export const IxLayoutAuto: {
    prototype: IxLayoutAuto;
    new (): IxLayoutAuto;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
