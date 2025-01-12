import { useState, useEffect } from 'react';

interface Photo {
  _id: string;
  name: string;
  url: string;
  extractedText: string;
  topics: string;
  createdAt: string;
}

export default function PhotoAnalysis() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch('/api/upload');
        const data = await response.json();
        if (data.success) {
          setPhotos(data.photos);
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    }

    fetchPhotos();
  }, []);

  return (
    <div className="space-y-8 p-4">
      {photos.map((photo) => (
        <div key={photo._id} className="border rounded-lg p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <img 
                src={photo.url} 
                alt={photo.name} 
                className="w-full h-auto rounded"
              />
              <p className="text-sm text-gray-500 mt-2">
                Uploaded: {new Date(photo.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Claude's Analysis:</h3>
              <div className="mb-4">
                <h4 className="font-semibold">Extracted Text:</h4>
                <p className="text-sm whitespace-pre-wrap">{photo.extractedText}</p>
              </div>
              <div>
                <h4 className="font-semibold">Topics/Tasks:</h4>
                <p className="text-sm whitespace-pre-wrap">{photo.topics}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 