import {usePlugnaContext} from "../../state/PlugnaContext";
import hasSelected from "../../plugna/helpers/hasSelected";
import counter from "../../plugna/helpers/counter";

function StatsBar(props) {
    const { plugins, newPlugin, setPlugins, setActions, setFilters } = usePlugnaContext();

    if(hasSelected(plugins) || newPlugin.show) {
        return <></>
    }

    if(plugins.length === 0) {
        return <div className={"stats-bar"}><i>Loading...</i></div>
    }

    const handler = (filter) => {
        const action = filter.split('-')[0];
        setPlugins({type: 'deselect-all'});
        setActions({type: 'selected', payload: action});
        setFilters({type: 'filter', payload: {
                action: action,
                slug: filter
            }});
    }

    const link = (filter, name) => {
        return <a href={"javascript:void(0)"} className={"name"} onClick={() => handler(filter)}>{name}</a>
    }

    return (
        <div className={"stats-bar"}>
            {link('toggle-toggle', 'Total:')}
            <span className={"value"}>{plugins.length}</span>
            {link('toggle-deactivate', 'Active:')}
            <span className={"value"}>{counter.active(plugins)}</span>
            {link('toggle-activate', 'Inactive:')}
            <span className={"value"}>{counter.inactive(plugins)}</span>
            {link('update-available', 'Updates available:')}
            <span className={"value"}>{counter.updatable(plugins)}</span>
            {link('au-off', 'Auto-updates disabled:')}
            <span className={"value"}>{counter.autoupdatesoff(plugins)}</span>
            {link('au-on', 'Auto-updates enabled:')}
            <span className={"value"}>{counter.autoupdates(plugins)}</span>
        </div>
    )
}
export default StatsBar;