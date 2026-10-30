/**
 * Frontend-only behaviour for villacde-core/amenity-tabs.
 *
 * Ported from the static site's js/main.js lines 125-143 (the WAI-ARIA
 * tabs pattern): clicking a tab selects it, and ArrowRight/ArrowLeft move
 * selection (and focus) to the next/previous tab, wrapping around. The
 * `selectTab` logic below is otherwise unchanged from the original —
 * the only addition is scoping each tablist to its own block instance
 * (via `root.querySelectorAll`) rather than querying `[role="tab"]`
 * globally, so multiple instances of this block on one page don't
 * interfere with each other.
 *
 * Loaded via block.json's "viewScript", so this never runs in the editor.
 */
( function () {
	'use strict';

	function initAmenityTabs( root ) {
		var tabs = Array.prototype.slice.call(
			root.querySelectorAll( '[role="tab"]' )
		);
		if ( ! tabs.length ) {
			return;
		}

		function selectTab( i, focus ) {
			tabs.forEach( function ( tab, j ) {
				var on = i === j;
				tab.setAttribute( 'aria-selected', on ? 'true' : 'false' );
				tab.tabIndex = on ? 0 : -1;
				var panel = document.getElementById(
					tab.getAttribute( 'aria-controls' )
				);
				if ( panel ) {
					panel.hidden = ! on;
				}
			} );
			if ( focus ) {
				tabs[ i ].focus();
			}
		}

		tabs.forEach( function ( tab, i ) {
			tab.addEventListener( 'click', function () {
				selectTab( i );
			} );
			tab.addEventListener( 'keydown', function ( e ) {
				if ( e.key === 'ArrowRight' ) {
					e.preventDefault();
					selectTab( ( i + 1 ) % tabs.length, true );
				}
				if ( e.key === 'ArrowLeft' ) {
					e.preventDefault();
					selectTab( ( i - 1 + tabs.length ) % tabs.length, true );
				}
			} );
		} );
	}

	function init() {
		var roots = document.querySelectorAll(
			'.wp-block-villacde-core-amenity-tabs'
		);
		for ( var i = 0; i < roots.length; i++ ) {
			initAmenityTabs( roots[ i ] );
		}
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
