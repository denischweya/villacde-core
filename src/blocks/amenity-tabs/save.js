import { useBlockProps } from '@wordpress/block-editor';

/**
 * Static markup ported from the static site's index.html amenities section
 * (the `role="tablist"` / `role="tab"` / `role="tabpanel"` structure) and
 * css/styles.css (`.tab`, `.tab[aria-selected="true"]`). The frontend-only
 * click + arrow-key tab switching lives in view.js, ported from
 * js/main.js lines 125-143.
 *
 * Tab/panel ids are fixed (`tab-0`/`panel-0`, etc.) rather than generated
 * from `clientId`, matching the static site exactly — this mirrors the
 * hero block's use of fixed ids (`video-modal`, `tour-video`) and assumes
 * a single instance of this block per page.
 */
export default function save( { attributes } ) {
	const { tabs = [] } = attributes;

	const blockProps = useBlockProps.save( {
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
						id={ `tab-${ i }` }
						aria-controls={ `panel-${ i }` }
						aria-selected={ i === 0 ? 'true' : 'false' }
						tabIndex={ i === 0 ? 0 : -1 }
					>
						{ tab.label }
					</button>
				) ) }
			</div>

			<div className="villacde-amenity-tabs__panels">
				{ tabs.map( ( tab, i ) => (
					<div
						key={ tab.id || i }
						role="tabpanel"
						id={ `panel-${ i }` }
						aria-labelledby={ `tab-${ i }` }
						hidden={ i !== 0 }
						tabIndex={ 0 }
						className="villacde-amenity-tabs__panel"
					>
						{ ( tab.items || [] ).map( ( item, j ) => (
							<div
								className="villacde-amenity-tabs__item"
								key={ j }
							>
								<span className="villacde-amenity-tabs__num">
									{ String( j + 1 ).padStart( 2, '0' ) }
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
				) ) }
			</div>
		</div>
	);
}
