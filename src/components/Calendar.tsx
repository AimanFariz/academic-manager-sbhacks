import React, { useEffect, useState } from 'react'
import { EventApi, DateSelectArg, EventClickArg, EventContentArg } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  backgroundColor?: string;
  borderColor?: string;
}

// Define a color palette
const EVENT_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Sage
  '#FFEEAD', // Yellow
  '#D4A5A5', // Mauve
  '#9B59B6', // Purple
  '#3498DB', // Blue
  '#E67E22', // Orange
  '#2ECC71', // Green
];

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/upload');
        const data = await response.json();
        
        if (data.success && data.photos) {
          const photoEvents = data.photos
            .filter((photo: any) => photo.deadline && photo.topics)
            .flatMap((photo: any, photoIndex: number) => {
              const tasks = photo.topics.split('\n').filter(Boolean);
              const deadline = new Date(photo.deadline);
              const now = new Date();
              
              const totalTasks = tasks.length;
              const totalTimeMs = deadline.getTime() - now.getTime();
              const timePerTask = totalTimeMs / (totalTasks + 1);
              
              return tasks.map((task: string, index: number) => {
                const taskStart = new Date(now.getTime() + (timePerTask * index));
                const taskEnd = new Date(taskStart.getTime() + (timePerTask * 0.8));
                
                // Get a color from the palette, cycling through if we run out
                const colorIndex = (photoIndex + index) % EVENT_COLORS.length;
                const backgroundColor = EVENT_COLORS[colorIndex];
                
                return {
                  id: `${photo._id}-${index}`,
                  title: task.replace(/^\d+\.\s*/, '').trim(),
                  start: taskStart.toISOString(),
                  end: taskEnd.toISOString(),
                  allDay: false,
                  backgroundColor,
                  borderColor: backgroundColor,
                };
              });
            });

          setEvents(photoEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  };

  if (loading) {
    return <div>Loading calendar...</div>;
  }

  return (
    <div className='demo-app'>
      <div className='demo-app-main'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView='dayGridMonth'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          events={events}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          slotMinTime="09:00:00"
          slotMaxTime="21:00:00"
          slotDuration="01:00:00"
        />
      </div>
    </div>
  );
}

function renderEventContent(eventContent: EventContentArg) {
  return (
    <>
      <b>{eventContent.timeText}</b>
      <i>{eventContent.event.title}</i>
    </>
  );
}
