import Client from '../Client';

export function filtersReducer(state, action) {

    const newState = {
        ...state, ...{
            [action.payload.action]: action.payload.slug
        }
    };

    //Persist to DB
    Client.updateFilters(newState);

    return newState;
}