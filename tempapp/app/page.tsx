'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const DateRangePicker = dynamic(() => import("../components/DateRangePicker.client"));

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export default function Home() {
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: null, endDate: null });
  const [chartData, setChartData] = useState<any[]>([]);
  const chartRef = useRef(null);
  const [chart, setChart] = useState<Chart | null>(null); // Add this line

  useEffect(() => {
    if (chartData.length > 0 && chartRef.current) {
      if (chart) {
        chart.destroy(); // Destroy the old chart
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

      setChart(newChart); // Store the new chart
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
    <div>
      <DateRangePicker
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onChange={setDateRange}
      />
      <button onClick={handleClick}>Fetch Data</button>
      <canvas ref={chartRef} />
    </div>
  );
}