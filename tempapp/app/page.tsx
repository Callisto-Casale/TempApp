'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

const DateRangePicker = dynamic(() => import("../components/DateRangePicker.client"));

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

function isValidDate(value: any) {
  const date = new Date(value);
  return !isNaN(date.getTime());
}

export default function Home() {
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: null, endDate: null });
  const [chartData, setChartData] = useState<any[]>([]);
  const chartRef = useRef(null);
  const [chart, setChart] = useState<Chart | null>(null);

  useEffect(() => {
    if (chartData.length > 0 && chartRef.current) {
      if (chart) {
        chart.destroy();
      }

      const newChart = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          datasets: [
            {
              label: 'Temperature',
              data: chartData,
              backgroundColor: 'rgba(75,192,192,0.6)',
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
              },
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      setChart(newChart);
    }
  }, [chartData]);

  const handleClick = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      console.log('Please select a date range.');
      return;
    }
  
    const startDate = formatDate(dateRange.startDate!);
    const endDate = formatDate(dateRange.endDate!);
  
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Utrecht/${startDate}/${endDate}?unitGroup=metric&include=days&key=3AX5FN743B3ZNKAYKVJDCBB5P&contentType=json`, {
      "method": "GET",
      "headers": {}
    })
    .then(response => response.json())
    .then(data => {
      const chartData = data.days.map((day: any) => ({
        x: day.datetime,
        y: day.temp,
      }));

      setChartData(chartData);
      Cookies.set('dateRange', JSON.stringify(dateRange)); // Save the date range to a cookie
    })
    .catch(err => {
      console.error(err);
    });
  }

  function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center space-y-8">
      <h1 className='text-white text-slate-400 text-3xl font-serif'>SkyCast</h1>
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
    <div className="mb-4">
      <DateRangePicker
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onChange={setDateRange}
        className="w-full px-3 py-2 text-black placeholder-gray-500 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>
    <div className="flex justify-between space-x-4">
      <button onClick={handleClick} className="bg-blue-500 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded">
        Fetch Data
      </button>
      <button onClick={() => {
        const savedDateRange = JSON.parse(Cookies.get('dateRange') || 'null');
        if (savedDateRange && isValidDate(savedDateRange.startDate) && isValidDate(savedDateRange.endDate)) {
          setDateRange({
            startDate: new Date(savedDateRange.startDate),
            endDate: new Date(savedDateRange.endDate)
          });
        }
      }} className="bg-blue-500 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded">
        Load Saved Date Range
      </button>
    </div>
  </div>
  <div className="w-full max-w-md">
    <canvas ref={chartRef} />
  </div>
</div>
  );
}