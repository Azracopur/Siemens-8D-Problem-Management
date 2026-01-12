/*
 * SPDX-FileCopyrightText: 2024 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const addDisposableEventListener = (element, eventType, callback) => {
    element.addEventListener(eventType, callback);
    return () => {
        element.removeEventListener(eventType, callback);
    };
};
const addDisposableEventListenerAsArray = (listener) => {
    const disposables = listener.map(({ callback, element, eventType }) => addDisposableEventListener(element, eventType, callback));
    return () => disposables.forEach((dispose) => dispose());
};

export { addDisposableEventListener as a, addDisposableEventListenerAsArray as b };
//# sourceMappingURL=disposable-event-listener-CKoABG1h.js.map

//# sourceMappingURL=disposable-event-listener-CKoABG1h.js.map