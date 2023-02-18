import {usePlugnaContext} from "../../state/PlugnaContext";
import CButton from "../CButton";
import DashIcon from "../DashIcon";

function SearchInstalled(props) {

    const { actions, setActions } = usePlugnaContext();

    const onSearch = (event) => {
        const val = event.target.value;

        if(val.length < 2 && !actions.search) {
            return;
        }
        actions.search = val.length < 2 ? null : val;
        setActions({type: 'search', payload: actions.search});
    }

    return (
        <>
            <input
                type={"text"}
                placeholder={"Search..."}
                onKeyUp={onSearch}
                name={"action-search-input"}
                value={actions.search}
                onChange={(e)=>{
                    setActions({type: 'search', payload: e.target.value});
                }}
            />
            {actions.search && <div className={"clear-input"}>
                <CButton
                    title={"Clear"}
                    onClick={()=>{
                        setActions({type: 'search', payload: ''});
                    }}><DashIcon icon={"no"}/></CButton>
            </div>}
        </>
    )
}
export default SearchInstalled;