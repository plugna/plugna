<?php
// Check that the file is not accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    die( 'We\'re sorry, but you can not directly access this file.' );
}

/**
 * Plugna API class, containing all the methods for fetching and managing plugins used in Plugna.
 */
class PlugnaApi
{
    const CAN_ACTIVATE_PLUGINS = 'activate_plugins';
    const CAN_EDIT_PLUGINS = 'edit_plugins';
    const CAN_INSTALL_PLUGINS = 'install_plugins';
    const CAN_UPDATE_PLUGINS = 'update_plugins';
    const CAN_DELETE_PLUGINS = 'delete_plugins';
    const CAN_MANAGE_NETWORK_PLUGINS = 'manage_network_plugins';
    const CAN_UPLOAD_PLUGINS = 'upload_plugins';
    const IS_ADMINISTRATOR = 'administrator';

    protected static $getRoutes = [
        'list'
    ];

    protected static $postRoutes = [
        'activate_plugin',
        'deactivate_plugin',
        'toggle_plugin',
        'toggle_plugins',
        'delete_plugin',
        'delete_plugins',
        'force_delete_plugin',
        'toggle_auto_updates',
        'toggle_auto_updates_multiple',
        'update_plugin',
        'update_plugins',
        'update_settings',
        'update_actions',
        'update_filters',
        'search_new',
        'install_from_wporg_plugin'
    ];

    public function __construct()
    {
        include_once ABSPATH . 'wp-admin/includes/plugin.php';
        require_once ABSPATH . 'wp-admin/includes/update.php';
        require_once ABSPATH . 'wp-admin/includes/misc.php';
        include_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
        include_once ABSPATH . 'wp-admin/includes/plugin-install.php';
        include_once ABSPATH . 'wp-admin/includes/class-plugin-upgrader.php';
        include_once plugin_dir_path(__FILE__) . 'data/PlugnaPlugin.php';
        include_once plugin_dir_path(__FILE__) . 'data/PlugnaPlugins.php';
        include_once plugin_dir_path(__FILE__) . 'data/PlugnaSettings.php';

        add_action('rest_api_init', function () {
            $this->get_routes(self::$getRoutes);
            $this->post_routes(self::$postRoutes);
        });
    }

    public static function get_routes_nonces(){
        $nonces = [];
        foreach(self::get_all_routes() as $route){
            $nonces[$route] = wp_create_nonce($route);
        }
        return (object) $nonces;
    }

    public static function get_all_routes(){
        return array_merge(self::$getRoutes, self::$postRoutes);
    }

    protected function get_routes($routes){
        foreach($routes as $route){
            $this->register_rest_route($route, $route, 'GET');
        }
    }

    protected function post_routes($routes){
        foreach($routes as $route){
            $this->register_rest_route($route, $route);
        }
    }

    protected function register_rest_route($route, $method, $httpMethod = 'POST'){
        register_rest_route('plugna/v1', $route, array(
            'methods' => $httpMethod,
            'callback' => array(&$this, $method),
            'permission_callback' => function () {
                return current_user_can( 'administrator' );
            }
        ));
    }

    protected function verifyNonce(\WP_REST_Request $request = null){

        $route = $request->get_attributes()['callback'][1];
        if(!wp_verify_nonce($request->get_param('_wpnonce'), 'wp_rest')){
            throw new Exception('Invalid rest nonce');
        };
        if(!wp_verify_nonce($request->get_param('plugna_nonce'), $route)){
            throw new Exception('Invalid Plugna nonce');
        }
        header('new-nonce: ' . wp_create_nonce($route));
    }

    protected function suppressWarnings(){
        error_reporting(E_ERROR | E_PARSE);
    }

    /**
     * Callback
     * @throws Exception
     */
    public function list(\WP_REST_Request $request)
    {
        $this->verifyNonce($request);
        $this->suppressWarnings();
        $this->allowIf(self::CAN_INSTALL_PLUGINS);
        $this->response($this->get_plugins());
    }

    /**
     * @return array|mixed
     * @throws Exception
     */
    public function get_plugins(){

        require_once ABSPATH . 'wp-admin/includes/list-table.php';
        require_once ABSPATH . 'wp-admin/includes/template.php';
        require_once ABSPATH . 'wp-admin/includes/update.php';
        require_once ABSPATH . 'wp-admin/includes/misc.php';
        require_once ABSPATH . 'wp-admin/includes/screen.php';
        require_once ABSPATH . 'wp-admin/includes/class-wp-screen.php';

        if ( ! class_exists( 'WP_List_Table' ) ) {
            require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
        }

        $wp_list_table = _get_list_table( 'WP_Plugins_List_Table' );
        $wp_list_table->prepare_items();

        return (new PlugnaPlugins($wp_list_table->items))->all();
    }

    /**
     * Callback
     * @throws Exception
     */
    public function activate_plugin(\WP_REST_Request $request = NULL)
    {
        $this->verifyNonce($request);
        $this->allowIf(self::CAN_ACTIVATE_PLUGINS);
        $plugin = self::plugin_from_request($request);
        $this->responseSuccess($plugin->activate());
    }

    /**
     * Callback
     * @throws Exception
     */
    public function toggle_plugin(\WP_REST_Request $request = NULL)
    {
        $this->verifyNonce($request);
        $this->allowIf(self::CAN_ACTIVATE_PLUGINS);
        $plugin = self::plugin_from_request($request);
        $this->responseSuccess($plugin->toggle());
    }

    /**
     * Callback
     * @throws Exception
     */
    public function toggle_plugins(\WP_REST_Request $request = NULL)
    {
        $this->verifyNonce($request);
        $this->allowIf(self::CAN_ACTIVATE_PLUGINS);

        $plugins = self::plugins_from_request($request);
        $resp = [];
        foreach ($plugins as $plugin) {
            $resp[$plugin->id()] = $plugin->toggle();
        }
        $this->responseSuccess($resp);
    }

    /**
     * Callback
     * @throws Exception
     */
    public function delete_plugin(\WP_REST_Request $request = NULL)
    {
        $this->verifyNonce($request);
        $this->allowIf(self::CAN_DELETE_PLUGINS);
        $plugin = self::plugin_from_request($request);
        $this->responseSuccess($plugin->delete());
    }

    /**
     * Callback
     * @throws Exception
     */
    public function delete_plugins(\WP_REST_Request $request = NULL)
    {
        $this->verifyNonce($request);
        $this->allowIf(self::CAN_DELETE_PLUGINS);
        $plugins = self::plugins_from_request($request);

        $resp = [];
        /** @var PlugnaPlugin $plugin */
        foreach ($plugins as $plugin) {
            $resp[$plugin->id()] = $plugin->force_delete();
        }
        $this->responseSuccess($resp);
    }

    /**
     * Callback
     * @throws Exception
     */
    public function deactivate_plugin(\WP_REST_Request $request = NULL)
    {
        $this->verifyNonce($request);
        $this->allowIf(self::CAN_ACTIVATE_PLUGINS);
        $plugin = self::plugin_from_request($request);
        $this->responseSuccess($plugin->deactivate());
    }

    /**
     * Callback
     * @throws Exception
     */
    public function force_delete_plugin(\WP_REST_Request $request = NULL)
    {
        $this->verifyNonce($request);
        $this->allowIf(self::CAN_DELETE_PLUGINS);
        $plugin = self::plugin_from_request($request);
        $this->responseSuccess($plugin->force_delete());
    }

    /**
     * Callback
     * @throws Exception
     */
    public function toggle_auto_updates(\WP_REST_Request $request = NULL)
    {
        $this->verifyNonce($request);
        $this->allowIf(self::CAN_UPDATE_PLUGINS);
        $plugin = self::plugin_from_request($request);
        $this->responseSuccess($plugin->toggle_auto_updates());
    }

    /**
     * Callback
     * @throws Exception
     */
    public function toggle_auto_updates_multiple(\WP_REST_Request $request = NULL)
    {
        $this->verifyNonce($request);
        $this->allowIf(self::CAN_UPDATE_PLUGINS);
        $plugins = self::plugins_from_request($request);
        $res = [];
        foreach ($plugins as $plugin) {
            $res[$plugin->id()] = $plugin->toggle_auto_updates();
        }
        $this->responseSuccess($res);
    }

    /**
     * Callback
     * @throws Exception
     */
    public function update_plugin(\WP_REST_Request $request = NULL)
    {
        $this->verifyNonce($request);
        $this->allowIf(self::CAN_UPDATE_PLUGINS);
        $plugin = self::plugin_from_request($request);
        $this->response(['success_messages' => $plugin->update()]);
    }

    /**
     * Callback
     * @throws Exception
     */
    public function update_plugins(\WP_REST_Request $request = NULL)
    {
        $this->verifyNonce($request);
        $this->allowIf(self::CAN_UPDATE_PLUGINS);
        $plugins = self::plugins_from_request($request);
        $res = [];
        foreach ($plugins as $plugin) {
            $res[$plugin->id()] = $plugin->update();
        }
        $this->responseSuccess($res);
    }

    /**
     * Callback
     * @throws Exception
     */
    public function update_settings(\WP_REST_Request $request = NULL)
    {
        $this->verifyNonce($request);
        $this->allowIf(self::IS_ADMINISTRATOR);

        $settings = new PlugnaSettings();
        $settings->appendJSON($request->get_body());
        $settings->persist();

        $this->response(['success_messages' => get_option('plugna')]);
    }

    /**
     * Callback
     */
    public function update_actions(\WP_REST_Request $request = NULL)
    {
        $this->verifyNonce($request);
        $this->allowIf(self::IS_ADMINISTRATOR);
        $data = json_decode(get_option('plugna'));
        $data->actions = json_decode($request->get_body());
        update_option('plugna', json_encode($data));
        $this->response(['success_messages' => get_option('plugna')]);
    }

    /**
     * Callback
     * @param WP_REST_Request|NULL $request
     * @return void
     * @throws Exception
     */
    public function update_filters(\WP_REST_Request $request = NULL)
    {
        $this->verifyNonce($request);
        $this->allowIf(self::IS_ADMINISTRATOR);
        $data = json_decode(get_option('plugna'));
        $data->filters = json_decode($request->get_body());
        update_option('plugna', json_encode($data));
        $this->response(['success_messages' => get_option('plugna')]);
    }

    //TODO: get use of this
    /**
     *
     * * | Argument Name        | query_plugins | plugin_information | hot_tags | hot_categories |
     * | -------------------- | :-----------: | :----------------: | :------: | :------------: |
     * | `$slug`              | No            |  Yes               | No       | No             |
     * | `$per_page`          | Yes           |  No                | No       | No             |
     * | `$page`              | Yes           |  No                | No       | No             |
     * | `$number`            | No            |  No                | Yes      | Yes            |
     * | `$search`            | Yes           |  No                | No       | No             |
     * | `$tag`               | Yes           |  No                | No       | No             |
     * | `$author`            | Yes           |  No                | No       | No             |
     * | `$user`              | Yes           |  No                | No       | No             |
     * | `$browse`            | Yes           |  No                | No       | No             |
     * | `$locale`            | Yes           |  Yes               | No       | No             |
     * | `$installed_plugins` | Yes           |  No                | No       | No             |
     * | `$is_ssl`            | Yes           |  Yes               | No       | No             |
     * | `$fields`            | Yes           |  Yes               | No       | No             |
     * @param WP_REST_Request|NULL $request
     * @return void
     * Callback
     */
    public function search_new(\WP_REST_Request $request = NULL){
        $this->verifyNonce($request);
        $api = plugins_api( 'query_plugins', [
            'search' => $request->get_param('s'),
            'page' => $request->get_param('p'),
        ] );

        $installedPluginsSlugs = [];
        foreach ((array) $this->get_plugins() as $p) {
            if(empty($p->slug)) {
                try{
                    $slug = explode('/', $p->plugin)[0];
                    $p->slug = $slug;
                }catch (\Exception $e){}
            }
            if(!empty($p->slug)) {
                $installedPluginsSlugs[] = $p->slug;
            }
        }

        $filteredPlugins = [];
        foreach ((array) $api->plugins as $key => $plugin) {
            if(!in_array($plugin['slug'], $installedPluginsSlugs)) { //If plugin is not installed
                $api->plugins[$key]['compatible_php'] = is_php_version_compatible( $plugin['requires_php'] );
                $api->plugins[$key]['compatible_wp'] = is_wp_version_compatible( $plugin['requires_wp'] );
                $api->plugins[$key]['tested_wp']  = ( empty( $plugin['tested'] ) || version_compare( get_bloginfo( 'version' ), $plugin['tested'], '<=' ) );
                $filteredPlugins[] = $api->plugins[$key];
            }
        }
        $api->plugins = $filteredPlugins;

        if(sizeof($api->plugins) == 0){
            //If there are more pages, load the next one
            if($api->info['page'] < $api->info['pages']){
                $request->set_param('p', $request->get_param('p') + 1);
                $this->search_new($request);
                return;
            }
        }

        $this->response(['data' => $api]);
    }

    /**
     * Callback
     *
     * @param WP_REST_Request|NULL $request
     * @return void
     * @throws Exception
     */
    public function install_from_wporg_plugin(\WP_REST_Request $request = NULL){
        $this->verifyNonce($request);
        try {
            $slug = $request->get_param('slug');

            if(empty($slug)) {
                $this->responseError('Plugin slug is required');
            }

            $api = plugins_api(
                'plugin_information',
                array(
                    'slug'   => $slug,
                    'fields' => array(
                        'sections' => false,
                    ),
                )
            );

            if ( is_wp_error( $api ) ) {
                wp_die( $api );
            }

            $upgrader = new Plugin_Upgrader( new Plugin_Installer_Skin( [] ));
            $upgrader->install( $api->download_link );
            echo '|||';
            $this->responseSuccess($this->plugin_from_slug($slug));
            return;
        }catch (\Exception $e){
            $this->responseError($e->getMessage());
        }
    }

    /**
     * @throws Exception
     */
    protected function plugin_from_request($request){

        $this->suppressWarnings();
        $rawPluginData = json_decode($request->get_body());
        return PlugnaPlugin::fromRequest($rawPluginData);
    }

    protected function plugin_from_slug($slug){

        try {
            if(empty($slug)) {
                return null;
            }

            $this->suppressWarnings();

            $plugins = $this->get_plugins();
            //print_r($plugins);die;
            foreach ((array) $plugins as $p) {
                if(strpos($p->plugin, $slug .'/') === 0) {
                    return $p;
                }
            }
        }catch (\Exception $e){
            echo wp_kses_post($e->getMessage());die;
        }
        return null;
    }

    protected function plugins_from_request($request){

        $this->suppressWarnings();
        $rawPluginsData = json_decode($request->get_body());
        $plugins = [];
        foreach ((array) $rawPluginsData as $rawPluginData){
            $plugins[] = PlugnaPlugin::fromRequest($rawPluginData);
        }
        return $plugins;
    }

    protected function responseSuccess($message){
        $this->response([
            'success' => true,
            'message' => $message
        ]);
        exit;
    }

    protected function responseError($message, $code = ''){
        wp_send_json_error([
            'code' => $code,
            'message' => $message
        ]);
        exit;
    }

    protected function response($data){
        wp_send_json_success((json_encode($data)));
        exit;
    }

    protected function allowIf($capability){
        if(!current_user_can( $capability )){
            //TODO: Return JSON error instead
            throw new Exception('You do not have permission to do this. cap: ' . $capability);
        };
    }

    protected function checkPermissions(){
        if(!current_user_can( 'manage_plugins' )){
            //TODO: Return JSON error instead
            throw new Exception('You do not have permission to do this.');
        };
    }
}