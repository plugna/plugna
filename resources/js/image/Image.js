function Image(props) {
    return (
        <div className={"plugna-image"}>
            <img
                src={'/wp-content/plugins/plugna/resources/images/' + props.src}
                alt={props.alt ? props.alt : 'Image'}
                width={props.width ? props.width : null}
                height={props.height ? props.height : null}
            />
        </div>
    );
}
export default Image;