import Svg from "../components/Svg";

function Badges(props) {
    return (
        <>
            <div className={"badges"}>
                <ul>
                    {props.plugin.updateSupported && <li
                        className={"au " + (props.plugin.autoUpdatesEnabled ? 'enabled' : '') }
                        title={
                            "Auto updates " + (props.plugin.autoUpdatesEnabled ? 'enabled' : 'disabled')}>
                        {/*<span>AU</span>*/}
                        {props.plugin.autoUpdatesEnabled ?
                            <Svg
                                width={20}
                                title={"Auto-updates are ON"}
                                name={"au-on"} /> :
                            <Svg
                                width={20}
                                title={"Auto-updates are OFF"}
                                name={"au-off"} />}
                    </li>}
                    {props.plugin.updateSupported && props.plugin.updateAvailable &&
                        <li className={"update"}>
                            <Svg
                                name={"update"}
                                title={"Update available"}
                            />
                        </li>}
                </ul>
            </div>
            <div className={"info"}>
                {props.plugin.description ? (
                    <span onMouseEnter={(e) => {
                        e.target.parentElement.parentElement.classList.add('show-info');
                    }}
                          className="dashicons dashicons-info"/>
                ) : ''}
            </div>
        </>

    );
}

export default Badges;