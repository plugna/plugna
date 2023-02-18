const hasInstallingOrActivatingPlugins = (plugins, hasAlsoInstalled) => {
    return plugins.filter(plugin =>
        plugin.installing ||
        plugin.activating ||
        (hasAlsoInstalled ? plugin.installed : false)
    ).length > 0;
}

export default hasInstallingOrActivatingPlugins;