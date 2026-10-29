import { useBlockProps } from '@wordpress/block-editor';

export default function save() {
    const blockProps = useBlockProps.save( { className: 'villacde-hero-placeholder' } );
    return (
        <div { ...blockProps }>
            <h2>Villa CDE Hero</h2>
            <p>Video + play button land here in a later sub-project.</p>
        </div>
    );
}
