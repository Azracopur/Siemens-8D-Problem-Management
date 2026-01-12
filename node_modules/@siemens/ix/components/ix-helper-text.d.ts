import type { Components, JSX } from "../dist/types/components";

interface IxHelperText extends Components.IxHelperText, HTMLElement {}
export const IxHelperText: {
    prototype: IxHelperText;
    new (): IxHelperText;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
