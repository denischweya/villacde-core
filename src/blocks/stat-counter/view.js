/**
 * Frontend-only behaviour for villacde-core/stat-counter.
 *
 * Ported from the static site's js/main.js lines 97-123 ("Animated
 * counters"): once the stat scrolls into view, an IntersectionObserver
 * (threshold 0.35) fires a count-up from 0 to the target number over
 * 1800ms with a cubic ease-out (`1 - Math.pow(1 - t, 3)`), painting the
 * number plus its `data-suffix` (if any) on every frame. The observer
 * disconnects itself the moment it fires, so the animation runs once,
 * never re-triggering on a later scroll in/out/in — same as the
 * original's `io.disconnect(); runCounters();`.
 *
 * `prefers-reduced-motion: reduce` skips the animation entirely and
 * paints the final value immediately — the same `reduced` convention
 * as js/main.js line 15 (used there for the nav panel and video-tour
 * modal transitions, and here for the identical check in the original
 * counters code at line 106).
 *
 * Unlike the original — which observes a single shared `#stats`
 * wrapper and animates every counter on the page in lock-step — each
 * block instance here observes (and animates) itself, the same
 * "scope to this block instance" convention as the amenity-tabs and
 * reviews-carousel blocks' view.js, so multiple instances on one page
 * don't interfere with each other. Since the 4 stat-counter instances
 * in the hero pattern sit in the same row, they still trigger within
 * the same scroll frame in practice.
 *
 * Loaded via block.json's "viewScript", so this never runs in the editor.
 */
( function () {
	'use strict';

	var reduced =
		window.matchMedia &&
		window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

	function paint( el, v ) {
		el.textContent = v + ( el.getAttribute( 'data-suffix' ) || '' );
	}

	function runCounter( el ) {
		var target = +el.getAttribute( 'data-count' );
		if ( reduced ) {
			paint( el, target );
			return;
		}
		var dur = 1800;
		var t0 = performance.now();
		( function step( now ) {
			var t = Math.min( 1, ( now - t0 ) / dur );
			var e = 1 - Math.pow( 1 - t, 3 );
			paint( el, Math.round( target * e ) );
			if ( t < 1 ) {
				requestAnimationFrame( step );
			}
		} )( t0 );
	}

	function initStatCounter( root ) {
		var el = root.querySelector( '[data-count]' );
		if ( ! el ) {
			return;
		}

		/* Zero out the displayed number before animating up to it —
		   matches the original's `if (!reduced) counters.forEach(paint(el, 0))`
		   priming step. Skipped under reduced motion, same as the original,
		   so the static final value (already in the markup) never flickers. */
		if ( ! reduced ) {
			paint( el, 0 );
		}

		if ( 'IntersectionObserver' in window ) {
			var io = new IntersectionObserver(
				function ( entries ) {
					if (
						entries.some( function ( entry ) {
							return entry.isIntersecting;
						} )
					) {
						io.disconnect();
						runCounter( el );
					}
				},
				{ threshold: 0.35 }
			);
			io.observe( root );
		} else {
			runCounter( el );
		}
	}

	function init() {
		var roots = document.querySelectorAll(
			'.wp-block-villacde-core-stat-counter'
		);
		for ( var i = 0; i < roots.length; i++ ) {
			initStatCounter( roots[ i ] );
		}
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
