export function popupsReducer(state, action) {
    if(action.type === 'remove') {
        return [...state.filter(popup => popup !== action.payload)];
    }
    return [...state, action.type];
}