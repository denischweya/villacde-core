/**
 * Frontend-only behaviour for villacde-core/booking-form.
 *
 * Ported from the static site's js/main.js:
 *  - lines 270-486 ("Booking date range picker"): the two-month
 *    calendar date-range picker — month rendering, first-click-sets
 *    check-in/second-click-sets-check-out selection, roving-tabindex
 *    keyboard navigation (arrow keys, Home/End, PageUp/PageDown),
 *    min-date enforcement (no past dates), hover-preview ranging
 *    between the selected check-in and the hovered date, and the
 *    popover's open/close behaviour (outside click, Escape, Done).
 *  - lines 488-550 ("Booking form"): the submit handler that builds
 *    the WhatsApp deep-link message and opens `wa.me` in a new tab,
 *    and the "Send another request" reset handler.
 *
 * This is a near line-for-line port — the date math, string building,
 * and event-handling logic are unchanged. The only structural
 * adaptation is how the two original sections talk to each other: in
 * js/main.js both sections live inside one page-wide IIFE, but (being
 * `'use strict'`) a `function` declared inside the calendar section's
 * `if (...) { ... }` block is not visible to the later "Booking form"
 * code, so the original bridges the gap with `window.__drPaint` /
 * `window.__drReset` / `window.__drInvalid` globals. Here both
 * sections live in one `initBookingForm(root)` closure instead, so
 * they can call each other directly — functionally identical, but
 * without leaking globals that would make a second block instance on
 * the same page stomp on the first one's state.
 *
 * DOM lookups are scoped to this block instance via `data-villacde-*`
 * attributes on the markup save.js renders (instead of the static
 * site's page-global ids), matching the hero/amenity-tabs/
 * reviews-carousel/stat-counter blocks' view.js convention. The
 * two-month calendar's own generated markup (`.dr-month`, `.dr-days`,
 * `.is-start`, `.in-range`, `data-date`, `data-dr`, etc.) keeps the
 * static site's exact class/attribute names unchanged, since that
 * markup is pure JS string-building copied verbatim from the source
 * and style.scss ports the matching `.dr-*` CSS 1:1.
 *
 * Loaded via block.json's "viewScript", so this never runs in the editor.
 */
( function () {
	'use strict';

	var DOW = [ 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su' ];
	var MONTHS = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December',
	];

	function $$( s, r ) {
		return Array.prototype.slice.call( r.querySelectorAll( s ) );
	}

	function initBookingForm( root ) {
		var drTrigger = root.querySelector( '[data-villacde-dr-trigger]' );
		var drCal = root.querySelector( '[data-villacde-dr-cal]' );
		var drText = root.querySelector( '[data-villacde-dr-text]' );
		var drNights = root.querySelector( '[data-villacde-dr-nights]' );
		var drField = root.querySelector( '[data-villacde-dr-field]' );
		var drIn = root.querySelector( '[data-villacde-dr-in]' );
		var drOut = root.querySelector( '[data-villacde-dr-out]' );

		var form = root.querySelector( '[data-villacde-booking-form]' );
		var thanks = root.querySelector( '[data-villacde-booking-thanks]' );
		var resetBtn = root.querySelector( '[data-villacde-booking-reset]' );

		/* Bridge functions the "Booking form" section below calls into —
		   real implementations are assigned once the calendar section
		   below confirms it has every element it needs, same guard the
		   static site uses (`if (drTrigger && drCal && drIn && drOut)`). */
		var drPaint = function () {};
		var drReset = function () {};
		var drInvalid = function () {};

		/* ---------- Booking date range picker ----------
		   Replaces the two native date inputs with one field. Clicking
		   anywhere on the field (not just an icon) opens a two-month
		   calendar. First click sets check-in, second sets check-out.
		   The hidden check_in / check_out inputs keep the submitted
		   payload identical to before. */
		if ( drTrigger && drCal && drIn && drOut ) {
			var drStart = null, drEnd = null, drHover = null;
			var now = new Date();
			var drMin = new Date(
				now.getFullYear(), now.getMonth(), now.getDate()
			);
			var drView = new Date( drMin.getFullYear(), drMin.getMonth(), 1 );
			var drOpen = false, drFocus = null;

			function iso( d ) {
				return d.getFullYear() + '-' +
					String( d.getMonth() + 1 ).padStart( 2, '0' ) + '-' +
					String( d.getDate() ).padStart( 2, '0' );
			}
			function parseISO( v ) {
				/* Same pattern as the static site's `/^.../.exec(v)` —
				   written as String#match here so a match array comes
				   back the same way (m[1]/m[2]/m[3] capture groups). */
				var m = ( v || '' ).match( /^(\d{4})-(\d{2})-(\d{2})$/ );
				return m ? new Date( +m[ 1 ], +m[ 2 ] - 1, +m[ 3 ] ) : null;
			}
			function sameDay( a, b ) {
				return !! a && !! b && a.getTime() === b.getTime();
			}
			function addDays( d, n ) {
				return new Date( d.getFullYear(), d.getMonth(), d.getDate() + n );
			}
			function addMonths( d, n ) {
				return new Date( d.getFullYear(), d.getMonth() + n, 1 );
			}
			function fmt( d ) {
				return d.getDate() + ' ' + MONTHS[ d.getMonth() ].slice( 0, 3 ) +
					' ' + d.getFullYear();
			}
			function drCount() {
				if ( ! drStart || ! drEnd ) {
					return 0;
				}
				return Math.round( ( drEnd - drStart ) / 86400000 );
			}
			function hintText() {
				if ( ! drStart ) {
					return 'Select your check-in date';
				}
				if ( ! drEnd ) {
					return 'Select your check-out date';
				}
				var n = drCount();
				return n + ( n === 1 ? ' night' : ' nights' ) + ' selected';
			}

			function paintField() {
				var n = drCount();
				if ( drStart && drEnd ) {
					drText.textContent = fmt( drStart ) + '  →  ' + fmt( drEnd );
					drText.classList.remove( 'is-placeholder' );
					drNights.textContent = n + ( n === 1 ? ' night' : ' nights' );
				} else if ( drStart ) {
					drText.textContent = fmt( drStart ) + '  →  check-out?';
					drText.classList.remove( 'is-placeholder' );
					drNights.textContent = '';
				} else {
					drText.textContent = 'Add your dates';
					drText.classList.add( 'is-placeholder' );
					drNights.textContent = '';
				}
				drIn.value = drStart ? iso( drStart ) : '';
				drOut.value = drEnd ? iso( drEnd ) : '';
				if ( drField ) {
					drField.classList.remove( 'is-invalid' );
				}
			}

			function monthHTML( base ) {
				var y = base.getFullYear(), m = base.getMonth();
				var first = new Date( y, m, 1 );
				var lead = ( first.getDay() + 6 ) % 7; // Monday-first
				var len = new Date( y, m + 1, 0 ).getDate();
				var cells = '';
				for ( var i = 0; i < lead; i++ ) {
					cells += '<button type="button" class="dr-empty" tabindex="-1" aria-hidden="true"></button>';
				}
				for ( var d = 1; d <= len; d++ ) {
					var day = new Date( y, m, d );
					var disabled = day < drMin;
					var cls = [];
					if ( sameDay( day, drMin ) ) {
						cls.push( 'is-today' );
					}
					if ( sameDay( day, drStart ) ) {
						cls.push( 'is-start' );
					}
					if ( sameDay( day, drEnd ) ) {
						cls.push( 'is-end' );
					}
					var tail = drEnd ||
						( drStart && drHover && drHover > drStart ? drHover : null );
					if ( drStart && tail && day > drStart && day < tail ) {
						cls.push( 'in-range' );
					}
					cells += '<button type="button" data-date="' + iso( day ) + '"' +
						( disabled ? ' disabled' : '' ) +
						' tabindex="-1"' +
						' aria-label="' + d + ' ' + MONTHS[ m ] + ' ' + y + '"' +
						( cls.indexOf( 'is-start' ) > -1 || cls.indexOf( 'is-end' ) > -1 ? ' aria-pressed="true"' : '' ) +
						( cls.length ? ' class="' + cls.join( ' ' ) + '"' : '' ) + '>' + d + '</button>';
				}
				return '<div class="dr-month"><p class="dr-month-name">' + MONTHS[ m ] + ' ' + y + '</p>' +
					'<div class="dr-dow">' + DOW.map( function ( x ) { return '<span>' + x + '</span>'; } ).join( '' ) + '</div>' +
					'<div class="dr-days">' + cells + '</div></div>';
			}

			function render() {
				var atMin = drView.getFullYear() === drMin.getFullYear() &&
					drView.getMonth() === drMin.getMonth();
				drCal.innerHTML =
					'<div class="dr-cal-head">' +
						'<button type="button" class="dr-nav" data-dr="prev" aria-label="Previous month"' + ( atMin ? ' disabled' : '' ) + '>' +
							'<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>' +
						'</button>' +
						'<span class="dr-hint">' + hintText() + '</span>' +
						'<button type="button" class="dr-nav" data-dr="next" aria-label="Next month">' +
							'<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"></path></svg>' +
						'</button>' +
					'</div>' +
					'<div class="dr-months">' + monthHTML( drView ) + monthHTML( addMonths( drView, 1 ) ) + '</div>' +
					'<div class="dr-foot">' +
						'<button type="button" class="dr-clear" data-dr="clear">Clear dates</button>' +
						'<button type="button" class="dr-done" data-dr="done">Done</button>' +
					'</div>';
				markFocus();
			}

			/* roving tabindex so arrow keys walk the grid */
			function markFocus() {
				var days = $$( '.dr-days button[data-date]:not([disabled])', drCal );
				if ( ! days.length ) {
					return;
				}
				var target = days[ 0 ];
				if ( drFocus ) {
					for ( var i = 0; i < days.length; i++ ) {
						if ( days[ i ].getAttribute( 'data-date' ) === drFocus ) {
							target = days[ i ];
							break;
						}
					}
				}
				days.forEach( function ( b ) { b.tabIndex = -1; } );
				target.tabIndex = 0;
				return target;
			}

			function openCal() {
				if ( drOpen ) {
					return;
				}
				drOpen = true;
				drCal.hidden = false;
				drTrigger.setAttribute( 'aria-expanded', 'true' );
				if ( drStart ) {
					drView = new Date( drStart.getFullYear(), drStart.getMonth(), 1 );
				}
				drFocus = iso( drStart || drMin );
				render();
				var t = markFocus();
				if ( t ) {
					t.focus();
				}
				document.addEventListener( 'mousedown', outside, true );
			}
			function closeCal( returnFocus ) {
				if ( ! drOpen ) {
					return;
				}
				drOpen = false;
				drCal.hidden = true;
				drTrigger.setAttribute( 'aria-expanded', 'false' );
				document.removeEventListener( 'mousedown', outside, true );
				if ( returnFocus ) {
					drTrigger.focus();
				}
			}
			function outside( e ) {
				if ( ! drCal.contains( e.target ) && ! drTrigger.contains( e.target ) ) {
					closeCal( false );
				}
			}

			function pick( d ) {
				if ( ! drStart || drEnd || d <= drStart ) {
					drStart = d;
					drEnd = null;
					drHover = null;
				} else {
					drEnd = d;
				}
				drFocus = iso( d );
				paintField();
				render();
				if ( drStart && drEnd ) {
					var t = markFocus();
					if ( t ) {
						t.focus();
					}
				}
			}

			/* Click anywhere on the field, not just the icon. */
			drTrigger.addEventListener( 'click', function () {
				drOpen ? closeCal( true ) : openCal();
			} );

			drCal.addEventListener( 'click', function ( e ) {
				var nav = e.target.closest( '[data-dr]' );
				if ( nav ) {
					var a = nav.getAttribute( 'data-dr' );
					if ( a === 'prev' ) {
						drView = addMonths( drView, -1 );
						render();
					}
					if ( a === 'next' ) {
						drView = addMonths( drView, 1 );
						render();
					}
					if ( a === 'clear' ) {
						drStart = drEnd = drHover = null;
						paintField();
						render();
					}
					if ( a === 'done' ) {
						closeCal( true );
					}
					return;
				}
				var cell = e.target.closest( 'button[data-date]' );
				if ( cell && ! cell.disabled ) {
					pick( parseISO( cell.getAttribute( 'data-date' ) ) );
				}
			} );

			/* live range preview while choosing the check-out */
			drCal.addEventListener( 'mouseover', function ( e ) {
				var cell = e.target.closest( 'button[data-date]' );
				if ( ! cell || cell.disabled || ! drStart || drEnd ) {
					return;
				}
				var d = parseISO( cell.getAttribute( 'data-date' ) );
				if ( drHover && sameDay( d, drHover ) ) {
					return;
				}
				drHover = d;
				render();
			} );
			drCal.addEventListener( 'mouseleave', function () {
				if ( drStart && ! drEnd && drHover ) {
					drHover = null;
					render();
				}
			} );

			drCal.addEventListener( 'keydown', function ( e ) {
				if ( e.key === 'Escape' ) {
					e.stopPropagation();
					closeCal( true );
					return;
				}
				var cur = parseISO( drFocus );
				if ( ! cur ) {
					return;
				}
				var step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[ e.key ];
				var next = null;
				if ( step ) {
					next = addDays( cur, step );
				} else if ( e.key === 'PageUp' ) {
					next = addMonths( new Date( cur.getFullYear(), cur.getMonth(), 1 ), -1 );
				} else if ( e.key === 'PageDown' ) {
					next = addMonths( new Date( cur.getFullYear(), cur.getMonth(), 1 ), 1 );
				} else if ( e.key === 'Home' ) {
					next = addDays( cur, -( ( cur.getDay() + 6 ) % 7 ) );
				} else if ( e.key === 'End' ) {
					next = addDays( cur, 6 - ( ( cur.getDay() + 6 ) % 7 ) );
				} else {
					return;
				}
				e.preventDefault();
				if ( next < drMin ) {
					next = drMin;
				}
				drFocus = iso( next );
				var vm = drView.getFullYear() * 12 + drView.getMonth();
				var nm = next.getFullYear() * 12 + next.getMonth();
				if ( nm < vm ) {
					drView = new Date( next.getFullYear(), next.getMonth(), 1 );
				}
				if ( nm > vm + 1 ) {
					drView = addMonths( new Date( next.getFullYear(), next.getMonth(), 1 ), -1 );
				}
				render();
				var t = markFocus();
				if ( t ) {
					t.focus();
				}
			} );

			drPaint = paintField;
			drReset = function () {
				drStart = drEnd = drHover = null;
				closeCal( false );
				paintField();
			};
			drInvalid = function () {
				if ( drField ) {
					drField.classList.add( 'is-invalid' );
				}
				drTrigger.focus();
			};
		}

		/* ---------- Booking form ----------
		   No backend behind this form — it hands the request to
		   WhatsApp instead. The visitor still has to tap send in
		   WhatsApp; wa.me can only pre-fill. Config (WhatsApp number,
		   nightly rate, currency) comes from the data attributes
		   save.js renders from this block's attributes, falling back
		   to the static site's own CONFIG values if, somehow, they're
		   missing from the markup. */
		if ( form ) {
			var whatsappNumber = form.getAttribute( 'data-villacde-booking-whatsapp' ) || '254713234606';
			var nightlyRate = Number( form.getAttribute( 'data-villacde-booking-rate' ) ) || 65000;
			var currency = form.getAttribute( 'data-villacde-booking-currency' ) || 'KES';

			function money( v ) {
				return currency + ' ' + Math.round( v ).toLocaleString( 'en-US' );
			}
			function nights() {
				var ci = form.elements.check_in.value, co = form.elements.check_out.value;
				if ( ! ci || ! co ) {
					return 0;
				}
				var d = ( new Date( co ) - new Date( ci ) ) / 86400000;
				return d > 0 ? Math.round( d ) : 0;
			}

			function buildWhatsAppMessage( data ) {
				var lines = [
					'New booking request — Villa CDE',
					'',
					'Name: ' + data.name,
					'Dates: ' + data.check_in + ' → ' + data.check_out + ' (' + data.nights + ( data.nights === 1 ? ' night' : ' nights' ) + ')',
					'Guests: ' + data.guests,
					'Estimate: ' + money( data.estimate ),
				];
				if ( data.phone ) {
					lines.push( 'Phone: ' + data.phone );
				}
				if ( data.message ) {
					lines.push( 'Occasion/requests: ' + data.message );
				}
				return lines.join( '\n' );
			}

			function submitBooking( data ) {
				var url = 'https://wa.me/' + whatsappNumber + '?text=' +
					encodeURIComponent( buildWhatsAppMessage( data ) );
				window.open( url, '_blank', 'noopener' );
				return Promise.resolve();
			}

			/* check_in / check_out are hidden inputs; the range picker owns them. */
			drPaint();

			form.addEventListener( 'submit', function ( e ) {
				e.preventDefault();
				if ( nights() < 1 ) {
					/* A hidden input cannot be focused or reported by
					   reportValidity(), so flag the range field itself. */
					drInvalid();
					return;
				}
				var data = Object.fromEntries( new FormData( form ).entries() );
				data.nights = nights();
				data.estimate = data.nights * nightlyRate;
				submitBooking( data ).then( function () {
					form.hidden = true;
					if ( thanks ) {
						thanks.hidden = false;
						thanks.focus();
					}
				} );
			} );
		}

		if ( resetBtn ) {
			resetBtn.addEventListener( 'click', function () {
				if ( form ) {
					form.reset();
				}
				drReset();
				if ( thanks ) {
					thanks.hidden = true;
				}
				if ( form ) {
					form.hidden = false;
				}
			} );
		}
	}

	function init() {
		var roots = document.querySelectorAll(
			'.wp-block-villacde-core-booking-form'
		);
		for ( var i = 0; i < roots.length; i++ ) {
			initBookingForm( roots[ i ] );
		}
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
