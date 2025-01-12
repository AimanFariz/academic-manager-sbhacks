'use client'
import { useState, useEffect } from 'react';

interface Photo {
    _id: string;
    name: string;
    url: string;
    extractedText: string;
    topics: string;
    createdAt: string;
  }

export default function FetchPhotosButton() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/upload');
      const data = await response.json();
      if (data.success) {
        setPhotos(data.photos);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={handleFetch}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading ? 'Loading...' : 'Fetch Photos'}
      </button>

      {photos.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Fetched Photos</h2>
          <div className="grid grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo._id} className="border rounded p-2">
                <img 
                  src={photo.url} 
                  alt={photo.name}
                  className="w-full h-48 object-cover"
                />
                <p className="mt-2 text-sm text-gray-700">
                     <strong>Extracted Text:</strong><br/>
                     {photo.extractedText}
                </p>
                {photo.topics && (
                    <p className="mt-2 text-sm text-gray-700">
                    <strong>Topics:</strong><br/>
                    {photo.topics}
                    </p>
                )}
                <p className="mt-2 text-sm">{photo.name}</p>
                <p className="text-xs text-gray-500">
                  {new Date(photo.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 