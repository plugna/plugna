import hasSelected from "../../plugna/helpers/hasSelected";
import ApplyButton from "./ApplyButton";
import CancelButton from "./CancelButton";
import StatsBar from "./StatsBar";
import {usePlugnaContext} from "../../state/PlugnaContext";

function MasterActions(props) {
    const { plugins, newPlugin} = usePlugnaContext();

    if(newPlugin.show) {
        return <></>
    }

    return <div className={"master-actions" +
        (props.top ? ' top' : ' bottom') +
        (hasSelected(plugins)? ' has-selected':'') +
        (newPlugin.show ? ' new-plugin-show' : '')
    }>
        <ApplyButton />
        <CancelButton />
        <StatsBar />
    </div>
}

export default MasterActions;