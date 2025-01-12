// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import connectToDb from '@/lib/db';
import { Photo } from '@/models/Photo';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files received' },
        { status: 400 }
      );
    }

    // Connect to MongoDB first
    await connectToDb();

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error('Error creating uploads directory:', err);
    }

    const uploadPromises = files.map(async (file: any) => {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Create a unique filename
        const uniqueFilename = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, uniqueFilename);
        
        // Save file
        await writeFile(filePath, buffer);
        
        // Create MongoDB document
        const photo = await Photo.create({
          name: file.name,
          url: `/uploads/${uniqueFilename}`
        });
        
        return photo;
      } catch (err) {
        console.error('Error processing file:', err);
        throw err;
      }
    });

    const savedPhotos = await Promise.all(uploadPromises);
    
    return NextResponse.json({ 
      message: 'Files uploaded successfully',
      photos: savedPhotos 
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Error uploading files', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
    try {
      await connectToDb();
      
      const photos = await Photo.find({})
        .sort({ createdAt: -1 }) // Sort by newest first
        .select('name url createdAt'); // Select specific fields
      
      return NextResponse.json({ 
        photos,
        success: true 
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Error fetching photos' },
        { status: 500 }
      );
    }
  }

export const config = {
  api: {
    bodyParser: false,
  },
};
