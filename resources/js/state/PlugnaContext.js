const PlugnaContext = wp.element.createContext();

export function usePlugnaContext() {
    return React.useContext(PlugnaContext);
}

export default PlugnaContext;