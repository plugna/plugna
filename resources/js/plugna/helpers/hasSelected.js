const hasSelected = (plugins) => {
    return plugins.filter(plugin => plugin.selected).length > 0;
}

export default hasSelected;