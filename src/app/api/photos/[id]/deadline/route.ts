import { NextResponse, NextRequest } from 'next/server';
import connectToDb from '@/lib/db';
import { Photo } from '@/models/Photo';
import { Anthropic } from '@anthropic-ai/sdk';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    await connectToDb();
    
    const { deadline, name } = await request.json();
    console.log('Processing deadline update:', { id, deadline, name });

    const updatedPhoto = await Photo.findByIdAndUpdate(
      id,
      { deadline, name },
      { new: true }
    ).select('extractedText topics deadline');

    if (!updatedPhoto) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    // Now you could optionally re-process the events with Claude using the new deadline
    // This would be similar to your original Claude processing code
    const client = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY
    });

    const eventsResponse = await client.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 1024,
      messages: [
        {
          role: "assistant",
          content: "You are an EventInput generator. Create an EventInput array from the tasks and deadline. You must respond with ONLY valid JSON array of events. No explanations or other text."
        },
        {
          role: "user",
          content: `Convert these tasks into a JSON array of events with deadlines:
            Tasks: ${updatedPhoto.topics}
            Deadline: ${updatedPhoto.deadline}
            
            Required format:
            [
              {
                "id": "string",
                "title": "task text",
                "start": "ISO date string",
                "end": "ISO date string",
                "allDay": false
              }
            ]
            
            Rules:
            - All events must end before or at ${updatedPhoto.deadline}
            - Space tasks evenly between now and deadline
            - Use ISO date strings (YYYY-MM-DDTHH:mm:ss.sssZ)
            - Return ONLY the JSON array`
        }
      ]
    });

    let updatedEvents;
    try {
      const responseText = (eventsResponse.content[0] as Anthropic.TextBlock).text;
      const jsonStr = responseText.substring(
        responseText.indexOf('['),
        responseText.lastIndexOf(']') + 1
      );
      updatedEvents = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
      console.log('Raw response:', eventsResponse.content[0]);
      return NextResponse.json(
        { error: 'Failed to parse events' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      photo: updatedPhoto,
      events: updatedEvents
    });

  } catch (error) {
    console.error('Error updating deadline:', error);
    return NextResponse.json(
      { error: 'Failed to update deadline' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    await connectToDb();
    
    const photo = await Photo.findById(id).select('name deadline');
    
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