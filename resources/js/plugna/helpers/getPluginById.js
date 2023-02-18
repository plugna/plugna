const getPluginById = (plugins, id) => {
        return plugins
            .filter(plugin => {
                return plugin.plugin == id
            })[0];
}

export default getPluginById;