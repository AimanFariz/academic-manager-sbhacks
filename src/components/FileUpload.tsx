'use client';

import { useState } from 'react';

interface UploadResponse {
    message: string;
    files: {
        filename: string;
        size: number;
        mimetype: string;
    }[];
}

interface ErrorResponse {
    error: string;
}

export default function FileUpload() {
    const [files, setFiles] = useState<File[]>([]);
    const [status, setStatus] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (files.length === 0) {
            setStatus('Please select files to upload');
            return;
        }

        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        try {
            setStatus('Uploading...');
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const result = (await response.json()) as UploadResponse | ErrorResponse;
            
            if (!response.ok) {
                throw new Error('error' in result ? result.error : 'Upload failed');
            }

            setStatus('Upload successful!');
            setFiles([]);
        } catch (error) {
            setStatus(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">File Upload</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="w-full"
                    />
                </div>

                {files.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-semibold">Selected Files:</h3>
                        <ul className="list-disc pl-5">
                            {files.map((file, index) => (
                                <li key={index}>
                                    {file.name} ({formatSize(file.size)})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {status && (
                    <div className="mt-4 p-3 bg-gray-100 rounded">
                        {status}
                    </div>
                )}
            </form>
        </div>
    );
}

