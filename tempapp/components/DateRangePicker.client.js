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
    <div>
      <h2>Select Date Range</h2>
      <div>
        <label>Start Date: </label>
        <DatePicker selected={startDate} onChange={handleStartDateChange} />
      </div>
      <div>
        <label>End Date: </label>
        <DatePicker selected={endDate} onChange={handleEndDateChange} />
      </div>
    </div>
  );
};

export default DateRangePicker;