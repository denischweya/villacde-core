import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * This block is almost entirely frontend-only interactivity: the
 * two-month date-range calendar (open/close, day selection, keyboard
 * navigation, hover-preview ranging) and the WhatsApp submit handler,
 * all in view.js, which does not load in the editor. Reproducing that
 * here would mean re-implementing the calendar twice. Like the hero
 * block's video-tour modal, the editor preview is intentionally a
 * static approximation of the form fields with a notice explaining
 * what only runs on the live site.
 */
export default function Edit( { attributes } ) {
	const { maxGuests } = attributes;

	const blockProps = useBlockProps( {
		className: 'villacde-booking-form',
	} );

	return (
		<div { ...blockProps }>
			<div className="villacde-booking-form__form villacde-booking-form__form--preview">
				<div className="villacde-booking-form__field villacde-booking-form__field--full dr-field">
					<span className="villacde-booking-form__label">
						Dates
					</span>
					<div className="villacde-booking-form__dr-trigger dr-trigger">
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
						<span className="villacde-booking-form__dr-text dr-text is-placeholder">
							Add your dates
						</span>
					</div>
				</div>

				<div className="villacde-booking-form__field">
					<span className="villacde-booking-form__label">
						Full name
					</span>
					<div className="villacde-booking-form__input villacde-booking-form__input--preview" />
				</div>

				<div className="villacde-booking-form__field">
					<span className="villacde-booking-form__label">
						Email
					</span>
					<div className="villacde-booking-form__input villacde-booking-form__input--preview" />
				</div>

				<div className="villacde-booking-form__field">
					<span className="villacde-booking-form__label">
						Phone / WhatsApp
					</span>
					<div className="villacde-booking-form__input villacde-booking-form__input--preview" />
				</div>

				<div className="villacde-booking-form__field">
					<span className="villacde-booking-form__label">
						{ `Guests (max ${ maxGuests } pax)` }
					</span>
					<div className="villacde-booking-form__input villacde-booking-form__input--preview" />
				</div>

				<div className="villacde-booking-form__field villacde-booking-form__field--full">
					<span className="villacde-booking-form__label">
						Occasion or requests
					</span>
					<div className="villacde-booking-form__textarea villacde-booking-form__input--preview" />
				</div>

				<div className="villacde-booking-form__note">
					We'll confirm your total when we reply. No payment is
					taken until then.
				</div>

				<div className="villacde-booking-form__submit villacde-booking-form__submit--preview">
					Request to book
				</div>
			</div>

			<p className="villacde-booking-form-editor-notice">
				{ __(
					'Preview only — the two-month date-range calendar and the WhatsApp submit action run on the live site.',
					'villacde-core'
				) }
			</p>
		</div>
	);
}
