function SearchingLoader(props){
    return (
        <div className={
            "searching" +
            (props.noLoader ? ' no-loader' : '') +
            (props.classes ? ' ' + props.classes : '')}>
            <div className={"spinner"} style={{minWidth:  "calc("+props.text.length+" * 15px)" }}>{props.text}</div>
        </div>
    )
}
export default SearchingLoader;