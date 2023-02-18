import ActionsBar from './components/actions-bar/ActionsBar';
import Loader from './image/Loader';

import {pluginsActions} from "./actions/plugins";
import {usePlugnaContext} from "./state/PlugnaContext";
import Notifications from "./components/Notifications";
import Popups from "./components/popup/Popups";
import Badges from "./plugna/Badges";
import Version from "./plugna/Version";
import DashIcon from "./components/DashIcon";

import onItemClick from "./plugna/helpers/onItemClick";

import isPluginVisible  from "./plugna/helpers/isPluginVisible";
import NewPlugin from "./components/new-plugin/NewPlugin";
import classNames from "classnames";
import {act} from "react-dom/test-utils";
import ApplyButton from "./components/actions-bar/ApplyButton";
import CancelButton from "./components/actions-bar/CancelButton";
import hasSelected from "./plugna/helpers/hasSelected";
import StatsBar from "./components/actions-bar/StatsBar";
import MasterActions from "./components/actions-bar/MasterActions";
import hasVisiblePlugins from "./plugna/helpers/hasVisiblePlugins";

function Plugna() {

    const { settings } = usePlugnaContext();
    const { actions } = usePlugnaContext();
    const { filters } = usePlugnaContext();
    const { plugins, setPlugins } = usePlugnaContext();
    const { notify, popup, setPopups, noop, newPlugin } = usePlugnaContext();

    const [error, setError] = wp.element.useState(null);
    const [isLoaded, setIsLoaded] = wp.element.useState(false);

    wp.element.useEffect(() => {
        plugins.length && setIsLoaded(true);
        setPlugins(plugins);
    }, [plugins]);

    wp.element.useEffect(() => {
        pluginsActions({type: 'load'}, (plugins) => {
            setPlugins({type: 'load', payload: plugins});
        });
        if(!settings.hideWelcome){
            window.onload = function () {
                setTimeout(() => {
                    popup.welcome();
                }, 500);
            }
        }
    }, [])

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded && false) {
        return <div className={"main-loader"}>Loading <Loader/></div>;
    } else {
        return (
            <div>
                <Notifications />
                <Popups />
                <div className="metabox-holder">
                    <ActionsBar
                        actions={actions}
                        filters={filters}
                        updateActions={updatedActions => {
                            if (updatedActions.button && updatedActions.button === 'clear') {
                                plugins.map(plugin => {
                                    plugin.selected = '';
                                    setPlugins({type: 'update-plugin', payload: plugin});
                                });
                            }
                        }
                        }/>
                </div>
                <NewPlugin />
                <MasterActions top />
                <div className={
                    classNames(
                        "metabox-holder plugins-list main-list",
                        {hidden: newPlugin.show},
                        `type-${actions.type}`
                    )
                }>
                    {plugins.length ? !hasVisiblePlugins(plugins, actions, filters) &&
                        <p className={"no-plugins-matched"}>No plugins match this {actions.search ? 'search criteria': 'filter'}</p>:''}
                    {plugins.map(plugin => (
                        (plugin.plugin === 'plugna/plugin.php') ? '' :
                            <div className={'plugin-item postbox' +
                                (plugin.active ? ' active' : '') +
                                (plugin.inactive ? ' inactive' : '') +
                                (plugin.networkActive ? ' network-active' : '') +
                                (plugin.paused ? ' paused' : '') +
                                (plugin.deleted ? ' deleted' : '') +
                                (plugin.selected ? ' selected' : '') + //this is local value, not from service
                                (plugin.loading ? ' loading' : '') +
                                (plugin.hideAnimation ? ' hide-animation' : '') +
                                (plugin.updateSupported ? ' update-supported' : '') +
                                (plugin.autoUpdatesEnabled ? ' au-on' : ' au-off') +
                                (isPluginVisible(plugin, actions, filters) ? ' visible' : '')
                            }
                                 data-nonce={plugin.nonce}
                                 onClick={() => onItemClick(plugin, {
                                     setPlugins, actions
                                 })}
                                 onMouseLeave={(e)=>{
                                     e.target.classList.remove('show-info');
                                 }}
                                 key={plugin.plugin}>

                                <div className={"left-border"} />
                                <div className={"checked-image"}>
                                    <DashIcon icon="yes" />
                                </div>
                                <div className={"selected-border"}></div>
                                <Badges plugin={plugin} />
                                <div className={"content"}>
                                    {plugin.icon ?
                                        <img
                                            src={plugin.icon}
                                            className={"icon"}
                                            onError={(e)=>{
                                               // e.target.src = plugin.icon;
                                                jQuery(e.target).parent().find('.dashicons').show();
                                                jQuery(e.target).hide();
                                            }}
                                        /> :""}
                                    <DashIcon
                                        icon="admin-plugins icon"
                                        style={{display: plugin.icon ? 'none' : 'block'}}
                                    />
                                    <h2 className={"noselect"}>{plugin.name}</h2>&nbsp;
                                    <Loader/>
                                </div>
                                <Version plugin={plugin} />
                                <div
                                    className={"description"}
                                    onMouseLeave={(e)=>{
                                        e.target.parentElement.classList.remove('show-info');
                                    }}
                                    dangerouslySetInnerHTML={{__html: plugin.description}}/>
                            </div>

                    ))}
                </div>
                {plugins.length ? <MasterActions /> :''}
            </div>
        );
    }
}

export default Plugna;