import { Close } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Modal, TextField } from "@mui/material";
import { isNull } from "lodash";
import { useState } from "react";
import type { ConferenceFilterState, DictionaryItem } from "types";

const ConferenceListFilters: React.FC<{
  state: ConferenceFilterState;
  onStateChange: (value: ConferenceFilterState) => void;
  conferenceTypes: DictionaryItem[];
}> = ({ state, onStateChange, conferenceTypes }) => {
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

  const formatDate = (date: string): string => {
    if (!date || date === "") return "";
    const actualDate = new Date(date);
    if (isNull(actualDate.getTime())) return "";
    return actualDate.toISOString().slice(0, 10);
  };

  const [open, setOpen] = useState<boolean>(false);
  const handleResetFilters = () => {
    onStateChange({
      name: "",
      location: "",
      dateStart: "",
      email: "",
      conferenceType: [""]
    });
  };
  const handleSearch = () => {
    setOpen(false);

    console.log("Search applied", state);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Button variant="outlined" onClick={() => setOpen(!open)}>
        {open ? "Hide Filters" : "Filter your conferences"}
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ p: 4, backgroundColor: "#fff", borderRadius: 2, boxShadow: 24, maxWidth: 600, mx: "auto", mt: 8 }}>
          <Grid container display={"flex"} justifyContent={"space-between"}>
            <h2>Find conferences for you</h2>
            <IconButton onClick={() => setOpen(!open)}>
              <Close />
            </IconButton>
          </Grid>
          <Grid
            container
            gap={2}
            display={"flex"}
            justifyContent={"space-between"}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{ mt: 2 }}
          >
            <TextField id="name" label="Conference name" variant="outlined" value={state?.name} onChange={handleChangeName} />

            <TextField
              id="location"
              label="Conference location"
              variant="outlined"
              value={state?.location}
              onChange={handleChangeLocation}
            />

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

            <select
              name={"SpeakerName"}
              value={state?.conferenceType}
              onChange={handleChangeConferenceType}
              style={{
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
                width: "47%",
                backgroundColor: "#fff"
              }}
            >
              <option value="">Select speaker</option>
              {conferenceTypes.map((ct) => (
                <option key={ct.id} value={ct.name}>
                  {ct.name}
                </option>
              ))}
            </select>

            <select
              name={"ConferenceType"}
              value={state?.conferenceType}
              onChange={handleChangeConferenceType}
              style={{
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
                width: "47%",
                backgroundColor: "#fff"
              }}
            >
              <option value="">Select type</option>
              {conferenceTypes.map((ct) => (
                <option key={ct.id} value={ct.name}>
                  {ct.name}
                </option>
              ))}
            </select>
          </Grid>
          <Grid container sx={{ mt: 3 }} display={"flex"} justifyContent={"space-around"}>
            <Button variant="outlined" onClick={handleResetFilters} sx={{ background: "darkblue", color: "white" }}>
              Reset Filters
            </Button>
            <Button variant="outlined" onClick={handleSearch} sx={{ background: "darkblue", color: "white" }}>
              Display
            </Button>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};
export default ConferenceListFilters;
