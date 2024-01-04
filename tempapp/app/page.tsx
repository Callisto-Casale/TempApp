'use client';

// Import necessary dependencies and components
import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

// Dynamically import the DateRangePicker component
const DateRangePicker = dynamic(() => import("../components/DateRangePicker.client"));

// Define the Home component
export default function Home() {
  // State and refs initialization
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: null, endDate: null });
  const [chartData, setChartData] = useState<any[]>([]);
  const chartRef = useRef(null);
  const [chart, setChart] = useState<Chart | null>(null);

  // Effect to handle chart updates when chart data changes
  useEffect(() => {
    if (chartData.length > 0 && chartRef.current) {
      // Destroy existing chart if it exists
      if (chart) {
        chart.destroy();
      }

      // Create a new Chart instance using Chart.js
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

      // Set the created chart to state
      setChart(newChart);
    }
  }, [chartData]);

  // Function to handle data fetching based on selected date range
  const handleClick = () => {
    // Check if both start and end dates are selected
    if (!dateRange.startDate || !dateRange.endDate) {
      console.log('Please select a date range.');
      return;
    }

    // Format start and end dates for API request
    const startDate = formatDate(dateRange.startDate!);
    const endDate = formatDate(dateRange.endDate!);

    // Fetch data based on the selected date range
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Utrecht/${startDate}/${endDate}?unitGroup=metric&include=days&key=3AX5FN743B3ZNKAYKVJDCBB5P&contentType=json`, {
      method: "GET",
      headers: {}
    })
    .then(response => response.json())
    .then(data => {
      // Extract temperature data for chart from API response
      const chartData = data.days.map((day: any) => ({
        x: day.datetime,
        y: day.temp,
      }));

      // Update chart data and save date range to a cookie
      setChartData(chartData);
      Cookies.set('dateRange', JSON.stringify(dateRange));
    })
    .catch(err => {
      console.error(err);
    });
  }

  // Function to format date in YYYY-MM-DD format
  function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  // Function to check if a value is a valid Date
  function isValidDate(value: any) {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }

  // JSX for rendering the UI
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center space-y-8">
      {/* Application title */}
      <h1 className='text-white text-slate-400 text-4xl font-serif'>SkyCast</h1>
      {/* DateRangePicker component */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-4">
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onChange={setDateRange}
            className="w-full px-3 py-2 text-black placeholder-gray-500 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        {/* Buttons for data fetching and loading saved date range */}
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
      {/* Canvas for rendering the chart */}
      <div className="w-full max-w-md">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}
