import CButton from "../CButton";
import {usePlugnaContext} from "../../state/PlugnaContext";

function Popup(props){

    const {setPopups} = usePlugnaContext();
    const [visible, setVisible] = wp.element.useState(true);

    const close = () => {
        setVisible(false);
        props.onClose && props.onClose();
    }
    wp.element.useEffect(() => {
        if(!visible) {
            //wait for the animation to finish
            setTimeout(()=> {
                setPopups({type: 'remove', payload: props.name});
            }, 300);
        }
    }, [visible])
    return (
        <div className={"plugna-popup" + (visible ? ' visible' : '') + " popup-" + props.name}>
            <div className={"bg"} onClick={close}>&nbsp;</div>
            <div className={"wrapper"}>
                <div className={"inner"}>
                    <CButton title={"Close this window"} classes={"exit"} onClick={close}>X</CButton>
                    <h2 style={{textAlign: 'center'}}>{props.title}</h2>
                    <div className={"content"}>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Popup;