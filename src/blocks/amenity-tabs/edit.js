import { useState } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Editor preview. Unlike the hero block (whose interactivity — autoplay
 * video, a modal — can't sensibly run in the editor canvas), a tabs
 * panel's switching behaviour is trivial to reproduce with local React
 * state, so editors get a real working click-to-preview here rather than
 * a static "preview only" approximation. The click + arrow-key logic that
 * actually ships to the frontend lives in view.js and is intentionally
 * re-implemented (not shared) here, same as save.js vs. the static site's
 * markup.
 */
export default function Edit( { attributes } ) {
	const { tabs = [] } = attributes;
	const [ activeTab, setActiveTab ] = useState( 0 );

	const blockProps = useBlockProps( {
		className: 'villacde-amenity-tabs',
	} );

	return (
		<div { ...blockProps }>
			<div
				className="villacde-amenity-tabs__tablist"
				role="tablist"
				aria-label="Amenity categories"
			>
				{ tabs.map( ( tab, i ) => (
					<button
						key={ tab.id || i }
						type="button"
						role="tab"
						className="villacde-amenity-tabs__tab"
						aria-selected={ i === activeTab ? 'true' : 'false' }
						tabIndex={ i === activeTab ? 0 : -1 }
						onClick={ () => setActiveTab( i ) }
					>
						{ tab.label }
					</button>
				) ) }
			</div>

			<div className="villacde-amenity-tabs__panels">
				{ tabs.map(
					( tab, i ) =>
						i === activeTab && (
							<div
								key={ tab.id || i }
								role="tabpanel"
								className="villacde-amenity-tabs__panel"
							>
								{ ( tab.items || [] ).map( ( item, j ) => (
									<div
										className="villacde-amenity-tabs__item"
										key={ j }
									>
										<span className="villacde-amenity-tabs__num">
											{ String( j + 1 ).padStart(
												2,
												'0'
											) }
										</span>
										<div className="villacde-amenity-tabs__item-copy">
											<div className="villacde-amenity-tabs__item-title">
												{ item.title }
											</div>
											<div className="villacde-amenity-tabs__item-desc">
												{ item.description }
											</div>
										</div>
									</div>
								) ) }
							</div>
						)
				) }
			</div>
		</div>
	);
}
