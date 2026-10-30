import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * This block is heavy on frontend-only interactivity (autoplay video,
 * pulsing play button, video-tour modal — all handled by view.js, which
 * does not load in the editor). The editor preview is intentionally a
 * static approximation: the poster image, the hero copy, and a static
 * (non-pulsing) play button, so editors can confirm the content without
 * trying to reproduce the live-site interactivity here.
 */
export default function Edit( { attributes } ) {
	const {
		heroPosterUrl,
		eyebrowText,
		heading,
		leadText,
		ctaText,
		playButtonLabel,
	} = attributes;

	const blockProps = useBlockProps( { className: 'villacde-hero' } );

	return (
		<div { ...blockProps }>
			{ heroPosterUrl && (
				<img
					className="villacde-hero__poster"
					src={ heroPosterUrl }
					alt=""
				/>
			) }

			<div className="villacde-hero__scrim" aria-hidden="true" />

			<div className="villacde-hero__copy">
				<div className="villacde-hero__copy-inner">
					<div className="villacde-hero__copy-main">
						<p className="villacde-hero__eyebrow">
							<span
								aria-hidden="true"
								className="villacde-hero__eyebrow-rule"
							/>
							{ eyebrowText }
						</p>
						<div className="villacde-hero__title-row">
							<h1 className="villacde-hero__title">
								{ heading }
							</h1>
							<span
								className="villacde-hero__play-btn"
								aria-hidden="true"
								title={ playButtonLabel }
							>
								<svg
									aria-hidden="true"
									width="38%"
									height="38%"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="villacde-hero__play-icon"
								>
									<path d="M8 5v14l11-7z" />
								</svg>
							</span>
						</div>
						<p className="villacde-hero__lead">{ leadText }</p>
					</div>
					<div className="villacde-hero__actions">
						<span className="villacde-hero__cta">
							{ ctaText }
						</span>
					</div>
				</div>
			</div>

			<p className="villacde-hero-editor-notice">
				{ __(
					'Preview only — the autoplay background video, pulsing play button, and tour modal run on the live site.',
					'villacde-core'
				) }
			</p>
		</div>
	);
}
