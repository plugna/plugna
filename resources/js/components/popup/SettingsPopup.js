import Popup from "./Popup";
import Client from "../../Client";
import CButton from "../CButton";
import {usePlugnaContext} from "../../state/PlugnaContext";
import DashIcon from "../DashIcon";

function SettingsPopup(props) {
    const { notify, noop } = usePlugnaContext();
    return (
        <>
            <Popup title="PLUGNA SETTINGS" name={"settings"}  {...props}>
                <table className={"plugna-table settings-table"}>
                    <tbody>
                    <tr>
                        <td><CButton
                            onClick={props.showWelcome}>
                            <DashIcon icon={"info"}/>&nbsp;
                            <span>Introduction</span>
                        </CButton></td>
                        <td><span>Show again the Plugna introductory popup and learn the basics of how to use the plugin</span></td>
                    </tr>
                    <tr>
                        <td>

                            <CButton
                                onClick={() => {
                                    notify.confirm(
                                        "Are you sure you want to deactivate PLUGNA and use the original WordPress plugin manager instead?",
                                        noop,
                                        () => {
                                            //TODO: Add 2 new popups
                                            // 1. flash
                                            // 2. status - doing...
                                            Client.deactivatePlugin({plugin: 'plugna/plugin.php'})
                                                .then((response) => {
                                                    if(response.success) {
                                                        window.location.href = plugna.session.pathAdmin + 'plugins.php';
                                                    }
                                                })
                                                .catch(e => {
                                                    console.log(e);
                                                });
                                        },
                                        'Deactivate PLUGNA'
                                    )
                                }}>
                                <DashIcon icon={"remove"}/> &nbsp;
                                <span>Deactivate Plugna</span>
                            </CButton></td>
                        <td><span>Deactivate Plugna and switch back to the default WordPress plugins manager</span></td>
                    </tr>
                    </tbody>
                </table>
                <ul>
                    <li>
                    </li>
                    <li>
                    </li>
                    <li>
                    </li>
                </ul>
            </Popup>
        </>
    );
};

export default SettingsPopup;