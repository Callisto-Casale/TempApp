import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateRangePicker = ({ startDate, endDate, onChange }) => {
  const handleStartDateChange = (date) => {
    onChange({ startDate: date, endDate });
  };

  const handleEndDateChange = (date) => {
    onChange({ startDate, endDate: date });
  };

  return (
    <div className="text-white">
      <h2>Select Date Range</h2>
      <div>
        <label>Start Date: </label><br></br>
        <DatePicker className="text-black" selected={startDate} onChange={handleStartDateChange} />
      </div>
      <div>
        <label>End Date: </label><br></br>
        <DatePicker className="text-black" selected={endDate} onChange={handleEndDateChange} />
      </div>
    </div>
  );
};

export default DateRangePicker;