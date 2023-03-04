function Image(props) {
    return (
        <div className={"plugna-image"}>
            <img
                //TODO: use session from the store
                src={plugna.session.path + 'resources/images/' + props.src}
                alt={props.alt ? props.alt : 'Image'}
                width={props.width ? props.width : null}
                height={props.height ? props.height : null}
            />
        </div>
    );
}
export default Image;