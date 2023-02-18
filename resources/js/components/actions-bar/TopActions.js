import CButton from "../CButton";
import DashIcon from "../DashIcon";
import {usePlugnaContext} from "../../state/PlugnaContext";

function TopActions(props) {

    const { popup } = usePlugnaContext();

    return (
        <>
            <CButton style={{marginLeft: '1px'}}
                     onClick={popup.settings}
                     title={"Open the settings popup."}
                     wpPrimary={true}>
                <DashIcon icon={"admin-settings"} />
                <span>Settings</span>
            </CButton>
            <CButton style={{
                maxWidth: '101px',
                minWidth: '56px',
                marginLeft: '4px'
            }} onClick={()=> window.location.reload()}
                     title={"Refresh the page to see the latest changes."}
                     wpPrimary={true}>
                <DashIcon icon={"update-alt"} style={{marginRight: 0}}/>
                <span>&nbsp;</span>
            </CButton>
        </>
    );
}

export default TopActions;