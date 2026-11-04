import React, { useEffect, useRef, useState } from 'react';
import Button from './Button';
import './ImageUpload.css';

const MAX_FILE_SIZE = 6 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ImageUpload = (props) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState('');
  const filePickerRef = useRef();
  const maxFiles = props.multiple ? (props.maxFiles || 6) : 1;

  useEffect(() => {
    const urls = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPreviews(urls);
    return () => urls.forEach((preview) => URL.revokeObjectURL(preview.url));
  }, [files]);

  const updateFiles = (incomingFiles) => {
    const incoming = Array.from(incomingFiles || []);
    const accepted = incoming.filter((file) => ACCEPTED_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE);
    const rejected = incoming.length - accepted.length;
    const currentFiles = props.multiple ? files : [];
    const unique = accepted.filter((file) => !currentFiles.some((item) => item.name === file.name && item.size === file.size));
    const nextFiles = [...currentFiles, ...unique].slice(0, maxFiles);
    setFiles(nextFiles);
    setFileError(rejected ? 'Use JPG, PNG, or WebP images up to 6 MB each.' : (currentFiles.length + unique.length > maxFiles ? `You can add up to ${maxFiles} images.` : ''));
    props.onInput(props.id, props.multiple ? nextFiles : (nextFiles[0] || null), nextFiles.length > 0);
  };

  const removeFile = (index) => {
    const nextFiles = files.filter((_, fileIndex) => fileIndex !== index);
    setFiles(nextFiles);
    props.onInput(props.id, props.multiple ? nextFiles : (nextFiles[0] || null), nextFiles.length > 0);
  };

  const openPicker = () => filePickerRef.current && filePickerRef.current.click();
  const dropHandler = (event) => {
    event.preventDefault();
    setDragging(false);
    updateFiles(event.dataTransfer.files);
  };

  return (
    <div className="form-control image-upload-control">
      <label className="image-upload-label">{props.label || 'Photos'} {props.multiple && <span>UP TO {maxFiles}</span>}</label>
      <input id={props.id} ref={filePickerRef} className="image-upload-input" type="file" accept="image/jpeg,image/png,image/webp" multiple={!!props.multiple} onChange={(event) => { updateFiles(event.target.files); event.target.value = ''; }} />
      <div className={`image-dropzone${dragging ? ' is-dragging' : ''}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={dropHandler}>
        <div className="image-dropzone__copy"><span aria-hidden="true">↥</span><strong>Drop photos here</strong><small>or add them from your device · JPG, PNG, WebP · 6 MB max each</small></div>
        <Button type="button" onClick={openPicker}>CHOOSE PHOTOS</Button>
      </div>
      {previews.length > 0 && <div className="image-preview-grid">{previews.map((preview, index) => <figure key={`${preview.file.name}-${preview.file.lastModified}`}><img src={preview.url} alt={`Preview of ${preview.file.name}`} /><figcaption>{preview.file.name}</figcaption><button type="button" onClick={() => removeFile(index)} aria-label={`Remove ${preview.file.name}`}>×</button></figure>)}</div>}
      {fileError && <p className="image-upload-error" role="alert">{fileError}</p>}
      {!files.length && props.errorText && <p className="image-upload-error">{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
