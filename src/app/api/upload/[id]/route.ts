import { NextResponse } from 'next/server';
import connectToDb from '@/lib/db.js';
import { Photo } from '@/models/Photo';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDb();
    
    // Find the photo first to get its URL
    const photo = await Photo.findById(params.id);
    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    // Delete the file from the filesystem
    const filePath = path.join(process.cwd(), 'public', photo.url);
    try {
      await unlink(filePath);
    } catch (err) {
      console.error('Error deleting file:', err);
    }

    // Delete from MongoDB
    await Photo.findByIdAndDelete(params.id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Error deleting photo' },
      { status: 500 }
    );
  }
} 