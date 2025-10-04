import { Box, TextField } from "@mui/material";
import { isNull } from "lodash";

const ConferenceListFilters: React.FC<{
  filterName: string;
  onFilterNameChange: (value: string) => void;
  filterLocation: string;
  onFilterLocationChange: (value: string) => void;
  filterStartDate: string;
  onFilterStartDateChange: (value: string) => void;
}> = ({ filterName, onFilterNameChange, filterLocation, onFilterLocationChange, filterStartDate, onFilterStartDateChange }) => {
  const handleFilterNameChange = (event: { target: { value: string } }) => onFilterNameChange(event.target.value);
  const handleFilterLocationChange = (event: { target: { value: string } }) => onFilterLocationChange(event.target.value);
  // const handleFilterDateChange = (event: { target: { value: Date } }) => onFilterStartDateChange(event.target.value);
  const handleFilterDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterStartDateChange(event.target.value);
  };

  const formatDate = (date: string): string => {
    if (!date || date === "") return "";
    const actualDate = new Date(date);
    if (isNull(actualDate.getTime())) return "";
    return actualDate.toISOString().slice(0, 10);
  };

  return (
    <Box gap={2} display={"flex"} justifyContent={"space-around"}>
      <TextField id="name" label="Conference name" variant="outlined" value={filterName} onChange={handleFilterNameChange} />

      <TextField
        id="location"
        label="Conference location"
        variant="outlined"
        value={filterLocation}
        onChange={handleFilterLocationChange}
      />
      <TextField
        type="date"
        placeholder="Start Date"
        sx={{ minWidth: 250 }}
        name="startDate"
        value={formatDate(filterStartDate)}
        onChange={handleFilterDateChange}
      />
      {/* <TextField
        type="date"
        label="End Date"
        sx={{ minWidth: 250 }}
        name="endDate"
        value={filterStartDate ? filterStartDate.toISOString().slice(0, 10) : ""}
        onChange={handleFilterDateChange}
      /> */}
    </Box>
  );
};
export default ConferenceListFilters;
