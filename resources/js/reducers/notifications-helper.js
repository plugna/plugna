export function notificationsHelper(setNotifications) {
    const flash = (title) =>{
        setNotifications({
            payload: {
                type: 'flash',
                title,
            }
        })
    };
    const progress = (title) => {
        setNotifications({
            payload: {
                type: 'progress',
                title: title ?? 'Loading',
            }
        })
    }
    return {
        info: (message, onClose, title) => {
            setNotifications({
                payload: {
                    type: 'info',
                    title: title ?? 'Info',
                    text: message,
                    onClose
                }
            })
        },
        error: (message, onClose, title) => {
            setNotifications({
                payload: {
                    type: 'error',
                    title: title ?? 'Error',
                    text: message,
                    onClose
                }
            })
        },
        warning: (message, onClose, title) => {
            setNotifications({
                payload: {
                    type: 'warning',
                    title: title ?? 'Warning',
                    text: message,
                    onClose
                }
            })
        },
        confirm: (message, onClose, onConfirm, title) => {
            setNotifications({
                payload: {
                    type: 'confirmation',
                    title: title ?? 'Are you sure?',
                    text: message,
                    onClose,
                    onConfirm,
                }
            })
        },
        //Show flash message that will auto-hide after some time
        flash,
        success: () => flash('Success!'),

        //Progress
        progress,
        loading: progress,
        saving: () => progress('Saving'),

        //Close all notifications
        close: () =>{
            setNotifications({type: 'remove'});
        }
    }
}