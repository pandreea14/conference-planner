import { Close } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Modal, TextField } from "@mui/material";
import { isNull } from "lodash";
import { useState } from "react";
import type { ConferenceFilterState, DictionaryItem, SpeakerDto } from "types";

const ConferenceListFilters: React.FC<{
  state: ConferenceFilterState;
  onStateChange: (value: ConferenceFilterState) => void;
  conferenceTypes: DictionaryItem[];
  speakers: SpeakerDto[];
}> = ({ state, onStateChange, conferenceTypes, speakers }) => {
  const handleChangeName = (field: string, event: { target: { value: string } }) => {
    onStateChange({
      ...state,
      [field]: event.target.value
    });
  };

  const handleChangeDropDown = (field: string, event: React.ChangeEvent<HTMLSelectElement>) => {
    onStateChange({
      ...state,
      [field]: [event.target.value]
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
      conferenceType: [""],
      speakerName: [""]
    });
  };
  const handleSearch = () => {
    setOpen(false);
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
            <TextField
              id="name"
              label="Conference name"
              variant="outlined"
              value={state?.name}
              onChange={(event) => handleChangeName("name", event)}
            />

            <TextField
              id="location"
              label="Conference location"
              variant="outlined"
              value={state?.location}
              onChange={(event) => handleChangeName("location", event)}
            />

            <TextField
              id="email"
              label="Organizer Email"
              variant="outlined"
              value={state?.email}
              onChange={(event) => handleChangeName("email", event)}
            />

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
              value={state?.speakerName}
              onChange={(event) => handleChangeDropDown("speakerName", event)}
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
              {speakers.map((ct) => (
                <option key={ct.id} value={ct.name}>
                  {ct.name}
                </option>
              ))}
            </select>

            <select
              name={"ConferenceType"}
              value={state?.conferenceType}
              onChange={(event) => handleChangeDropDown("conferenceType", event)}
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
