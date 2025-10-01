import { TextField } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";

const ConferenceListFilters: React.FC = () => {
  const [filters, setFilters] = useState({
    name: "",
    location: ""
    // startDate: Date,
    // endDate: Date
  });
  return (
    <>
      {/* <DatePicker
        label="start date picker"
        value={filters.startDate}
        onChange={(newValue) => setFilters({ ...filters, startDate: newValue })}
      />
      <DatePicker label="end date picker" value={filters.endDate} onChange={(newValue) => setFilters({ ...filters, endDate: newValue })} /> */}
      <TextField
        id="name"
        label="Conference name"
        variant="outlined"
        value={filters.name}
        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
      />
      <TextField
        id="location"
        label="Conference location"
        variant="outlined"
        value={filters.location}
        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
      />
    </>
  );
};
export default ConferenceListFilters;
