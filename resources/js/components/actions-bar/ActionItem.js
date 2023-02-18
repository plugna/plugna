import {usePlugnaContext} from "../../state/PlugnaContext";

const classNames = require("classnames");
import Svg from "../Svg";

function ActionItem(props) {

    const { actions, setActions } = usePlugnaContext();
    const { setPlugins } = usePlugnaContext();
    const type = props.type ?? 'selected';

    return (
        <li className={type + "-" + props.slug}>
            <button
                title={props.title ? props.title : null}
                className={classNames(
                "e-button button-primary",
                {
                    "active": (
                        (actions[type] === props.slug) ||
                        (actions.type === 'select' && props.slug === 'select')
                    ),
                }
            )}
                    onClick={() =>{
                        setPlugins({type: 'deselect-all'});
                        setActions({type: 'selected', payload: props.slug});
                    }}
            >
                {/*<span className={"dashicons dashicons-warning"}></span>*/}
                <Svg className={"icon"} name={props.slug} />
                <span dangerouslySetInnerHTML={{__html: props.name}}/>
            </button>
        </li>
    );
}

export default ActionItem;