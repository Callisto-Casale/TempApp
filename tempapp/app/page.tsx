'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import for DateRangePicker
const DateRangePicker = dynamic(() => import("../components/DateRangePicker.client"));

export default function Home() {
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  const handleClick = () => {
    console.log(dateRange);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <DateRangePicker startDate={dateRange.startDate} endDate={dateRange.endDate} onChange={setDateRange} />
      <button onClick={handleClick} className="mt-4 p-2 bg-blue-500 text-white rounded">Get temp</button>
    </main>
  )
}