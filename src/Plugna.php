<?php

// Check that the file is not accessed directly.
if (!defined('ABSPATH')) {
    die('We\'re sorry, but you can not directly access this file.');
}

/**
 * Main Plugna class
 */
class Plugna
{
    protected $api;

    public function __construct()
    {
        self::adminMenu();

        require_once plugin_dir_path(__FILE__) . 'PlugnaApi.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';

        $this->api = new PlugnaApi;

        add_action('admin_enqueue_scripts', array(&$this, 'enqueue'));
    }

    public static function pluginDir($url)
    {
        return trailingslashit(plugin_dir_url(__DIR__)) . $url;
    }


    public static function adminMenu()
    {
        //Run only on wp-admin
        if (is_admin()) {
            add_action('admin_menu', 'Plugna::admin_menu');
        }
    }

    public static function admin_menu()
    {
        global $menu;

        $menuTitle = 'Plugins';

        foreach ((array)$menu as $key => $item) {
            if (isset($item[5]) && $item[5] === 'menu-plugins') {
                $menuTitle = $item[0];
                unset($menu[$key]);
            }
        }

        add_menu_page(
            'Plugins (Plugna)',
            $menuTitle,
            'activate_plugins',
            'plugna',
            'Plugna::admin_page',
            plugins_url('resources/icons/plugna-logo-small-white.svg',dirname(__FILE__) . '../'),
            65);
    }

    public function enqueue()
    {
        wp_enqueue_style(
            'plugna-css',
            self::pluginDir('css/main.css'),
            PLUGNA_DEV ? time() : null,
            true
        );

        wp_enqueue_script(
            'plugna-script',
            self::pluginDir('js/script.js'),
            ['wp-element'],
            PLUGNA_DEV ? time() : null,
            true
        );

        add_thickbox();

    }

    public static function colors()
    {
        global $_wp_admin_css_colors;
        $current_color = get_user_option('admin_color');
        ?>
        <style>
            #content-plugna {
                --plugna-color-1: <?php echo esc_attr($_wp_admin_css_colors[$current_color]->colors[0]); ?>;
                --plugna-color-2: <?php echo esc_attr($_wp_admin_css_colors[$current_color]->colors[1]); ?>;
                --plugna-color-3: <?php echo esc_attr($_wp_admin_css_colors[$current_color]->colors[2]); ?>;
                --plugna-color-4: <?php echo esc_attr($_wp_admin_css_colors[$current_color]->colors[3]); ?>;
                --plugna-color-icon-base: <?php echo esc_attr($_wp_admin_css_colors[$current_color]->icon_colors['base']); ?>;
                --plugna-color-icon-current: <?php echo esc_attr($_wp_admin_css_colors[$current_color]->icon_colors['current']); ?>;
                --plugna-color-icon-focus: <?php echo esc_attr($_wp_admin_css_colors[$current_color]->icon_colors['focus']); ?>;
                --plugna-color-lightgreen: #00c791;
            }
        </style>
        <?php
    }

    public static function admin_page()
    {
        self::colors();
        $plugnaSettings = new PlugnaSettings();

        ?>
        <script type="text/javascript">
            var plugna = JSON.parse('<?php echo wp_kses_post($plugnaSettings->getAll()) ?: '{}'; ?>');
            plugna.session = {
                nonce: '<?php echo esc_attr(wp_create_nonce('wp_rest')); ?>',
                nonces: <?php echo wp_kses_post(json_encode(PlugnaApi::get_routes_nonces())) ?>,
                path: '<?php echo esc_url(plugins_url('/',dirname(__FILE__) . '../')) ?>',
                pathAdmin: '<?php echo esc_url(admin_url()) ?>',
            }
            plugna.translations = {
                plugin_installed_successfully: '<?php echo wp_kses_post(__( 'Plugin installed successfully.' )); ?>',
                plugin_activated: '<?php echo wp_kses_post(__( 'Plugin activated.' )); ?>',
            }
        </script>
        <div class="wrap">
            <h1>
                <span>Plugna</span>
                <a href="<?php echo esc_url(admin_url('plugins.php')); ?>" class="button button-secondary" >
                    <span class="dashicons dashicons-undo"></span> Switch to WP manager
                </a>
                <span class="plugna-version-text">v<?php echo PLUGNA_VERSION ?></span>
            </h1>
            <div id="content-plugna"></div>
            <div class="plugna-upload upload-plugin-wrap">
                <?php
                /** This action is documented in wp-admin/plugin-install.php */
                do_action( 'install_plugins_upload' );
                ?>
            </div>
        </div>
        <?php

    }
}