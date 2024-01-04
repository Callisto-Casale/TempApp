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
    <div className="text-white content-center">
      <div>
        <label className="text-slate-300 font-sans ml-1">Start Date</label><br></br>
        <DatePicker className="text-black  bg-white border rounded p-1 bg-slate-200" selected={startDate} onChange={handleStartDateChange} />
      </div>
      <div>
        <label className="text-slate-300 font-sans ml-1">End Date </label><br></br>
        <DatePicker className="text-black bg-dark border-black rounded p-1 bg-slate-200" selected={endDate} onChange={handleEndDateChange} />
      </div>
    </div>
  );
};

export default DateRangePicker;