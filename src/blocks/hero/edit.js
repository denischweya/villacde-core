import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function Edit() {
    const blockProps = useBlockProps( { className: 'villacde-hero-placeholder' } );
    return (
        <div { ...blockProps }>
            <h2>{ __( 'Villa CDE Hero', 'villacde-core' ) }</h2>
            <p>{ __( 'Video + play button land here in a later sub-project.', 'villacde-core' ) }</p>
        </div>
    );
}
