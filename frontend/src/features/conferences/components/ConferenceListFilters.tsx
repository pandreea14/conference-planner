import { Box, Button, Collapse, Grid, TextField } from "@mui/material";
import { isNull } from "lodash";
import { useState } from "react";
import type { ConferenceFilterState } from "types";

const ConferenceListFilters: React.FC<{
  state: ConferenceFilterState;
  onStateChange: (value: ConferenceFilterState) => void;
}> = ({ state, onStateChange }) => {
  const handleChangeName = (event: { target: { value: string } }) => {
    onStateChange({
      ...state,
      name: event.target.value
    });
  };

  const handleChangeLocation = (event: { target: { value: string } }) => {
    onStateChange({
      ...state,
      location: event.target.value
    });
  };

  const handleChangeEmail = (event: { target: { value: string } }) => {
    onStateChange({
      ...state,
      email: event.target.value
    });
  };

  const handleChangeConferenceType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onStateChange({
      ...state,
      conferenceType: [event.target.value]
    });
  };

  const handleChangeStartDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    onStateChange({
      ...state,
      dateStart: event.target.value
    });
  };

  const handleChangeEndDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    onStateChange({
      ...state,
      dateEnd: event.target.value
    });
  };

  const formatDate = (date: string): string => {
    if (!date || date === "") return "";
    const actualDate = new Date(date);
    if (isNull(actualDate.getTime())) return "";
    return actualDate.toISOString().slice(0, 10);
  };

  const [open, setOpen] = useState<boolean>(true);

  return (
    <Box sx={{ mb: 2 }}>
      <Button variant="outlined" onClick={() => setOpen(!open)}>
        {open ? "Hide Filters" : "Show Filters"}
      </Button>

      <Collapse in={open}>
        <h2>Filter your conferences</h2>

        <Grid container gap={2} display={"flex"} justifyContent={"space-between"} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <TextField id="name" label="Conference name" variant="outlined" value={state?.name} onChange={handleChangeName} />

          <TextField id="location" label="Conference location" variant="outlined" value={state?.location} onChange={handleChangeLocation} />

          <TextField id="email" label="Organizer Email" variant="outlined" value={state?.email} onChange={handleChangeEmail} />

          <TextField
            type="date"
            label="Start Date"
            sx={{ minWidth: 250 }}
            name="startDate"
            value={formatDate(state?.dateStart)}
            onChange={handleChangeStartDate}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            type="date"
            label="End Date"
            sx={{ minWidth: 250 }}
            name="endDate"
            value={formatDate(state?.dateEnd)}
            onChange={handleChangeEndDate}
            InputLabelProps={{ shrink: true }}
          />

          <select
            name={"ConferenceType"}
            value={state?.conferenceType}
            onChange={handleChangeConferenceType}
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "16px",
              width: "25%",
              backgroundColor: "#fff"
            }}
          >
            <option value="">Select Type</option>
            <option value="Remote">Remote</option>
            <option value="OnSite">OnSite</option>
          </select>
        </Grid>
      </Collapse>
    </Box>
  );
};
export default ConferenceListFilters;
