/**
 * Frontend-only behaviour for villacde-core/hero.
 *
 * Ported from the static site's js/main.js:
 *  - lines 88-95: force muted autoplay on the hero background video
 *    (iOS/Safari need `muted`/`defaultMuted` set in JS, not just the
 *    attribute, before calling play()).
 *  - lines 237-260: the video tour modal — open on play-button click
 *    (playing the tour video WITH sound, since play() here runs inside
 *    the click handler's user-gesture context), close on Escape, a
 *    backdrop click, or the × button, resetting playback each time.
 *
 * Loaded via block.json's "viewScript", so this never runs in the editor.
 */
( function () {
	'use strict';

	function initHero( root ) {
		var video = root.querySelector( '.villacde-hero__video' );
		if ( video ) {
			video.muted = true;
			video.defaultMuted = true;
			var bgPlay = video.play();
			if ( bgPlay && bgPlay.catch ) {
				bgPlay.catch( function () {
					/* Autoplay blocked — the poster frame stays visible. */
				} );
			}
		}

		var playBtn = root.querySelector( '[data-villacde-hero-play]' );
		var modal = root.querySelector( '[data-villacde-hero-modal]' );
		var tourVideo = root.querySelector(
			'[data-villacde-hero-tour-video]'
		);
		var closeBtn = root.querySelector( '[data-villacde-hero-close]' );

		if ( ! playBtn || ! modal || ! tourVideo ) {
			return;
		}

		var lastFocus = null;

		function openModal() {
			lastFocus = playBtn;
			modal.hidden = false;
			document.body.classList.add( 'villacde-hero-modal-open' );
			tourVideo.currentTime = 0;
			var tourPlay = tourVideo.play();
			if ( tourPlay && tourPlay.catch ) {
				tourPlay.catch( function () {
					/* Native controls still let the visitor hit play. */
				} );
			}
			if ( closeBtn ) {
				closeBtn.focus();
			}
		}

		function closeModal() {
			if ( modal.hidden ) {
				return;
			}
			tourVideo.pause();
			tourVideo.currentTime = 0;
			modal.hidden = true;
			document.body.classList.remove( 'villacde-hero-modal-open' );
			if ( lastFocus ) {
				lastFocus.focus();
			}
		}

		playBtn.addEventListener( 'click', openModal );

		modal.addEventListener( 'click', function ( e ) {
			if ( e.target.closest( '[data-villacde-hero-close-trigger]' ) ) {
				closeModal();
			}
		} );

		document.addEventListener( 'keydown', function ( e ) {
			if ( modal.hidden ) {
				return;
			}
			if ( e.key === 'Escape' ) {
				closeModal();
			}
		} );
	}

	function init() {
		var roots = document.querySelectorAll( '.wp-block-villacde-core-hero' );
		for ( var i = 0; i < roots.length; i++ ) {
			initHero( roots[ i ] );
		}
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
