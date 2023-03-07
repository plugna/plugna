<?php

// Check that the file is not accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    die( 'We\'re sorry, but you can not directly access this file.' );
}

/**
 * The class responsible for fetching and managing multiple plugins.
 */
class PlugnaPlugins
{
    protected $raw;
    protected $plugins = [];

    public function __construct($rawPlugins)
    {
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

            $this->plugins[] = (new PlugnaPlugin($rawPlugin))->get();
        }
    }

    public function all()
    {
        return $this->plugins;
    }
}