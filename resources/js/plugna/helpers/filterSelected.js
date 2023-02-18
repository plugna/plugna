const filterSelected = (plugins, basicProperties = true) => {
    if(!basicProperties){
        return plugins.filter(plugin => plugin.selected);
    }
        return plugins
            .filter(plugin => plugin.selected)
            .map(obj => ({
                    plugin: obj.plugin,
                    name: obj.name
            }));
}

export default filterSelected;