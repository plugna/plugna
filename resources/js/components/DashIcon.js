function DashIcon(props){
    return (
        <span className={"dashicons dashicons-before dashicons-" + props.icon} style={props.style} />
    );
};

export default DashIcon;