import {usePlugnaContext} from "../../state/PlugnaContext";
import Svg from "../Svg";

const classNames = require("classnames");

function FilterItem(props) {

    const { actions } = usePlugnaContext();
    const { filters, setFilters } = usePlugnaContext();
    const { setPlugins } = usePlugnaContext();
    const type = props.type ?? 'selected';
    const slug = props.slug;

    const slugToIcon = (slug)=>{

        switch(slug){
            case 'toggle-deactivate':
            case 'delete-active':
                return 'activate';
            case 'toggle-activate':
            case 'delete-inactive':
                return 'deactivate';
            case 'au-off':
                return 'au-off';
            case 'au-on':
                return 'au-on';
            case 'update-available':
                return 'update';
        }
        return 'grid';
    }
    return (
        <li className={type + "-" + slug + ' filter-action-' + actions.selected}>
            <button className={classNames(
                "e-button button-primary",
                {
                    "active": (
                        (filters[actions.selected] === slug)
                    ),
                }
            )}
                    onClick={() =>{
                        setPlugins({type: 'deselect-all'});
                        setFilters({type: 'filter', payload: {
                            action: actions.selected,
                                slug
                        }});
                    }}
            >
                <Svg className={"icon"} name={slugToIcon(props.slug)} />
                <span dangerouslySetInnerHTML={{__html: props.name}}/>
            </button>
        </li>
    );
};

export default FilterItem;