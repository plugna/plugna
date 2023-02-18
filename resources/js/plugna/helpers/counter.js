const selected = (plugins) => {
    return plugins.filter(plugin => plugin.selected).length;
}

const active = (plugins) => {
    return plugins.filter(plugin => plugin.active).length;
}

const inactive = (plugins) => {
    return plugins.filter(plugin => plugin.inactive).length;
}

const updatable = (plugins) => {
    return plugins.filter(plugin => plugin.updateAvailable).length;
}

const autoupdates = (plugins) => {
    return plugins.filter(plugin => plugin.autoUpdatesEnabled).length;
}

const autoupdatesoff = (plugins) => {
    return plugins.filter(plugin => !plugin.autoUpdatesEnabled).length;
}

export default {
    selected,
    active,
    inactive,
    updatable,
    autoupdates,
    autoupdatesoff
};

