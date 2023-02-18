import Client from '../Client';

export function addNewActions(action, callback) {
    switch (action.type) {
        case 'search-new':
            Client.searchNew(action.payload.term, action.payload.page)
                .then(res => callback (res.data));
            break;
    }
}