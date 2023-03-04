<?php

// Check that the file is not accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    die( 'We\'re sorry, but you can not directly access this file.' );
}

if( ! defined( 'PLUGNA_DEV' ) ) {
    define( 'PLUGNA_DEV', true );
}