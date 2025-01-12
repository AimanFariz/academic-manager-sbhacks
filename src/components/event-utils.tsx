import { EventInput } from '@fullcalendar/core'

let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: 'Event',
    start: todayStr
  },

  {
    id: createEventId(),
    title: 'Timed booty',
    start: todayStr + 'T11:00:00',
    allDay: true
  },
  
  {
    id: createEventId(),
    title: 'Timed event',
    start: todayStr + 'T12:00:00',
    end: todayStr + 'T14:00:00'
  }
]

export function createEventId() {
  return String(eventGuid++)
}
