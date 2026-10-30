import { useBlockProps } from '@wordpress/block-editor';

/**
 * Editor preview. The only frontend behaviour this block has (view.js's
 * count-up animation) is a cosmetic flourish on top of content that's
 * already accurate here — the final number and label — so, unlike the
 * hero block's video modal, there's nothing to approximate or flag with
 * a notice: this preview already shows what the stat says.
 */
export default function Edit( { attributes } ) {
	const { targetNumber, suffix, label } = attributes;

	const blockProps = useBlockProps( {
		className: 'villacde-stat-counter',
	} );

	return (
		<div { ...blockProps }>
			<div className="villacde-stat-counter__number">
				{ targetNumber }
				{ suffix }
			</div>
			<div className="villacde-stat-counter__label">{ label }</div>
		</div>
	);
}
