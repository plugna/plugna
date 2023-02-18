import FilterItem from "./FilterItem";
import {usePlugnaContext} from "../../state/PlugnaContext";

function Filters(props) {

    const { actions } = usePlugnaContext();

    return <>
            { <>
                {actions.selected === 'toggle' &&
                    <>
                        <FilterItem slug={"toggle-toggle"} name={"Any"} />
                        <FilterItem slug={"toggle-deactivate"} name={"Active Only"} />
                        <FilterItem slug={"toggle-activate"} name={"Inactive Only"} />
                    </>
                }
                {actions.selected === 'delete' &&
                    <>
                        <FilterItem slug={"delete-any"} name={"Any"} />
                        <FilterItem slug={"delete-active"} name={"Active Only"} />
                        <FilterItem slug={"delete-inactive"} name={"Inactive Only"} />
                    </>
                }
                {actions.selected === 'update' &&
                    <>
                        <FilterItem slug={"update-available"} name={"Update Available"} />
                        <FilterItem slug={"update-any"} name={"Any"} />
                    </>
                }
                {actions.selected === 'au' &&
                    <>
                        <FilterItem slug={"au-toggle"} name={"Any"} />
                        <FilterItem slug={"au-off"} name={"OFF Only"} />
                        <FilterItem slug={"au-on"} name={"ON Only"} />
                    </>
                }
            </>}
    </>;
}

export default Filters;