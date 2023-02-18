import {settingsReducer} from "../reducers/settings";
import {actionsReducer} from "../reducers/actions";
import {filtersReducer} from "../reducers/filters";
import {pluginsReducer} from "../reducers/plugins";
import {notificationsReducer} from "../reducers/notifications";
import {newPluginReducer} from "../reducers/newPlugin";
import {sessionReducer} from "../reducers/session";

import PlugnaContext from "./PlugnaContext";
import Plugna from "../Plugna";
import {popupsReducer} from "../reducers/popups";
import {popupsHelper} from "../reducers/popups-helper";
import {notificationsHelper} from "../reducers/notifications-helper";

const plugnaState = {
    actions: {
        selected: plugna.actions?.selected ?? 'toggle',
        search: null,
        searchNew: null,
        type: 'select'
    },
    filters: plugna.filters ??{
        toggle: 'toggle-toggle',
        delete: 'delete-any',
        update: 'update-available',
        au: 'au-toggle'
    },
    settings: {
        hideWelcome: plugna.settings?.hideWelcome ?? false,
        view: plugna.settings?.view ?? 'grid',
    },
    session: {
        ...{
            popup: false, //TODO: check this if used
            newPlugin: {
                plugins:[],
                page: 1,
                pages: 1,
                lastSearched: '',
                show: false, //show new plugin window
                upload: false //show upload plugin window
            },
            notifications: [],
        }, ...plugna.session
    }
};

function PlugnaWrap() {

    const [settings, setSettings] = wp.element.useReducer(settingsReducer, plugnaState.settings);
    const [actions, setActions] = wp.element.useReducer(actionsReducer, plugnaState.actions);
    const [filters, setFilters] = wp.element.useReducer(filtersReducer, plugnaState.filters);
    const [newPlugin, setNewPlugin] = wp.element.useReducer(newPluginReducer, plugnaState.session.newPlugin);
    const [plugins, setPlugins] = wp.element.useReducer(pluginsReducer, []);
    const [notifications, setNotifications] = wp.element.useReducer(notificationsReducer, []);
    const [popups, setPopups] = wp.element.useReducer(popupsReducer, []);
    const [session, setSession] = wp.element.useReducer(sessionReducer, plugnaState.session);
    const noop = () => {};

    const popup = popupsHelper(setPopups);
    const notify = notificationsHelper(setNotifications);

    return (
        <PlugnaContext.Provider value={{
            settings, setSettings,
            actions, setActions,
            filters, setFilters,
            plugins, setPlugins,
            newPlugin, setNewPlugin,
            notifications, setNotifications, notify,
            popups, setPopups, popup,
            session, setSession,
            noop,
        }}>
            <Plugna/>
        </PlugnaContext.Provider>
    );

}

export default PlugnaWrap;