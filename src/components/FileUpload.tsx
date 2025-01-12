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
  deadline?: string;
}

export default function FileUpload() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [newFileName, setNewFileName] = useState('');

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

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setNewFileName(photo.name.split('.')[0]);
    setSelectedDateTime(photo.deadline || '');
    setIsPopupOpen(true);
  };

  const handleSaveChanges = async () => {
    if (selectedPhoto) {
      try {
        // Get the file extension from the original name
        const fileExtension = selectedPhoto.name.split('.').pop();
        
        // Create new name with same extension
        const updatedName = `${newFileName}.${fileExtension}`;
        
        // Send update to MongoDB
        const response = await fetch(`/api/photos/${selectedPhoto._id}/deadline`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            name: updatedName,
            deadline: selectedDateTime 
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update photo');
        }

        // Update local state
        setPhotos(photos.map(photo => 
          photo._id === selectedPhoto._id 
            ? { 
                ...photo, 
                name: updatedName,
                deadline: selectedDateTime
              }
            : photo
        ));

        // Reset states
        setIsPopupOpen(false);
        setSelectedPhoto(null);
        setNewFileName('');
        setSelectedDateTime('');
        
      } catch (error) {
        console.error('Error updating photo:', error);
        // Optionally show error to user
      }
    }
  };

  const handleDeletePhoto = async (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation(); // Prevent the photo click event from triggering
    
    try {
      const response = await fetch(`/api/upload/${photoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Only update UI if delete was successful
        const updatedPhotos = photos.filter(photo => photo._id !== photoId);
        setPhotos(updatedPhotos);
      } else {
        console.error('Failed to delete photo');
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      // Optionally show an error message to the user
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
          
          <div className="grid grid-cols-3 gap-4">
            {photos.map((photo) => (
              <button
                key={photo._id}
                onClick={() => handlePhotoClick(photo)}
                className="border rounded p-2 hover:border-blue-500 transition-colors focus:outline-none relative group"
              >
                <button
                  onClick={(e) => handleDeletePhoto(e, photo._id)}
                  className="absolute top-4 right-4 w-8 h-8 bg-red-500 hover:bg-red-600 
                    text-white rounded-full flex items-center justify-center 
                    shadow-md transition-opacity opacity-0 group-hover:opacity-100 z-10"
                  aria-label="Delete photo"
                >
                  ✕
                </button>
                <img 
                  src={photo.url} 
                  alt={photo.name}
                  className="w-full h-48 object-cover"
                />
                <p className="mt-2 text-sm">{photo.name}</p>
                {photo.deadline && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Deadline: {new Date(photo.deadline).toLocaleString()}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popup Dialog */}
      {isPopupOpen && selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-[500px] max-h-[80vh] relative">
            <button 
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
            
            <div className="mb-4">
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h2 className="text-xl font-semibold mb-4"></h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  File Name
                </label>
                <input 
                  type="text" 
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter file name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Deadline
                </label>
                <input 
                  type="datetime-local" 
                  value={selectedDateTime}
                  onChange={(e) => setSelectedDateTime(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setIsPopupOpen(false)}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
