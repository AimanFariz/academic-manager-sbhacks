import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { GridFSBucket } from 'mongodb';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files');

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'No files uploaded' },
                { status: 400 }
            );
        }

        // Connect to MongoDB
        const conn = await connectDB();
        if (!conn.connection.db) {
            throw new Error('Database connection failed');
        }
        const bucket = new GridFSBucket(conn.connection.db);

        const uploadedFiles = await Promise.all(
            files.map(async (file: any) => {
                const buffer = Buffer.from(await file.arrayBuffer());
                const filename = file.name;
                
                const uploadStream = bucket.openUploadStream(filename);
                
                return new Promise((resolve, reject) => {
                    uploadStream.write(buffer);
                    uploadStream.end(() => {
                        resolve({
                            filename,
                            size: file.size,
                            mimetype: file.type
                        });
                    });
                    uploadStream.on('error', reject);
                });
            })
        );

        return NextResponse.json({
            message: 'Files uploaded successfully',
            files: uploadedFiles
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'File upload failed' },
            { status: 500 }
        );
    }
}
