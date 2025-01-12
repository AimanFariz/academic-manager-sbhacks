// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import connectToDb from '@/lib/db.js';
import { Photo } from '@/models/Photo';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import anthropic from '@anthropic-ai/sdk';
import { EventInput } from '@fullcalendar/core'




export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!process.env.CLAUDE_API_KEY) {
        throw new Error('Claude API key is not set');
      }
    

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

        const imageBase64 = buffer.toString('base64');

        const client = new anthropic({
            apiKey: process.env.CLAUDE_API_KEY
          });

          const firstResponse = await client.messages.create({
            model: "claude-3-5-sonnet-latest",
            max_tokens: 1024,
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: "Write out what this says:" },
                  {
                    type: "image",
                    source: {
                      type: "base64",
                      media_type: "image/png",
                      data: imageBase64
                    }
                  }
                ]
              }
            ]
          });

          const extractedText = (firstResponse.content[0] as anthropic.TextBlock).text;

          const topicsResponse = await client.messages.create({
            model: "claude-3-5-sonnet-latest",
            max_tokens: 1024,
            messages: [
              {
                role: "assistant",
                content: "You are a task scheduler. Extract tasks from the text and format them as a numbered list of 3-6 word tasks to complete."
              },
              {
                role: "user",
                content: `Here are the notes: ${extractedText}. Create a numbered list of specific succinct tasks that need to be completed. Format as: 1. [Task]. There should be no more than 4 tasks, each task should be 2-6 words.`
              }
            ]
          });

          const topics = (topicsResponse.content[0]as anthropic.TextBlock).text;
          const lines = topics.split('\n').filter(line => line.trim());
          const tasks = lines.map((line: any) => line.replace(/^\d+\.\s*/, '').trim());

          // Create MongoDB document
        const photo = await Photo.create({
            name: file.name,
            url: `/uploads/${uniqueFilename}`,
            extractedText,
            topics,
            deadline: null // This will be updated later via the deadline API endpoint
          });

          const eventsResponse = await client.messages.create({
            model: "claude-3-5-sonnet-latest",
            max_tokens: 1024,
            messages: [
              {
                role: "assistant",
                content: "You are an EventInput generator. Create an EventInput array from the tasks and deadline."
              },
              {
                role: "user",
                content: "Here are the tasks: ${tasks}. The deadline for these tasks is: ${photo.deadline}. STRICTLY create an EventInput array from the tasks. Format as: {id: [id], title: [title], start: [start], end: [end], allDay: [allDay]}."
              }
            ]
          });

          const eventData = JSON.parse((eventsResponse.content[0] as anthropic.TextBlock).text);
          console.log('Generated events with deadline consideration:', eventData);

          console.log(extractedText);
          console.log(eventsResponse);
        
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
      .sort({ createdAt: -1 })
      .select('name url createdAt extractedText topics deadline');
    
    // Transform photos into a format that includes events
    const photosWithEvents = photos.map(photo => {
      let events = [];
      if (photo.topics && photo.deadline) {
        const tasks = photo.topics.split('\n').filter(Boolean);
        events = tasks.map((task, index) => ({
          id: `${photo._id}-${index}`,
          title: task.replace(/^\d+\.\s*/, '').trim(),
          start: new Date().toISOString(),
          end: photo.deadline,
          allDay: false
        }));
      }
      
      return {
        ...photo.toObject(),
        events
      };
    });

    return NextResponse.json({ 
      photos: photosWithEvents,
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
