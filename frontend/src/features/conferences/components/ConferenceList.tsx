import { Grid } from "@mui/material";
import { mockData } from "../mockDate";
import ConferenceCard from "./ConferenceCard";

const ConferenceList: React.FC = () => {
  return (
    <Grid container spacing={1} padding={1} sx={{ width: "100%", height: "100%", overflow: "auto" }}>
      {mockData.map((item) => (
        <Grid key={item.id} size={{ xs: 6, md: 6 }} sx={{ display: "flex", padding: 1 }}>
          <ConferenceCard conference={item} />
        </Grid>
      ))}
    </Grid>
  );
};
export default ConferenceList;
