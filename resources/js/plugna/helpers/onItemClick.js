import {pluginsActions} from "../../actions/plugins";
import isPluginVisible from "../helpers/isPluginVisible";

const onItemClick = (plugin, parent) => {
    //SELECT MODE
    plugin.selected = !plugin.selected;
    parent.setPlugins({type: 'update-plugin', payload: plugin});
};

export default onItemClick;