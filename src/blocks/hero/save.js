import { useBlockProps } from '@wordpress/block-editor';

/**
 * Static markup ported from the static site's index.html (hero <video> +
 * play button + #video-modal, lines ~21-77 and ~394-401) and css/styles.css
 * (.play-btn / .play-btn-ring / @keyframes play-pulse, modal styling). The
 * frontend-only behaviour (autoplay, modal open/close, playing the tour
 * video with sound) lives in view.js, ported from js/main.js lines 88-95
 * and 237-260.
 */
export default function save( { attributes } ) {
	const {
		heroVideoUrl,
		heroVideoWebmUrl,
		heroVideoMobileUrl,
		heroPosterUrl,
		tourVideoUrl,
		eyebrowText,
		heading,
		leadText,
		ctaText,
		ctaHref,
		playButtonLabel,
	} = attributes;

	const blockProps = useBlockProps.save( { className: 'villacde-hero' } );

	return (
		<div { ...blockProps }>
			<video
				className="villacde-hero__video"
				poster={ heroPosterUrl || undefined }
				autoPlay
				muted
				loop
				playsInline
				preload="auto"
				aria-label="Video tour of Villa CDE"
			>
				{ heroVideoMobileUrl && (
					<source
						src={ heroVideoMobileUrl }
						type="video/mp4"
						media="(max-width: 700px)"
					/>
				) }
				{ heroVideoWebmUrl && (
					<source src={ heroVideoWebmUrl } type="video/webm" />
				) }
				{ heroVideoUrl && (
					<source src={ heroVideoUrl } type="video/mp4" />
				) }
			</video>

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
							<button
								type="button"
								className="villacde-hero__play-btn play-btn"
								aria-label={ playButtonLabel }
								data-villacde-hero-play
							>
								<span
									className="play-btn-ring"
									aria-hidden="true"
								/>
								<span
									className="play-btn-ring play-btn-ring-2"
									aria-hidden="true"
								/>
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
							</button>
						</div>
						<p className="villacde-hero__lead">{ leadText }</p>
					</div>
					<div className="villacde-hero__actions">
						<a href={ ctaHref } className="villacde-hero__cta">
							{ ctaText }
						</a>
					</div>
				</div>
			</div>

			<div
				id="video-modal"
				className="villacde-hero__modal"
				hidden
				role="dialog"
				aria-modal="true"
				aria-label="Villa CDE video tour"
				data-villacde-hero-modal
			>
				<button
					type="button"
					className="villacde-hero__modal-backdrop"
					aria-label="Close video"
					data-villacde-hero-close-trigger
				/>
				<div className="villacde-hero__modal-frame">
					<video
						id="tour-video"
						className="villacde-hero__tour-video"
						src={ tourVideoUrl || undefined }
						controls
						playsInline
						preload="none"
						data-villacde-hero-tour-video
					/>
				</div>
				<button
					type="button"
					className="villacde-hero__modal-close"
					aria-label="Close"
					data-villacde-hero-close-trigger
					data-villacde-hero-close
				>
					<svg
						aria-hidden="true"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.2"
						strokeLinecap="round"
					>
						<path d="M6 6l12 12" />
						<path d="M18 6L6 18" />
					</svg>
				</button>
			</div>
		</div>
	);
}
