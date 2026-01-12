import { T as TypedEvent } from './typed-event-BdCnOrqW.js';

/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m")
        throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _MenuService_menuElement, _MenuService_menuExpandChange, _MenuService_isPinned;
class MenuService {
    constructor() {
        _MenuService_menuElement.set(this, null);
        _MenuService_menuExpandChange.set(this, new TypedEvent());
        _MenuService_isPinned.set(this, false);
    }
    register(menuElement) {
        if (__classPrivateFieldGet(this, _MenuService_menuElement, "f")) {
            console.warn('Menu already defined');
            return;
        }
        __classPrivateFieldSet(this, _MenuService_menuElement, menuElement, "f");
        __classPrivateFieldGet(this, _MenuService_menuElement, "f").addEventListener('expandChange', (event) => {
            __classPrivateFieldGet(this, _MenuService_menuExpandChange, "f").emit(event.detail);
        });
    }
    setIsPinned(pinned) {
        __classPrivateFieldSet(this, _MenuService_isPinned, pinned, "f");
    }
    async open() {
        if (__classPrivateFieldGet(this, _MenuService_menuElement, "f")) {
            __classPrivateFieldGet(this, _MenuService_menuElement, "f").toggleMenu(true);
            return true;
        }
        return false;
    }
    async close() {
        if (__classPrivateFieldGet(this, _MenuService_menuElement, "f")) {
            __classPrivateFieldGet(this, _MenuService_menuElement, "f").toggleMenu(false);
            return true;
        }
        return false;
    }
    async toggle() {
        if (__classPrivateFieldGet(this, _MenuService_menuElement, "f")) {
            __classPrivateFieldGet(this, _MenuService_menuElement, "f").toggleMenu();
            return true;
        }
        return false;
    }
    get nativeElement() {
        return __classPrivateFieldGet(this, _MenuService_menuElement, "f");
    }
    get expandChange() {
        return __classPrivateFieldGet(this, _MenuService_menuExpandChange, "f");
    }
    get isPinned() {
        return __classPrivateFieldGet(this, _MenuService_isPinned, "f");
    }
}
_MenuService_menuElement = new WeakMap(), _MenuService_menuExpandChange = new WeakMap(), _MenuService_isPinned = new WeakMap();
const menuController = new MenuService();

export { menuController as m };
//# sourceMappingURL=menu-service-BMvtckRa.js.map

//# sourceMappingURL=menu-service-BMvtckRa.js.map