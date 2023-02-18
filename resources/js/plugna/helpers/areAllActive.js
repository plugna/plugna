const areAllActive = (plugins, actions) => {
    if (actions.type === 'select') {
        return plugins.filter(plugin => plugin.inactive && plugin.selected).length === 0;
    }
    return plugins.filter(plugin => plugin.inactive).length === 0;
}

export default areAllActive;