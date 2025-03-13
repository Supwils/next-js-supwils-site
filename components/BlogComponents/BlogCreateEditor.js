import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';


// Optional: Register custom modules or formats if needed.
// For example, you might import and register a custom blot or module here.

const BlogCreateEditor = ({ value = '', onChange }) =>
{
  // Use local state only if no props are provided
  const [localValue, setLocalValue] = useState(value);

  // Handle changes to the editor content
  const handleChange = (content) =>
  {
    // Update local state
    setLocalValue(content);

    // Call the onChange prop if provided
    if (onChange)
    {
      onChange(content);
    }
  };

  // Define a custom toolbar
  const modules = {
    toolbar: [
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'align': [] }],
      ['clean'],                                        // remove formatting button
      ['link', 'image', 'code-block']                   // link, image, code block
    ],
  };

  // Define formats to allow
  const formats = [
    'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'header',
    'list', 'bullet',
    'indent',
    'align',
    'link', 'image', 'code-block'
  ];

  // Determine which value to use (prop or local state)
  const currentValue = onChange ? value : localValue;

  return (
    <div className="quill-editor-container">
      <ReactQuill
        theme="snow"
        value={currentValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder="Write your blog post here..."
        style={{ height: '300px', marginBottom: '50px' }}
      />
    </div>
  );
};

export default BlogCreateEditor;