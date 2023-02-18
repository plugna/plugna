import {usePlugnaContext} from "../state/PlugnaContext";

function Svg(props){
    const { session } = usePlugnaContext();
    return (
        <img
            src={session.path + 'resources/icons/' + props.name + ".svg"}
            width={props.width ? props.width : null}
            height={props.height ? props.height : null}
            onClick={props.onClick ? props.onClick : null}
            className="icon"
            title={props.title ? props.title : null}
            alt={props.alt ?? props.name}/>
    );
}

export default Svg;