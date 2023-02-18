export function pluginsReducer(state, action) {
    switch (action.type) {
        case 'load':  //load from DB
            return [...state, ...action.payload];
        case 'deselect-all':
            return [...state.map(plugin => {
                return {...plugin, selected: false};
            })];
        case 'loading-selected':
            return [...state.map(plugin => {
                if (plugin.selected) {
                    return {...plugin, selected: false, loading: true};
                }
                return plugin;
            })];
        case 'activate-plugins-loader':
            const slugs = action.payload.map(item => item.plugin);
            return [...state.map(plugin => {
                if (slugs.indexOf(plugin.plugin) !== -1) {
                    return {...plugin, loading: true};
                }
                return plugin;
            })];
        case 'update-plugin':
            return [...state.map(plugin => {
                if (plugin.plugin === action.payload.plugin) {
                    return action.payload;
                } 
                return plugin;
            })];
        case 'delete-plugin':
            return [...state.filter(plugin => {
                return plugin.plugin !== action.payload.plugin;

            })];
    }
    return state;
}