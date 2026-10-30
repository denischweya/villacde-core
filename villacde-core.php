<?php
/**
 * Plugin Name: Villa CDE Core
 * Description: Custom blocks for the Villa CDE WordPress site.
 * Version: 0.1.0
 * Requires at least: 6.7
 * Requires PHP: 7.4
 * Author: Villa CDE
 * Text Domain: villacde-core
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'VILLACDE_CORE_PATH', plugin_dir_path( __FILE__ ) );

/**
 * Register every block under build/blocks/* — each subdirectory's
 * block.json is picked up automatically by register_block_type().
 */
function villacde_core_register_blocks() {
    $blocks_dir = VILLACDE_CORE_PATH . 'build/blocks';
    if ( ! is_dir( $blocks_dir ) ) {
        return;
    }
    foreach ( glob( $blocks_dir . '/*', GLOB_ONLYDIR ) ?: array() as $block_dir ) {
        if ( file_exists( $block_dir . '/block.json' ) ) {
            register_block_type( $block_dir );
        }
    }
}
add_action( 'init', 'villacde_core_register_blocks' );
