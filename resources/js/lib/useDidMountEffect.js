const useDidMountEffect = (func, deps) => {
    const didMount =  wp.element.useRef(false);

    wp.element.useEffect(() => {
        if (didMount.current) func();
        else didMount.current = true;
    }, deps);
}

export default useDidMountEffect;