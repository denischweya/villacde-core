/**
 * Frontend-only behaviour for villacde-core/reviews-carousel.
 *
 * Ported from the static site's js/main.js lines 145-157 (the
 * "Reviews carousel" section): `showReview()` wraps the index with
 * `(i + reviews.length) % reviews.length` in both directions — prev
 * from the first review wraps to the last, next from the last wraps
 * back to the first — toggles each review's `hidden` attribute so only
 * one is ever visible, and updates the "`<n>` / `<total>`" counter. The
 * `showReview` logic below is otherwise unchanged from the original —
 * the only addition is scoping each carousel to its own block instance
 * (via `root.querySelectorAll`) rather than querying the page-global
 * `#reviews-track` / `#reviews-count` ids, so multiple instances of this
 * block on one page don't interfere with each other (same convention as
 * the amenity-tabs block's view.js).
 *
 * Loaded via block.json's "viewScript", so this never runs in the editor.
 */
( function () {
	'use strict';

	function initReviewsCarousel( root ) {
		var reviews = Array.prototype.slice.call(
			root.querySelectorAll( '.villacde-reviews-carousel__review' )
		);
		if ( ! reviews.length ) {
			return;
		}

		var countEl = root.querySelector(
			'.villacde-reviews-carousel__count'
		);
		var rv = 0;

		function showReview( i ) {
			rv = ( i + reviews.length ) % reviews.length;
			reviews.forEach( function ( r, j ) {
				r.hidden = j !== rv;
			} );
			if ( countEl ) {
				countEl.textContent = ( rv + 1 ) + ' / ' + reviews.length;
			}
		}

		Array.prototype.slice
			.call( root.querySelectorAll( '[data-rv]' ) )
			.forEach( function ( btn ) {
				btn.addEventListener( 'click', function () {
					showReview(
						rv + ( btn.getAttribute( 'data-rv' ) === 'next' ? 1 : -1 )
					);
				} );
			} );

		showReview( 0 );
	}

	function init() {
		var roots = document.querySelectorAll(
			'.wp-block-villacde-core-reviews-carousel'
		);
		for ( var i = 0; i < roots.length; i++ ) {
			initReviewsCarousel( roots[ i ] );
		}
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
