import Client from "../Client";

export function settingsReducer(state, action) {

    let newState = state;
    switch (action.type) {
        case 'hideWelcome':
            newState =  {...state, ...{hideWelcome: true}};
            break;
        case 'view':
            newState =  {...state, ...{view: action.payload === 'list' ? 'grid':'list'}};
            break;
        default:
            throw new Error('Reducer action ' + action.type + ' not found');

    }
    Client.updateSettings(newState);
    return newState;


}