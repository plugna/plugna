import Client from '../Client';

export function pluginsActions(action, callback) {
    let plugin = action.payload;
    switch (action.type) {
        case 'load':
            Client.getPlugins()
                .then(res => res.json())
                .then(res => JSON.parse(res.data))
                .then(res => callback (res));
            break;
        case 'toggle':
            Client.togglePlugin(plugin)
                .then(()=>{
                    plugin.active = !plugin.active;
                    plugin.inactive = !plugin.inactive;
                    plugin.loading = false;
                    callback(plugin);
                })
                .catch(e =>{
                    console.log(e);
                    plugin.loading = false;
                    callback(plugin);
                });
            break;
        case 'activate' :
            Client.activatePlugin(plugin)
                .then(()=>{
                    plugin.active = true;
                    plugin.inactive = false;
                    plugin.loading = false;
                    callback(plugin);
                })
                .catch(e =>{
                    console.log(e);
                    plugin.loading = false;
                    callback(plugin);
                });
            break;
        case 'deactivate' :
            Client.deactivatePlugin(plugin)
                .then(()=>{
                    plugin.active = false;
                    plugin.inactive = true;
                    plugin.loading = false;
                    callback(plugin);
                })
                .catch(e =>{
                    console.log(e);
                    plugin.loading = false;
                    callback(plugin);
                });
            break;
        case 'delete' :
            Client.deletePlugin(plugin)
                .then(()=>{
                    plugin.active = false;
                    plugin.inactive = false;
                    plugin.loading = false;
                    plugin.deleted = true;
                    callback(plugin);
                })
                .catch(e =>{
                    console.log(e);
                    plugin.loading = false;
                    callback(plugin);
                });
            break;
        case 'delete-forced' :
            Client.forceDeletePlugin(plugin)
                .then(()=>{
                    plugin.active = false;
                    plugin.inactive = false;
                    plugin.loading = false;
                    plugin.deleted = true;
                    callback(plugin);
                })
                .catch(e =>{
                    console.log(e);
                    plugin.loading = false;
                    callback(plugin);
                });
            break;
        case 'au' :
            Client.toggleAutoUpdatesOnPlugin(plugin)
                .then(()=>{
                    plugin.autoUpdatesEnabled = !plugin.autoUpdatesEnabled;
                    plugin.loading = false;
                    callback(plugin);
                })
                .catch(e =>{
                    console.log(e);
                    plugin.loading = false;
                    callback(plugin);
                });
            break;
        case 'update' :
            Client.updatePlugin(plugin)
                .then(result => result.text())
                .then((result)=>{
                    //console.log('result', result);
                    let parts = result.split('|');
                    const upgradeMessage = parts[0];
                    let isSuccessMessage = false;
                    const successMessagesJSON = JSON.parse(JSON.parse(parts[1]).data).success_messages;
                    successMessagesJSON.forEach(successMessage => {
                        //success message found in original upgrade text
                        if (upgradeMessage.indexOf(successMessage) !== -1){
                            isSuccessMessage = true;
                        }
                    });

                    if(isSuccessMessage) {
                        plugin.updateAvailable = !plugin.updateAvailable;
                    }else {
                        plugin.error = 'Unable to upgrade';
                    }

                    plugin.loading = false;
                    callback(plugin);

                })
                .catch(e =>{
                    console.log(e);
                    plugin.loading = false;
                    callback(plugin);
                });
            break;
    }
}