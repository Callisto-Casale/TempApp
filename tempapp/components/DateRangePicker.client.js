// Importing the necessary dependencies for the DateRangePicker component
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// DateRangePicker component definition
const DateRangePicker = ({ startDate, endDate, onChange }) => {
  // Function to handle changes in the start date picker
  const handleStartDateChange = (date) => {
    // Calls the onChange function with the updated start date and the current endDate
    onChange({ startDate: date, endDate });
  };

  // Function to handle changes in the end date picker
  const handleEndDateChange = (date) => {
    // Calls the onChange function with the current startDate and the updated end date
    onChange({ startDate, endDate: date });
  };

  // Render the JSX for the DateRangePicker component
  return (
    <div className="text-white content-center">
      {/* Start Date Picker */}
      <div>
        <label className="text-slate-300 font-sans ml-1">Start Date</label><br></br>
        {/* Date picker input for the start date */}
        <DatePicker className="text-black  bg-white border rounded p-1 bg-slate-200" selected={startDate} onChange={handleStartDateChange} />
      </div>
      {/* End Date Picker */}
      <div>
        <label className="text-slate-300 font-sans ml-1">End Date </label><br></br>
        {/* Date picker input for the end date */}
        <DatePicker className="text-black bg-dark border-black rounded p-1 bg-slate-200" selected={endDate} onChange={handleEndDateChange} />
      </div>
    </div>
  );
};

// Export the DateRangePicker component
export default DateRangePicker;
