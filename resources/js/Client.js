const Client = {
    basePath: '/wp-json/plugna/v1/',
    _get(path){
        return new Promise( (resolve, reject) => {
            fetch(Client.basePath +  path  +
                '?_wpnonce=' + plugna.session.nonce+'&plugna_nonce=' + plugna.session.nonces[path])
                .then(function(res){
                    plugna.session.nonces[path] = res.headers.get('new-nonce');
                    return resolve(res);
                })
                .catch(er => reject(er));
        });
    },
    _post(path, data, isText = false){
        return new Promise( (resolve, reject) => {
            fetch(Client.basePath +  path +
                '?_wpnonce='+plugna.session.nonce+'&plugna_nonce=' + plugna.session.nonces[path],{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(r => {
                    plugna.session.nonces[path] = r.headers.get('new-nonce');
                    return isText ? r.text() :r.json();
                })
                .then(r => isText ? resolve(r) : resolve(JSON.parse(r.data)))
                .catch(er => reject(er));
        });
    },
    getPlugins: () => {
        return Client._get('list');
    },
    togglePlugin: (item) => {
        return Client._post('toggle_plugin', item);
    },
    togglePlugins: (plugins) => {
        return Client._post('toggle_plugins', plugins);
    },
    activatePlugin: (item) => {
        return Client._post('activate_plugin', item);
    },
    deactivatePlugin: (item) => {
        return Client._post('deactivate_plugin', item);
    },
    deletePlugin: (item) => {
        return Client._post('delete_plugin', item);
    },
    deletePlugins: (item) => {
        return Client._post('delete_plugins', item);
    },
    forceDeletePlugin: (item) => {
        return Client._post('force_delete_plugin', item);
    },
    toggleAutoUpdatesOnPlugin: (item) => {
        //return Client._post('toggle_auto_updates', item);
    },
    toggleAutoUpdatesOnPlugins: (item) => {
        return Client._post('toggle_auto_updates_multiple', item);
    },
    updatePlugin: (item) => {
        return Client._post('update_plugin', item);
    },
    updatePlugins: (items) => {
        return Client._post('update_plugins', items, true);
    },
    updateSetting: (settings) => {
        return Client._post('update_setting', settings);
    },
    updateSettings: (settings) => {
        return Client._post('update_settings', settings);
    },
    updateActions: (actions) => {
        return Client._post('update_actions', actions);
    },
    updateFilters: (filters) => {
        return Client._post('update_filters', filters);
    },
    searchNew: (term = '', page = 1) => {
        return Client._post('search_new', {s: term, p: page});
    },
    installNewFromWPOrg: (slug) => {
        return Client._post('install_from_wporg_plugin', {slug}, true);
    }
};
export default Client;