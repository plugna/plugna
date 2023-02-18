import CButton from "../components/CButton";
import Loader from "../image/Loader";

function Notification(props) {

    const [show, setShow] = wp.element.useState(true);

    const close = () => {
        setShow(false);
        if (props.onClose) {
            props.onClose();
        }
    }

    wp.element.useEffect(() => {
        if(props.type === 'flash') {
            setTimeout(()=> {
                close();
            }, 1500);
        }
    }, []);

    return (
        <div className={"plugna-notification " + (show ? ' visible' : '') + " type-" + props.type}>
            <div className={"bg"} onClick={close}>&nbsp;</div>
            <div className={"wrapper"}>
                <div className={"inner"}>
                    <CButton title={"Close this window"} classes={"exit"} onClick={close}>X</CButton>
                    <h2><Loader />{props.title}</h2>
                    <div className={"content"}>
                        {props.children}
                    </div>
                    <div className={"actions"}>
                        {props.type === 'confirmation' ?
                            <>
                                <CButton title={"OK"} classes={"ok"} onClick={() => {
                                    props.onYes && props.onYes();
                                    setShow(false);
                                }}>OK</CButton>
                                <CButton title={"Cancel"} classes={"cancel"} onClick={close}>Cancel</CButton>
                            </>
                            :
                            <CButton onClick={close}>Close</CButton>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export const showInfo = (message, title = null, onClose = null) => {
    return (
        <Notification title={title ?? "INFO"} type={"info"} onClose={onClose}>
            {message}
        </Notification>
    )
}

export const showConfirmation = (message, title, onYes, onCancel) => {
    return (
        <Notification title={title ?? 'Are you sure?'} type={"confirmation"} onYes={onYes}  onClose={onCancel}>
            {message}
        </Notification>
    )
}

export const showError = (message, title = null, onClose = null) => {
    return (
        <Notification title={title ?? "Error"} type={"error"}  onClose={onClose}>
            {message}
        </Notification>
    )
}

export const showWarning = (message, title, onClose) => {
    return (
        <Notification title={title ?? "Warning"} type={"warning"}  onClose={onClose}>
            {message}
        </Notification>
    )
}

export default Notification;