import {usePlugnaContext} from "../state/PlugnaContext";

function ViewSwitch(){
    const { settings, setSettings } = usePlugnaContext();
    const oppositeView = settings.view === 'list' ? 'grid' : 'list'
    return (
        <div className={"view-switch" }>
            <a href={"#"}
               title={"Switch to " + (oppositeView) + " view"}
               onClick={()=>{
                setSettings({
                    type: 'view',
                    payload: settings.view
                });
            }}>
                <span className={"dashicons dashicons-" + oppositeView +"-view"}></span>
            </a>
        </div>
    );
};

export default ViewSwitch;