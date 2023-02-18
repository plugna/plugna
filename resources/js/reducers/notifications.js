export function notificationsReducer(state, action) {
    if(action.type === 'remove') {
        return [];
    }
    return [...state, action.payload];
}