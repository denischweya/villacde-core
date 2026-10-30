import { useBlockProps } from '@wordpress/block-editor';

/**
 * Static markup ported from the static site's index.html booking section
 * (search `booking-form`, `dr-trigger`, `dr-cal`, lines ~307-333): the
 * "Request received" thanks panel (hidden until a submission opens
 * WhatsApp), and the form itself — the date-range trigger button + its two
 * hidden `check_in`/`check_out` inputs + an empty calendar popover
 * container, then name, email, phone, guests, message, a static note, and
 * the submit button. The entire date-range-picker (two-month calendar,
 * keyboard navigation, hover-preview ranging) plus the WhatsApp submit
 * logic lives in view.js, ported from js/main.js lines 270-end.
 *
 * `#dr-cal` is saved empty (just like the static site's `<div id="dr-cal"
 * hidden ...></div>`) — view.js builds the two months of day buttons on
 * open, it is never part of the static markup.
 *
 * JS hooks use `data-villacde-*` attributes scoped to this block instance
 * (same convention as the hero/amenity-tabs/reviews-carousel blocks'
 * view.js) rather than the static site's global ids (`#dr-trigger`,
 * `#booking-form`, etc.), so more than one instance of this block on a
 * page would not collide. `id`/`for` pairs are kept only where they are
 * functionally required: form label associations, and the
 * `aria-labelledby`/`aria-controls` references between the date-field
 * trigger and its label/text/popover.
 */
export default function save( { attributes } ) {
	const { maxGuests, nightlyRate, currency, whatsappNumber } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'villacde-booking-form',
	} );

	return (
		<div { ...blockProps }>
			<div
				className="villacde-booking-form__thanks"
				hidden
				role="status"
				tabIndex="-1"
				data-villacde-booking-thanks
			>
				<svg
					aria-hidden="true"
					width="44"
					height="44"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#B8651F"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="12" cy="12" r="10" />
					<path d="M8 12.5l2.5 2.5L16 9.5" />
				</svg>
				<p className="villacde-booking-form__thanks-title">
					Request received
				</p>
				<p className="villacde-booking-form__thanks-text">
					We've opened WhatsApp with your request — send that
					message to confirm your dates at Villa CDE.
				</p>
				<button
					type="button"
					className="villacde-booking-form__reset"
					data-villacde-booking-reset
				>
					Send another request
				</button>
			</div>

			<form
				className="villacde-booking-form__form"
				data-villacde-booking-form
				data-villacde-booking-whatsapp={ whatsappNumber }
				data-villacde-booking-rate={ nightlyRate }
				data-villacde-booking-currency={ currency }
			>
				<div
					className="villacde-booking-form__field villacde-booking-form__field--full dr-field"
					data-villacde-dr-field
				>
					<span
						id="dr-label"
						className="villacde-booking-form__label"
					>
						Dates
					</span>
					<button
						type="button"
						id="dr-trigger"
						className="villacde-booking-form__dr-trigger dr-trigger"
						aria-haspopup="dialog"
						aria-expanded="false"
						aria-controls="dr-cal"
						aria-labelledby="dr-label dr-text"
						data-villacde-dr-trigger
					>
						<svg
							aria-hidden="true"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.7"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<rect x="3" y="4.5" width="18" height="16" rx="2.5" />
							<path d="M3 9.5h18" />
							<path d="M8 2.5v4" />
							<path d="M16 2.5v4" />
						</svg>
						<span
							id="dr-text"
							className="villacde-booking-form__dr-text dr-text is-placeholder"
							data-villacde-dr-text
						>
							Add your dates
						</span>
						<span
							id="dr-nights"
							className="villacde-booking-form__dr-nights dr-nights"
							data-villacde-dr-nights
						></span>
					</button>
					<input
						type="hidden"
						name="check_in"
						data-villacde-dr-in
					/>
					<input
						type="hidden"
						name="check_out"
						data-villacde-dr-out
					/>
					<div
						id="dr-cal"
						className="villacde-booking-form__dr-cal dr-cal"
						hidden
						role="dialog"
						aria-modal="false"
						aria-label="Choose your dates"
						data-villacde-dr-cal
					></div>
				</div>

				<div className="villacde-booking-form__field">
					<label
						htmlFor="v2nm"
						className="villacde-booking-form__label"
					>
						Full name
					</label>
					<input
						id="v2nm"
						name="name"
						type="text"
						autoComplete="name"
						required
						className="villacde-booking-form__input"
					/>
				</div>

				<div className="villacde-booking-form__field">
					<label
						htmlFor="v2em"
						className="villacde-booking-form__label"
					>
						Email
					</label>
					<input
						id="v2em"
						name="email"
						type="email"
						autoComplete="email"
						required
						className="villacde-booking-form__input"
					/>
				</div>

				<div className="villacde-booking-form__field">
					<label
						htmlFor="v2ph"
						className="villacde-booking-form__label"
					>
						Phone / WhatsApp
					</label>
					<input
						id="v2ph"
						name="phone"
						type="tel"
						autoComplete="tel"
						placeholder="+254"
						className="villacde-booking-form__input"
					/>
				</div>

				<div className="villacde-booking-form__field">
					<label
						htmlFor="v2gu"
						className="villacde-booking-form__label"
					>
						{ `Guests (max ${ maxGuests } pax)` }
					</label>
					<input
						id="v2gu"
						name="guests"
						type="number"
						min="1"
						max={ maxGuests }
						placeholder="e.g. 10"
						required
						className="villacde-booking-form__input"
					/>
				</div>

				<div className="villacde-booking-form__field villacde-booking-form__field--full">
					<label
						htmlFor="v2ms"
						className="villacde-booking-form__label"
					>
						Occasion or requests
					</label>
					<textarea
						id="v2ms"
						name="message"
						rows="3"
						placeholder="Birthday, arrival time, meals for the chef..."
						className="villacde-booking-form__textarea"
					></textarea>
				</div>

				<div className="villacde-booking-form__note">
					We'll confirm your total when we reply. No payment is
					taken until then.
				</div>

				<button
					type="submit"
					className="villacde-booking-form__submit"
				>
					Request to book
				</button>
			</form>
		</div>
	);
}
