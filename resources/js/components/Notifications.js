import {usePlugnaContext} from "../state/PlugnaContext";
import Notification from "./Notification";

function Notifications() {
    const {notifications} = usePlugnaContext();

    return (
        <div className={"plugna-notifications"}>
            {notifications.map((notification, index) => {
                return (
                    <Notification
                        key={index}
                        title={notification.title ?? 'Are you sure?'}
                        type={notification.type}
                        onYes={notification.onConfirm}
                        onClose={notification.onClose}>
                        {notification.text}
                    </Notification>
                );
            })}
        </div>
    );
}

export default Notifications;