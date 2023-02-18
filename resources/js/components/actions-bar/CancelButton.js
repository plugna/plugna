import CButton from "../CButton";
import {usePlugnaContext} from "../../state/PlugnaContext";
import hasSelected from "../../plugna/helpers/hasSelected";
import Svg from "../Svg";

function CancelButton(props) {
    const { plugins, setPlugins } = usePlugnaContext();

    if(!hasSelected(plugins)) {
        return <></>
    }

    return (
        <CButton
            onClick={(e)=>{
                e.preventDefault();
                setPlugins({type: 'deselect-all'});
            }}
            classes={"button-cancel"}
        >
            <Svg name={"delete"}/>
            <span className={"desktop-text"}>Clear selection</span>
            <span className={"mobile-text"}>Clear</span>
        </CButton>
    )
}
export default CancelButton;