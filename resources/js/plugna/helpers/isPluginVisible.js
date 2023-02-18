const isPluginVisible = (plugin, actions, filters) => {
    // Check if search matches plugin name
    if (actions.search && !plugin.name.toLowerCase().includes(actions.search.toLowerCase())) {
        return false;
    }

    // Check selected filter
    switch (actions.selected) {
        case 'toggle':
            return filters.toggle === 'toggle-toggle' ||
                (filters.toggle === 'toggle-deactivate' && plugin.active) ||
                (filters.toggle === 'toggle-activate' && !plugin.active);
        case 'delete':
            return filters.delete === 'delete-any' ||
                (filters.delete === 'delete-active' && plugin.active) ||
                (filters.delete === 'delete-inactive' && !plugin.active);
        case 'update':
            return filters.update === 'update-any' ||
                (
                    filters.update === 'update-available' &&
                    plugin.updateSupported &&
                    plugin.updateAvailable
                );
        case 'au':
            return !plugin.updateSupported ? false : (
                filters.au === 'au-toggle' ||
                (filters.au === 'au-on' && plugin.autoUpdatesEnabled) ||
                (filters.au === 'au-off' && !plugin.autoUpdatesEnabled)
            );
        default:
            return true;
    }
};

export default isPluginVisible;
