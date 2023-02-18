export function popupsHelper(setPopups) {
    return {
        welcome: () =>{
            setPopups({type: 'welcome'});
        },
        settings: () => {
            setPopups({type: 'settings'});
        }
    };
}