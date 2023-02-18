function CButton(props){
    let btnType = props.secondary ? 'button-primary secondary' : 'button-primary';
    if(props.wired) {
        btnType += ' wired';
    }
    if(props.onClick) {

        return (
            <button
                id={props.id}
                onClick={props.onClick}
                title={props.title}
                href="javascript:void(0)"
                style={props.style ?? null}
                className={
                    (props.wpPrimary ? `button ${btnType}` : `plugna-button ${btnType} `) +
                    (props.classes ? ' ' + props.classes : '')}

            >{props.children}</button>
        );
    }
    return (
        <a
            id={props.id}
            href={props.link}
            title={props.title}
            target={props.new ? '_blank' :''}
            aria-label={""}
            aria-title={""}
            className={`plugna-button ${btnType}` + (props.classes ? ' ' + props.classes : '')}
        >{props.children}</a>
    );
};

export default CButton;