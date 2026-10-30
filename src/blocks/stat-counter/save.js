import { useBlockProps } from '@wordpress/block-editor';

/**
 * Static markup ported from the static site's index.html stats bar
 * (`#stats [data-count]`, lines ~89-92): each stat is a `data-count`
 * span holding the real target number (plus `data-suffix` for the
 * "24/7" stat) and a label underneath. Matches the static site's
 * no-JS state exactly — the real final number is shown here, not 0;
 * view.js (ported from js/main.js lines 97-123) is the one that zeroes
 * it out and counts back up once the frontend script runs.
 *
 * `data-suffix` is only rendered when non-empty, same as the static
 * site (only the "24/7" stat carries it).
 */
export default function save( { attributes } ) {
	const { targetNumber, suffix, label } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'villacde-stat-counter',
	} );

	return (
		<div { ...blockProps }>
			<div className="villacde-stat-counter__number">
				<span
					data-count={ targetNumber }
					data-suffix={ suffix || undefined }
				>
					{ targetNumber }
					{ suffix }
				</span>
			</div>
			<div className="villacde-stat-counter__label">{ label }</div>
		</div>
	);
}
