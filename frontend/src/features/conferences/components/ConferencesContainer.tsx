import { Grid } from "@mui/material";
import ConferenceList from "./ConferenceList";
import ConferenceListFilters from "./ConferenceListFilters";

const ConferencesContainer: React.FC = () => {
  return (
    <Grid padding={3} sx={{ width: "100%", height: "100%" }}>
      <ConferenceListFilters />
      <ConferenceList />
    </Grid>
  );
};
export default ConferencesContainer;
