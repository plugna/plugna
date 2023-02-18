import Client from '../Client';

export function actionsReducer(state, action) {

    console.log(state, action);
    const newState = {
        ...state, ...{
            [action.type]: action.payload
        }
    };

    //Persist to DB
    if(action.type === 'type' || action.type === 'selected') {
        Client.updateActions(newState);
    }

    return newState;
}