import { usePlugnaContext }from '../../state/PlugnaContext'
import ActionItem from "./ActionItem";

import SearchInstalled from "./SearchInstalled";
import AddNewPlugin from "./AddNewPlugin";
import Filters from "./Filters";
import TopActions from "./TopActions";

function ActionsBar(props) {

    return (
        <div className={"actions-wrap"}>
            <div className="actions">
                <div className={"row-name"}>
                    <span>Actions</span>
                </div>
                <ul className={"left"}>
                        <ActionItem
                            slug={"toggle"}
                            name={"<span>Activate</span>&nbsp;/&nbsp;<span>Deactivate</span>"}
                            title={"Toggle activation of the selected plugins"}
                        />
                        <ActionItem
                            slug={"delete"}
                            name={"Delete"}
                            title={"Delete the selected plugins"}
                        />
                        <ActionItem
                            slug={"update"}
                            name={"Update"}
                            title={"Update all selected plugins"}
                        />

                </ul>

                <ul className={"right"}>
                    <li className={"master-actions"}>
                        <TopActions />
                    </li>

                </ul>
            </div>
            <div className="actions filters" >
                <div className={"row-name"}>
                    <span>Filters</span>
                </div>
                <ul className={"left"}>
                    <Filters />
                </ul>
                <ul className={"right"}>
                    <li className={"action-search action-search-old"}>
                        <SearchInstalled />
                    </li>
                    <li className={""}>
                        <AddNewPlugin />
                    </li>
                </ul>
            </div>
        </div>
    );
}
export default ActionsBar;