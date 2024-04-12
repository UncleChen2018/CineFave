// MarkdownEditor.js
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

const MarkdownEditor = ({ initialText, onChange }) => {
	// Make sure the onChange prop is being called with the new value
	const handleChange = (value) => {
		onChange(value); // Pass the value to the onChange prop
	};

	return (
		<SimpleMDE
			value={initialText}
			onChange={handleChange}
			
			style={{ width: '100%', height: 'auto' }}
		/>
	);
};

export default MarkdownEditor;
