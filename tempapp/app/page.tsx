import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Bar } from 'react-chartjs-2';

// Use dynamic import for DateRangePicker
const DateRangePicker = dynamic(() => import("../components/DateRangePicker.client"));

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export default function Home() {
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: null, endDate: null });
  const [chartData, setChartData] = useState({});

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
      const dates = data.days.map((day: any) => day.datetime);
      const temps = data.days.map((day: any) => day.temp);

      const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
          {
            label: '',
            data: [],
            backgroundColor: '',
            borderColor: '',
            borderWidth: 0,
            hoverBackgroundColor: '',
            hoverBorderColor: '',
          },
        ],
      });
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
      {/* ... */}
      <Bar data={chartData} />
    </div>
  );
}