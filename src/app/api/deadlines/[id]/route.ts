import { NextResponse } from 'next/server';
import connectToDb from '@/lib/db.js';
import { Photo } from '@/models/Photo';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDb();
    
    const { deadline, name } = await request.json();

    // Update the photo document with the new deadline
    const updatedPhoto = await Photo.findByIdAndUpdate(
      params.id,
      { 
        deadline,
        name 
      },
      { new: true } // Return the updated document
    );

    if (!updatedPhoto) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      photo: updatedPhoto
    });

  } catch (error) {
    console.error('Error updating deadline:', error);
    return NextResponse.json(
      { error: 'Error updating deadline' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve deadline data
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDb();
    
    const photo = await Photo.findById(params.id).select('deadline name');
    
    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      deadline: photo.deadline,
      name: photo.name
    });

  } catch (error) {
    console.error('Error fetching deadline:', error);
    return NextResponse.json(
      { error: 'Error fetching deadline' },
      { status: 500 }
    );
  }
} 