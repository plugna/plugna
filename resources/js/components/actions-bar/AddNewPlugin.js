import CButton from "../CButton";
import DashIcon from "../DashIcon";
import {usePlugnaContext} from "../../state/PlugnaContext";
import Client from "../../Client";

function AddNewPlugin(props) {
    const { setNewPlugin } = usePlugnaContext();

    return (
        <CButton
            secondary
            onClick={()=>{
                setNewPlugin({type: 'show'});
                setNewPlugin({type: 'clear-last-searched'});
                setNewPlugin({type: 'set-plugins', payload: {plugins: [], info: {page: 1, pages: 1}}});
                Client.searchNew()
                    .then(res => {
                        setNewPlugin({type: 'set-plugins', payload: res.data});
                    });
            }}
            className={"add-new-plugin"}
        >
            <DashIcon icon={"plus-alt"}/>
            <span>&nbsp;Add New</span>
        </CButton>
    )
}
export default AddNewPlugin;