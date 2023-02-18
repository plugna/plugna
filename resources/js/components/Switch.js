function Switch(props){
    return (
        <div className={"component-switch" }>
            <span title={props.title}><b>{props.label}</b></span>
            <input
                type="checkbox"
                id={"switch-" + props.label}
                onChange={props.onUpdate}
                checked={props.input == props.value ? 'checked' : ''}
            />
            <label htmlFor={"switch-" + props.label}>{props.label}</label>
        </div>
    );
}

export default Switch;