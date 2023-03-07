<?php
// Check that the file is not accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    die( 'We\'re sorry, but you can not directly access this file.' );
}

/**
 * The main wrapper for the plugin data used by Plugna
 *
 */
class PlugnaPlugin
{
    protected $name;
    protected $plugin;
    protected $slug;
    protected $isActive;
    protected $isInactive;
    protected $isActiveForNetwork;
    protected $isPaused;
    protected $isAutoUpdatesEnabled;
    protected $newVersion;
    protected $version;
    protected $description;
    protected $updateAvailable;
    protected $icon;
    protected $updateSupported;
    protected $nonce;


    protected $raw;

    public function __construct($raw = [])
    {
        $this->plugin =             $raw['plugin'];
        $this->slug =               $raw['slug'];
        $this->newVersion =         $raw['new_version'];
        $this->version =            $raw['Version'];
        $this->icon =               $raw['icons']['2x'] ?? null;

        $this->isActive =           is_plugin_active($this->plugin);
        $this->isInactive =         is_plugin_inactive($this->plugin);
        $this->isActiveForNetwork = is_plugin_active_for_network($this->plugin);
        $this->isPaused =           is_plugin_paused($this->plugin);
        $this->nonce =              $raw['nonce'] ?? '';
        $this->raw =                $raw;
        $this->name =               html_entity_decode($raw['Name']);
        $this->description =        $raw['Description'];
        $this->updateAvailable =    $this->version != $this->newVersion;

        //TODO: move out of loop!
        if(wp_is_auto_update_enabled_for_type( 'plugin' )){
            $this->updateSupported =    $raw['update-supported'];
            $this->isAutoUpdatesEnabled = $raw['auto-updates-enabled'];
        }
    }

    public static function fromRequest($raw){
        return new PlugnaPlugin([
            'plugin' => $raw->plugin,
            'name' => $raw->name
        ]);
    }

    public function id(){
        return $this->plugin;
    }

    public function get(){
        return (object) [
            'plugin' => $this->plugin,
            'version' => $this->version,
            'newVersion' => $this->newVersion,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'icon' => $this->icon,
            'autoUpdatesEnabled' => $this->isAutoUpdatesEnabled,
            'updateSupported' => $this->updateSupported, //if updates work at all
            'updateAvailable' => $this->updateAvailable, //if there's new updated version available
            'active' => $this->isActive,
            'inactive' => $this->isInactive,
            'networkActive' => $this->isActiveForNetwork,
            'paused' => $this->isPaused,
            'nonce' => wp_create_nonce('plugna_action_' . hash('sha1', $this->plugin))
        ];
    }

    public function toggle(){
        if($this->isInactive) {
            return $this->activate();
        }
        $this->deactivate();
        return 'deactivated';
    }

    public function deactivate(){
//        if($this->isInactive) {
//            throw new Exception('Plugin already inactive');
//        }

        deactivate_plugins([$this->plugin]);

        //TODO: Fetch here the fresh data before returning
        $this->isActive = false;
        $this->isInactive = true;
        $this->isActiveForNetwork = false;

        return 'deactivated';
    }

    public function activate(){
//        if($this->isActive) {
//            throw new Exception('Plugin already active');
//        }
        return activate_plugin($this->plugin);
    }

    public function delete(){
        if($this->isActive) {
            throw new Exception('Active plugin cannot be deleted directly. Use force delete or deactivate the plugin first.');
        }
        return delete_plugins([$this->plugin]);
    }

    public function force_delete(){
        if($this->isActive) {
            $this->deactivate();
        }

        //TODO: Add a security check to make sure server does not throw an error
        // when plugin is inactive, before deleting it
        //TODO: maybe use hook to check if it's deactivated?
        // do_action( 'deactivated_plugin', $plugin, $network_deactivating );
        $this->delete();
    }

    public function toggle_auto_updates(){
       //TODO: Find a secure way to check for auto-updates
    }

    public function update(){

        $pu = new Plugin_Upgrader();
        $pu->upgrade($this->plugin);
        echo '|'; //delimiter to split JSON from actual upgrade results

        return [
            $pu->strings['process_success'],
            $pu->strings['process_bulk_success']
        ];
    }
}