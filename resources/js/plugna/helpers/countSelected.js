const countSelected = (plugins) => {
    return plugins.filter(plugin => plugin.selected).length;
}

export default countSelected;