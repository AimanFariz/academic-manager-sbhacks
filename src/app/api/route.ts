import { NextResponse } from 'next/server';
import connectToDb from '@/lib/db';
import { Photo } from '@/models/Photo';

// Helper functions
async function getPhotoById(id: string) {
  await connectToDb();
  return await Photo.findById(id).select('deadline name');
}

async function getAllPhotos() {
  await connectToDb();
  return await Photo.find().select('deadline name');
}

// GET handler
export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  try {
    if (id) {
      const photo = await getPhotoById(id);
      if (!photo) {
        return NextResponse.json(
          { error: 'Photo not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, photo });
    } else {
      const photos = await getAllPhotos();
      return NextResponse.json({ success: true, photos });
    }
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}

// POST handler
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDb();

    const newPhoto = new Photo({
      name: body.name,
      deadline: body.deadline,
      // Add any other fields you need
    });

    await newPhoto.save();
    return NextResponse.json({ 
      success: true, 
      message: 'Photo created successfully',
      photo: newPhoto 
    });
  } catch (error) {
    console.error('Error in POST:', error);
    return NextResponse.json(
      { error: 'Failed to create photo' },
      { status: 500 }
    );
  }
}

// DELETE handler
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Photo ID is required' },
      { status: 400 }
    );
  }

  try {
    await connectToDb();
    const deletedPhoto = await Photo.findByIdAndDelete(id);

    if (!deletedPhoto) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Photo deleted successfully' 
    });
  } catch (error) {
    console.error('Error in DELETE:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}

// PUT handler for updates
export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Photo ID is required' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    await connectToDb();

    const updatedPhoto = await Photo.findByIdAndUpdate(
      id,
      { 
        name: body.name,
        deadline: body.deadline,
        // Add any other fields you need to update
      },
      { new: true }
    );

    if (!updatedPhoto) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Photo updated successfully',
      photo: updatedPhoto 
    });
  } catch (error) {
    console.error('Error in PUT:', error);
    return NextResponse.json(
      { error: 'Failed to update photo' },
      { status: 500 }
    );
  }
} 