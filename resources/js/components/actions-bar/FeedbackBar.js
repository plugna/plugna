import hasSelected from "../../plugna/helpers/hasSelected";
import ApplyButton from "./ApplyButton";
import CancelButton from "./CancelButton";
import StatsBar from "./StatsBar";
import {usePlugnaContext} from "../../state/PlugnaContext";
import CButton from "../CButton";
import DashIcon from "../DashIcon";

function FeedbackBar(props) {
    const {newPlugin, setSettings} = usePlugnaContext();

    if (newPlugin.show || plugna.settings.feedbackStatus !== 'show') {
        return <></>
    }

    return <div className={"master-actions feedback " + (props.top ? ' top' : ' bottom')}>
        <div className={"stats-bar"}>
            <span className={"value"}> <DashIcon icon={"info"}/> We need your valuable feedback to make Plugna better. Could you please take 2 minutes to help us?</span>
            &nbsp;
            <CButton
                secondary
                classes={"red"}
                onClick={() => {
                    plugna.settings.feedbackStatus = '';
                    setSettings({type: 'feedbackDismissed'});
                }}>Dismiss</CButton>
            &nbsp;
            <CButton
                secondary
                onClick={() => {
                    window.open('https://forms.gle/koTTFBjdcS83GCA38', '_blank');
                    plugna.settings.feedbackStatus = '';
                    setSettings({type: 'feedbackProvided'});
                }}>Leave feedback</CButton>
        </div>
    </div>
}

export default FeedbackBar;