<?php

// Check that the file is not accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    die( 'We\'re sorry, but you can not directly access this file.' );
}

/**
 * The class responsible for fetching and managing multiple plugins.
 */
class Plugins
{
    protected $raw;
    protected $plugins = [];

    public function __construct($rawPlugins)
    {
        $auto_updates = (array) get_site_option( 'auto_update_plugins', array() );

        foreach ((array)$rawPlugins as $path => $rawPlugin) {
            if($path === 'plugna/plugin.php'){
                continue;
            }
            if(empty($rawPlugin['plugin'])){
                $rawPlugin['plugin'] = $path;
            }
            //TODO: check for empty slug as well
//            if(empty($rawPlugin['slug'])){
//                $rawPlugin['slug'] = //add slug here
//            }

            $rawPlugin['auto-updates-enabled'] = in_array($path, $auto_updates);
            $this->plugins[] = (new Plugin($rawPlugin))->get();
        }
    }

    public function all()
    {
        return $this->plugins;
    }
}