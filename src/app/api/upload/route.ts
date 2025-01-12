// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import connectToDb from '@/lib/db.js';
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

    // Connect to MongoDB
    await connectToDb();

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const uploadPromises = files.map(async (file: any) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueFilename = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, uniqueFilename);
      
      await writeFile(filePath, buffer);

      const photo = await Photo.create({
        name: file.name,
        url: `/uploads/${uniqueFilename}`,
      });
      
      return photo;
    });

    const savedPhotos = await Promise.all(uploadPromises);
    
    return NextResponse.json({ 
      success: true,
      message: 'Files uploaded successfully',
      photos: savedPhotos 
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Error uploading files' },
      { status: 500 }
    );
  }
}

export async function GET() {
    try {
      await connectToDb();
      
      const photos = await Photo.find({})
        .sort({ createdAt: -1 })
        .select('name url createdAt extractedText topics');
      
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
