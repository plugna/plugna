import Svg from "../components/Svg";

function Version(props) {
    return (
        <div className={"version"}>
            <span>{props.plugin.version}</span>

            {props.plugin.updateAvailable && props.plugin.newVersion ?
                <Svg name={"up"} /> : ''}
            <span className={"update"}>{props.plugin.updateAvailable && props.plugin.newVersion ?  props.plugin.newVersion : ''}</span>
        </div>
    );

}

export default Version;