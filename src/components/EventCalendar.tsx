'use client'
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function CalendarComponent() {
  const [date, setDate] = useState<Value>(new Date());

  const handleDateChange = (value: Value, event: React.MouseEvent<HTMLButtonElement>) => {
    setDate(value);
  };

  return (
    <div className="calendar-container">
      <Calendar 
        onChange={handleDateChange}
        value={date}
      />
    </div>
  );
}
