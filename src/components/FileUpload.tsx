// components/FileUpload.tsx
'use client'
import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

import Link from 'next/link';

interface Photo {
  _id: string;
  name: string;
  url: string;
  createdAt: string;
}

export default function FileUpload() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/upload');
      const data = await response.json();
      if (data.success) {
        setPhotos(data.photos);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    }
  });

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setLoading(true);

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        setSelectedFiles([]);
        await fetchPhotos(); // Refresh the photos list
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div {...getRootProps()} className="border-2 border-dashed p-4 rounded-lg">
        <input {...getInputProps()} />
        <p>Drag & drop files here, or click to select files</p>
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Selected Files:</h3>
          <ul className="mt-2">
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            {loading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>
      )}

      {photos.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Uploaded Photos</h2>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-2">
            {photos.map((photo) => (
              <div key={photo._id} className="border rounded p-2">
                <img 
                  src={photo.url} 
                  alt={photo.name}
                  className="w-full h-48 object-cover"
                />
                <p className="mt-2 text-sm">{photo.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
