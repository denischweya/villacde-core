import { useState } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Editor preview. Like the amenity-tabs block (and unlike the hero
 * block's video modal, which can't sensibly run in the editor canvas),
 * the carousel's next/prev advance is trivial to reproduce with local
 * React state, so editors get a real working preview here rather than a
 * static approximation. This logic is intentionally re-implemented (not
 * shared) from the frontend behaviour in view.js, same precedent as
 * save.js vs. the static site's markup.
 */
export default function Edit( { attributes } ) {
	const { reviews = [] } = attributes;
	const [ current, setCurrent ] = useState( 0 );

	const blockProps = useBlockProps( {
		className: 'villacde-reviews-carousel',
	} );

	if ( ! reviews.length ) {
		return <div { ...blockProps } />;
	}

	const show = ( i ) =>
		setCurrent( ( i + reviews.length ) % reviews.length );
	const review = reviews[ current ];

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
				<div className="villacde-reviews-carousel__review">
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
			</div>

			<div className="villacde-reviews-carousel__footer">
				<span className="villacde-reviews-carousel__count">
					{ current + 1 } / { reviews.length }
				</span>
				<div className="villacde-reviews-carousel__nav">
					<button
						type="button"
						className="villacde-reviews-carousel__btn villacde-reviews-carousel__btn--prev"
						aria-label="Previous review"
						onClick={ () => show( current - 1 ) }
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
						onClick={ () => show( current + 1 ) }
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
