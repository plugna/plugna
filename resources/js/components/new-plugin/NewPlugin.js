import CButton from "../CButton";
import {usePlugnaContext} from "../../state/PlugnaContext";
import Client from "../../Client";
import DashIcon from "../DashIcon";
import decodeEntity from "../../lib/decodeEntity";
import {addNewActions} from "../../actions/addNew";
import SearchingLoader from "../SearchingLoader";
import hasInstallingOrActivatingPlugins from "../../plugna/helpers/new-plugin/hasInstallingOrActivatingPlugins";

function NewPlugin() {

    const { newPlugin, setNewPlugin} = usePlugnaContext();
    const { actions } = usePlugnaContext();

    const [searching, setSearching] = wp.element.useState('initial');
    const [paginating, setPaginating] = wp.element.useState(false);

    const [typingTimer, setTypingTimer] = wp.element.useState(null);

    const [uploadError, setUploadError] = wp.element.useState(null);
    const [uploadErrorDetails, setUploadErrorDetails] = wp.element.useState(null);
    const [uploading, setUploading] = wp.element.useState(false);
    const [activating, setActivating] = wp.element.useState(false);
    const [success, setSuccess] = wp.element.useState(false);
    const [searchInput, setSearchInput] = wp.element.useState('');

    const searchTypingInterval = 600;
    let initialLoad = false;

    wp.element.useEffect(() => {
        if(!document.body.classList.contains('plugna-add-new')){
            return;
        }

        const onScroll = event => {

            if (jQuery(document).height() - jQuery(window).height() <= jQuery(window).scrollTop()) {
                if(!paginating && !newPlugin.upload && newPlugin.page < newPlugin.pages) {
                    setPaginating(paginating);
                    onAddPage(paginating, searching, newPlugin.page, newPlugin.lastSearched)
                    //console.log('Scrolled to Bottom');
                }
            }
        };

        window.addEventListener("scroll", onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [paginating, newPlugin.show, searching, newPlugin.page, newPlugin.pages])

    wp.element.useEffect(() => {

        if(initialLoad){
            return;
        }
        initialLoad = true;

        jQuery('.wp-upload-form').on('submit', (e) => {
            e.preventDefault();
            const form = jQuery(e.target);
            const action = form.attr('action');
            const formData = new FormData();

            formData.append('_wpnonce', form.find('[name=_wpnonce]').val());
            formData.append('_wp_http_referer', form.find('[name=_wp_http_referer]').val());
            formData.append('install-plugin-submit', form.find('[name=install-plugin-submit]').val());
            formData.append('pluginzip', jQuery('#pluginzip')[0].files[0]);

            setUploadError(null);
            setUploadErrorDetails(null);
            setUploading(true);
            setActivating(false);
            setSuccess(false);
            setNewPlugin({type: 'upload-hide'});

                jQuery.ajax({
                    type: "POST",
                    url: action,
                    data: formData,
                    processData: false,  // tell jQuery not to process the data
                    contentType: false,  // tell jQuery not to set contentType
                    dataType: "json",
                    encode: true,
                })
                    .complete(function(data) {
                        const printedMessage = data.responseText.split('<div class="wrap">')[1].split('<div class="clear">')[0];
                        if(printedMessage.indexOf('?action=activate') !== -1){
                            //installed, now we can activate it
                            let pluginSlug = printedMessage.split('action=activate&amp;plugin=')[1].split('&amp;_wpnonce')[0];//.replace(/%2F/g,'\/')
                            pluginSlug = decodeURIComponent(pluginSlug);
                            Client.activatePlugin({plugin: pluginSlug})
                                .then(res => {
                                    setActivating(false);
                                    setSuccess(true);
                                })
                                .catch(err => {
                                    setUploadError('Unable to activate plugin. Please try again.')
                                })
                            if(data.status === 200) {
                                setUploading(false);
                                setActivating(true);
                            }
                        }else if(printedMessage.indexOf(plugna.translations.plugin_installed_successfully) !== -1) {
                            //installed and already activated, do nothing
                            setUploading(false);
                            setSuccess(true);
                        }else {
                            //not installed and not activated, show message trace
                            setUploading(false);
                            setActivating(false);
                            setUploadError('Unable to install plugin. Please try again.');
                            setUploadErrorDetails(printedMessage);
                        }

                })
                    .fail(function (data) {
                        if(data.status !== 200) {
                            setUploadError(data.responseJSON);
                            console.log('err data.responseJSON', data.responseJSON, data.status);
                        }

                });
        });

    }, []);

    wp.element.useEffect(() => {
        if(newPlugin.plugins && newPlugin.plugins.length >0){
            setSearching(false);
        }else {
            setSearchInput('');
        }
    },[newPlugin.plugins])

    wp.element.useEffect(() => {
        if(newPlugin.show && !hasInstallingOrActivatingPlugins(newPlugin.plugins, true)) {
            jQuery('.add-new-plugin [name=action-search-input]')
                .val('')
                .focus();
        }
    },[newPlugin])

    const searchNewCallback = (res, val) => {
        setSearching('');
        setNewPlugin({
            type: 'last-searched',
            payload: val,
        });
        if(res.info.pages <= res.info.page){
            //do nothing
        }else{
            if(!res.plugins.length) {
                setPaginating(paginating);
                onAddPage(paginating, searching, newPlugin.page, newPlugin.lastSearched)
            }
        }
        setNewPlugin({
            type: 'set-plugins',
            payload: res,
        });
    }

    const doSearch = (val) => {
        setSearching(true);
        addNewActions(
            {type: 'search-new', payload: {term: val}},
            (res)=>{
                searchNewCallback(res, val)
            }
        );
    }

    const onSearch = (event) => {
        if(searching){
            return;
        }

        const val = event.target.value;

        if(val.length !== 0 && val.length < 2 && !actions.searchNew) {
            return;
        }

        clearTimeout(typingTimer);

        setTypingTimer(setTimeout(()=>{
            actions.searchNew = val.length < 2 ? null : val;
            doSearch(val);
        }, searchTypingInterval));
    }

    const onAddPage = (paginating, searching, page, lastSearched) => {
        if(paginating || (searching && searching !== 'initial')){
            return;
        }
        let nextPage = page + 1;

        addNewActions(
            {type: 'search-new', payload: {term: lastSearched, page: nextPage}},
            (res) => {
                setNewPlugin({type: 'append-plugins', payload: res});
            }
        );
    }

    const icon = (icons) => {
        if(!icons) {
            return '';
        }
        if(icons['1x']) {
            return icons['1x'];
        }
        if(icons['2x']) {
            return icons['2x'];
        }
        if(icons['svg']) {
            return icons['svg'];
        }
        return icons.default;
    }

    const messageVisible = activating || uploading || uploadError || success;

    return (
        <div className={"add-new-plugin " +
            (newPlugin.show ? ' visible' : '') +
            (searching ? ' searching' : '')
        }>
            <div className={"wrapper"}>
                <div className={"inner"}>
                    <div className={"top-bar"}>
                        <h2>{!newPlugin.upload && !messageVisible ?
                            'Search for a plugin at WordPress.org:' + ((!searching && newPlugin.lastSearched) ? ` (results for \"${newPlugin.lastSearched}\")`: ''):
                            'Upload plugin from ZIP file'}</h2>
                        {!newPlugin.upload && !messageVisible && <div className={"search-box"}>
                            <input
                                type={"text"}
                                placeholder={"Search"}
                                onKeyUp={onSearch}
                                name={"action-search-input"}
                                value={searchInput}
                                onChange={(e)=>{
                                    setSearchInput(e.target.value);
                                }}
                            />
                            {searchInput && <div className={"clear-input"}>
                                <CButton
                                    title={"Clear"}
                                    onClick={()=>{
                                        setSearching('initial');
                                        setSearchInput('');
                                        doSearch('');
                                    }}><DashIcon icon={"no"}/></CButton>
                            </div>}
                        </div>}
                        {
                            (!newPlugin.upload && !messageVisible) ?
                            <div className={"actions"}>
                                <CButton onClick={()=>{
                                    setNewPlugin({type: 'upload-show'});
                                }} >
                                    <DashIcon icon={"upload"}/>&nbsp;
                                    <span>Upload</span>
                                </CButton>
                                <CButton classes="red" onClick={()=>{
                                    setNewPlugin({type: 'hide'});
                                    setSearching('initial');
                                    //TODO: load plugins again here to refresh the list
                                    // pluginsActions({type: 'load'}, (plugins) => {
                                    //     setPlugins({type: 'load', payload: plugins});
                                    // });
                                }} >
                                    <DashIcon icon={"exit"}/>&nbsp;
                                    <span>Back</span>
                                </CButton>
                            </div>
                                :
                                <>
                                    <span>&nbsp;</span>
                                    <CButton
                                        classes="red"
                                        onClick={()=>{
                                            setUploadError(null);
                                            setNewPlugin({type: 'upload-hide'});
                                        }} >
                                        <DashIcon icon={"exit"}/>&nbsp;
                                        <span>Back</span>
                                    </CButton>
                                </>

                        }
                    </div>
                    {activating && <div className={"activating upload-status"}>Activating...</div>}
                    {uploading && <div className={"activating upload-status"}>Uploading...</div>}
                    {uploadError && <div className={"upload-error upload-status"}>{uploadError}</div>}
                    {uploadError && uploadErrorDetails && <div className={"upload-error-details upload-status"} dangerouslySetInnerHTML={{__html: uploadErrorDetails}}></div>}
                    {success && <div className={"success-message upload-status"}>Success!</div>}

                    <div className={"message-actions"}>

                        {(success || uploadError) && <CButton classes="red" onClick={()=>{
                            setUploadError(null);
                            setSuccess(false);
                            setNewPlugin({type: 'upload-hide'});
                        }} >
                            <DashIcon icon={"exit"}/>&nbsp;
                            <span>Back</span>
                        </CButton>}

                        {uploadError && <CButton onClick={()=>{
                            setUploadError(null);
                            jQuery('#pluginzip').val('')
                            setNewPlugin({type: 'upload-show'});
                        }} >
                            <DashIcon icon={"image-rotate"}/>&nbsp;
                            <span>Try uploading again</span>
                        </CButton>}

                        {success && <CButton onClick={()=>{
                            setUploadError(null);
                            setSuccess(false);
                            jQuery('#pluginzip').val('')
                            setNewPlugin({type: 'upload-show'});
                        }} >
                            <DashIcon icon={"image-rotate"}/>&nbsp;
                            <span>Upload another one</span>
                        </CButton>}
                    </div>
                    {!newPlugin.upload && (searching ?
                        <SearchingLoader text={searching === 'initial'? 'Loading...' :'Searching...'} />
                        :
                        <>
                            {newPlugin.plugins.length === 0 ?<div className={"zero-results"}>0 results returned. Please try using different search term</div>:''}
                        <div className={"metabox-holder plugins-list"}>
                        {!messageVisible && newPlugin.plugins.map((plugin, key) => {
                            const pluginName = decodeEntity(plugin.name);
                            const mainName = pluginName.split(' – ')[0];
                            const restName = pluginName.slice(mainName.length + 3, pluginName.length);
                            return (
                                <div className={'plugin-item active visible postbox'} key={key}>
                                    <div className={"content"} >
                                        <h2>{mainName}</h2>
                                        <div className={"message-box" + (plugin.errors ? ' error' : (
                                            plugin.installed && plugin.installed !== true ? ' success' :''
                                        ))}>
                                            <CButton
                                                title={"Close"}
                                                style={{
                                                    backgroundColor: 'red'
                                                }}
                                                classes={"exit"}
                                                onClick={(e)=>{
                                                    e.preventDefault();
                                                    plugin.installed = true;
                                                    plugin.errors = '';
                                                    setNewPlugin({
                                                        type: 'update-plugin',
                                                        payload: plugin,
                                                    });
                                            }}>X</CButton>
                                            <div dangerouslySetInnerHTML={{
                                                __html: plugin.errors ? plugin.errors : (
                                                    plugin.installed &&
                                                    plugin.installed !== true ?
                                                        plugin.installed : ''
                                                )
                                            }}></div>
                                        </div>
                                        <p>{restName}</p>
                                        <div className={"top-section"}>
                                            <img className={"image"} onError={(e)=>{
                                                e.target.src = plugna.session.path + 'resources/images/plugin-blank.png';
                                            }} src={icon(plugin.icons)}  />
                                            <div className={"info"}>
                                                <p dangerouslySetInnerHTML={{__html: plugin.short_description}}></p>
                                                <div className={"actions"}>
                                                    <CButton secondary
                                                             wired
                                                             classes={"thickbox open-plugin-details-modal more-info"}
                                                    link={"/wp-admin/plugin-install.php?tab=plugin-information&plugin="+plugin.slug+"&TB_iframe=true&width=600&height=550"}
                                                    >More Info</CButton>
                                                    {plugin.installed && <p className={"done"}>DONE!</p>}
                                                    {!plugin.installed && <CButton onClick={(e)=>{
                                                        e.preventDefault();
                                                        e.stopPropagation();

                                                        plugin.installing = true;

                                                        setNewPlugin({
                                                            type: 'update-plugin',
                                                            payload: plugin,
                                                        });

                                                        Client.installNewFromWPOrg(plugin.slug)
                                                            .then((message) =>{
                                                                const parts = message.split('|||');
                                                                let output = parts[0];
                                                                const isSuccessFulInstallation = parts[0].indexOf(plugna.translations.plugin_installed_successfully) !== -1;
                                                                let data = JSON.parse(parts[1]);
                                                                if(data.success){
                                                                    data = JSON.parse(data.data);
                                                                }
                                                                //TODO: Check if output message is good
                                                                //before activating, use strings lang
                                                                plugin.installing = false;

                                                                if(!isSuccessFulInstallation) {
                                                                    plugin.errors = output;
                                                                    setNewPlugin({
                                                                        type: 'update-plugin',
                                                                        payload: plugin,
                                                                    });
                                                                    return;
                                                                }

                                                                plugin.activating = true;

                                                                setNewPlugin({
                                                                    type: 'update-plugin',
                                                                    payload: plugin,
                                                                });
                                                                Client.activatePlugin(data.message)
                                                                    .then(res => {
                                                                        plugin.activating = false;
                                                                        plugin.installed = output + '<p>'+plugna.translations.plugin_activated+'</p>';
                                                                        setNewPlugin({
                                                                            type: 'update-plugin',
                                                                            payload: plugin,
                                                                        });
                                                                    });
                                                            })
                                                            .catch(e => {
                                                                console.log('pi error', e);
                                                            });
                                                    }}>{plugin.installing ?
                                                        'Installing...     ': (
                                                            plugin.activating ? 'Activating...     ' : 'Install & Activate'
                                                        )}</CButton>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                            {newPlugin.plugins.length !== 0 &&
                                !newPlugin.upload &&
                                !uploading &&
                                !activating &&
                                !success &&
                                !uploadError &&
                                <SearchingLoader
                                    noLoader={newPlugin.pagesLoaded}
                                    classes={'paginating'}
                                    text={!newPlugin.pagesLoaded? `Loading page ${newPlugin.page + 1} / ${newPlugin.pages} ...` : 'All pages loaded'}
                                        />
                            }
                    </>)}
                </div>
            </div>
        </div>
    );
}

export default NewPlugin;