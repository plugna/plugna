const areAllInactive = (plugins, actions) => {
    if (actions.type === 'select') {
        return plugins.filter(plugin => plugin.active && plugin.selected).length === 0;
    }
    return plugins.filter(plugin => plugin.active).length === 0;
}

export default areAllInactive;