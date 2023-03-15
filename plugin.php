<?php

/**
 *
 * @link              https://plugna.com
 * @since             0.1
 * @package           Plugna
 *
 * @wordpress-plugin
 * Plugin Name:       Plugna
 * Plugin URI:        https://plugna.com
 * Description:       Streamlined and efficient plugin management experience. Plugna saves you time and makes managing your WordPress plugins a breeze.
 * Version:           1.0.3
 * Author:            Plugna
 * Donate link:       https://plugna.com/vip/
 * Author URI:        https://plugna.com/
 * License:           GPL-2.0+
 * License URI:       https://www.gnu.org/licenses/gpl.txt
 * Text Domain:       plugna
 * Domain Path:       /languages
 */

// Check that the file is not accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    die( 'We\'re sorry, but you can not directly access this file.' );
}

require_once plugin_dir_path( __FILE__ ) . 'src/Plugna.php';

if( //Use plugin only in JSON wp-api and on Plugna page
    (isset($_GET['page']) && $_GET['page'] === 'plugna') ||
    (strpos($_SERVER['REQUEST_URI'], '/wp-json/plugna') !== false)) {
    require_once plugin_dir_path( __FILE__ ) . 'settings.php';
    new Plugna;
} else if(is_admin()) {
    Plugna::adminMenu();
}