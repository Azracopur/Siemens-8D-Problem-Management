function makeRef(currentChangedCallback) {
    let resolve = undefined;
    let currentPromise = new Promise((res) => (resolve = res));
    let current = undefined;
    const setRefFunction = (ref) => {
        if (ref === undefined) {
            return;
        }
        current = setRefFunction.current = ref;
        currentChangedCallback === null || currentChangedCallback === void 0 ? void 0 : currentChangedCallback(ref);
        resolve === null || resolve === void 0 ? void 0 : resolve(ref);
    };
    setRefFunction.current = current;
    setRefFunction.waitForCurrent = async () => {
        await currentPromise;
        return current;
    };
    return setRefFunction;
}

export { makeRef as m };
//# sourceMappingURL=make-ref-bcj7UEIC.js.map

//# sourceMappingURL=make-ref-bcj7UEIC.js.map