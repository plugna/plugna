import WelcomePopup from "./WelcomePopup";
import SettingsPopup from "./SettingsPopup";
import {usePlugnaContext} from "../../state/PlugnaContext";

function Popups() {
    const {popups, setSettings, popup} = usePlugnaContext();

    const list = {
        welcome: (key) => {
            return (
                <WelcomePopup
                    key={key}
                    onClose={() => {
                        setSettings({type: 'hideWelcome'});
                    }}
                />
            )
        },
        settings: (key) => {
            return (
                <SettingsPopup
                    key={key}
                    showWelcome={() => {
                        popup.welcome();
                    }}
                />
            );
        }
    }

    return (
        <>
            {popups.map((popup, index) => {
                return list[popup](index);
            })}
        </>
    )
}

export default Popups;