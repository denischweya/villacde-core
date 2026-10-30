import { useBlockProps } from '@wordpress/block-editor';

/**
 * Static markup ported from the static site's index.html reviews section
 * (`#reviews-track` and its six `.review` divs, lines ~269-282, only the
 * first visible by default — the rest carry the `hidden` attribute, the
 * same no-JS-fallback approach the static site used) and css/styles.css
 * (`.review` fade-in animation). The frontend-only next/prev advance
 * logic lives in view.js, ported from js/main.js lines 145-157.
 *
 * `data-rv="prev"`/`"next"` on the buttons matches the static site's
 * attribute exactly, which view.js reads to decide direction.
 */
export default function save( { attributes } ) {
	const { reviews = [] } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'villacde-reviews-carousel',
	} );

	return (
		<div { ...blockProps }>
			<svg
				aria-hidden="true"
				width="44"
				height="34"
				viewBox="0 0 44 34"
				fill="#E8913A"
				className="villacde-reviews-carousel__quote-icon"
			>
				<path d="M0 34V20C0 8 6 1 18 0v7c-6 1-9 5-9 11h9v16zM26 34V20C26 8 32 1 44 0v7c-6 1-9 5-9 11h9v16z" />
			</svg>

			<div className="villacde-reviews-carousel__track">
				{ reviews.map( ( review, i ) => (
					<div
						key={ i }
						className="villacde-reviews-carousel__review"
						hidden={ i !== 0 }
					>
						<blockquote className="villacde-reviews-carousel__quote">
							{ review.text }
						</blockquote>
						<p className="villacde-reviews-carousel__byline">
							<span className="villacde-reviews-carousel__name">
								{ review.name }
							</span>
							<span className="villacde-reviews-carousel__meta">{ ' ' }· { review.location } · { review.date }</span>
						</p>
					</div>
				) ) }
			</div>

			<div className="villacde-reviews-carousel__footer">
				<span
					className="villacde-reviews-carousel__count"
					aria-live="polite"
				>
					{ reviews.length ? `1 / ${ reviews.length }` : '' }
				</span>
				<div className="villacde-reviews-carousel__nav">
					<button
						type="button"
						className="villacde-reviews-carousel__btn villacde-reviews-carousel__btn--prev"
						aria-label="Previous review"
						data-rv="prev"
					>
						<svg
							aria-hidden="true"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#0E1726"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M15 18l-6-6 6-6" />
						</svg>
					</button>
					<button
						type="button"
						className="villacde-reviews-carousel__btn villacde-reviews-carousel__btn--next"
						aria-label="Next review"
						data-rv="next"
					>
						<svg
							aria-hidden="true"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#FFFFFF"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M9 18l6-6-6-6" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}
