import isPluginVisible from "./isPluginVisible";

const hasVisiblePlugins = (plugins, actions, filters) => {
    // Check if search matches plugin name
    return plugins.filter(plugin => isPluginVisible(plugin, actions, filters)).length === 0 ? false : true;
};

export default hasVisiblePlugins;
