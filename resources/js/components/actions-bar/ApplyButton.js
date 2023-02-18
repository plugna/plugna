import CButton from "../CButton";
import DashIcon from "../DashIcon";
import {usePlugnaContext} from "../../state/PlugnaContext";
import hasSelected from "../../plugna/helpers/hasSelected";
import countSelected from "../../plugna/helpers/countSelected";
import filterSelected from "../../plugna/helpers/filterSelected";
import getPluginById from "../../plugna/helpers/getPluginById";

import Client from "../../Client";

function ApplyButton(props) {
    const { plugins, setPlugins, actions, filters } = usePlugnaContext();

    if(!hasSelected(plugins)) {
        return <></>
    }

    const buttonName = ()=>{
        const filter = filters[actions.selected];
        const selected = countSelected(plugins);
        const pluginsStr = selected > 1 ? 'plugins' : 'plugin';

        switch (filter) {
            case 'toggle-toggle':
                return `Toggle activation of ${selected} ${pluginsStr}`;
            case 'toggle-deactivate':
                return `Deactivate ${selected} ${pluginsStr}`;
            case 'toggle-activate':
                return `Activate ${selected} ${pluginsStr}`;
            case 'delete-any':
                return `Delete ${selected} ${pluginsStr}`;
            case 'delete-active':
                return `Delete ${selected} active ${pluginsStr}`;
            case 'delete-inactive':
                return `Delete ${selected} inactive ${pluginsStr}`;
            case 'update-available':
                return `Update ${selected} ${pluginsStr} with available updates`;
            case 'update-any':
                return `Update ${selected} ${pluginsStr}`;
            case 'au-toggle':
                return `Change auto-update setting on ${selected} ${pluginsStr}`;
            case 'au-off':
                return `Enable auto-updates for ${selected} ${pluginsStr}`;
            case 'au-on':
                return `Disable auto-updates for ${selected} ${pluginsStr}`;

        }
        return 'Apply';
    }

    const handleCallback = (r, updateObject = false) => {
        if(r.success){
            Object.keys(r.message).map(id => {
                let plugin = getPluginById(plugins, id);

                if(updateObject) { //update
                    plugin = updateObject(plugin);
                }

                plugin.hideAnimation = true;
                plugin.selected = false;
                setPlugins({type: 'update-plugin', payload: plugin});

                setTimeout(() => {
                    plugin.hideAnimation = false;
                    if(updateObject){
                        setPlugins({type: 'update-plugin', payload: plugin});
                    }else {
                        setPlugins({type: 'delete-plugin', payload: plugin});
                    }

                }, 1500);
            })
        }
    }
    return (
        <CButton
            onClick={(e)=>{
                e.preventDefault();
                const selectedPlugins = filterSelected(plugins)

                setPlugins({type: 'activate-plugins-loader', payload: selectedPlugins});

                switch (actions.selected){
                    case 'toggle':
                        Client
                            .togglePlugins(selectedPlugins)
                            .then(r => handleCallback(r, (plugin)=>{
                                return {...plugin, active: !plugin.active};
                            }))
                        break;
                    case 'au':
                        Client
                            .toggleAutoUpdatesOnPlugins(selectedPlugins)
                            .then(r => handleCallback(r, (plugin)=>{
                                return {...plugin, autoUpdatesEnabled: !plugin.autoUpdatesEnabled};
                            }))
                        break;
                    case 'update':
                        Client
                            .updatePlugins(selectedPlugins)
                            .then(r =>{
                                //TODO: Find common solution for this and fix it in Client
                                const data = JSON.parse(r.split('|')[r.split('|').length - 1]).data;
                                return JSON.parse(data);
                            })
                            .then(r => handleCallback(r, (plugin)=>{
                                return {...plugin, updateAvailable: false};
                            }))
                        break;
                    case 'delete':
                        Client
                            .deletePlugins(selectedPlugins)
                            .then(r => handleCallback(r))
                        break;
                }
            }}
            classes={"button-apply"}
        >
            <DashIcon icon={"saved"} style={{transform: 'scale(1.5)'}}/>
            <span className={"desktop-text"}>{buttonName()}</span>
            <span className={"mobile-text"}>Apply</span>
        </CButton>
    )
}
export default ApplyButton;