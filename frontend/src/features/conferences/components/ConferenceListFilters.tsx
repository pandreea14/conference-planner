import { Box, TextField } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers";

const ConferenceListFilters: React.FC<{
  filterName: string;
  onFilterNameChange: (value: string) => void;
  filterLocation: string;
  onFilterLocationChange: (value: string) => void;
  // filterStartDate: Date;
  // onFilterStartDateChange: (value: Date) => void;
}> = ({ filterName, onFilterNameChange, filterLocation, onFilterLocationChange }) => {
  const handleFilterNameChange = (event: { target: { value: string } }) => onFilterNameChange(event.target.value);
  const handleFilterLocationChange = (event: { target: { value: string } }) => onFilterLocationChange(event.target.value);
  // const handleFilterStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = event.target.value;
  //   onFilterStartDateChange(value ? new Date(value) : new Date(""));
  // };
  //> si < fata de data mea sau ceva

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
      {/* <TextField
        type="date"
        sx={{ minWidth: 250 }}
        name="startDate"
        value={filterStartDate ? filterStartDate.toISOString().slice(0, 10) : ""}
        onChange={handleFilterStartDateChange}
      /> */}

      {/* <TextField type="date" sx={{ minWidth: 250 }} name="startDate" value={filterStartDate} onChange={handleFilterStartDateChange} /> */}
    </Box>
  );
};
export default ConferenceListFilters;
