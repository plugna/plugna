export function newPluginReducer(state, action) {

    switch (action.type) {
        case 'last-searched':
            return {
                ...state, ...{
                    lastSearched: action.payload,
                }
            };
        case 'clear-last-searched':
            return {
                ...state, ...{
                    lastSearched: '',
                }
            };
        case 'update-plugin':
            return {
                ...state, ...{
                    plugins: [...state.plugins.map(plugin => {
                        if (plugin.slug === action.payload.slug) {
                            return {...action.payload};
                        }
                        return plugin;
                    })],
                }
            };
        case 'set-plugins':
            return {
                ...state, ...{
                    plugins: [...action.payload.plugins],
                    page: action.payload.info.page,
                    pages: action.payload.info.pages,
                    pagesLoaded: action.payload.info.pages <= action.payload.info.page,
                }
            };
        case 'next-page':
            return {
                ...state, ...{
                    page: state.page + 1,
                }
            };
        case 'append-plugins':
            return {
                ...state, ...{
                    plugins: [...state.plugins, ...action.payload.plugins],
                    page: action.payload.info.page,
                    pages: action.payload.info.pages,
                    pagesLoaded: action.payload.info.pages <= action.payload.info.page,
                }
            };
        case 'show':
            document.body.classList.add('plugna-add-new')
            return {
                ...state, ...{
                    show: true,
                }
            };
        case 'hide':
            document.body.classList.remove('plugna-add-new')
            return {
                ...state, ...{
                    show: false,
                }
            };
        case 'upload-show':
            document.body.classList.add('plugna-upload')
            return {
                ...state, ...{
                    upload: true,
                }
            };
        case 'upload-hide':
            document.body.classList.remove('plugna-upload')
            return {
                ...state, ...{
                    upload: false,
                }
            };

    }
    return state;
}