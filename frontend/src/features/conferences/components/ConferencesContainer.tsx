import { Button, Card, Chip, Grid, Typography } from "@mui/material";
import { mockData } from "../mockDate";
import { Person, Event, LocationOn, PeopleAlt } from "@mui/icons-material";

const ConferencesContainer: React.FC = () => {
  return (
    <Grid container spacing={2} padding={1} sx={{ width: "100%", height: "100%" }}>
      {mockData.map((item) => (
        <Grid key={item.id} sx={{ flex: "0 0 33.3%", display: "flex" }}>
          <Card sx={{ display: "flex", flexDirection: "column", padding: 1, width: "100%" }}>
            <Grid container flexDirection="column" padding={1} gap={2}>
              <Typography variant="h5">{item.name}</Typography>
              <Typography variant="caption">
                <Grid container justifyContent="flex" flexDirection="row">
                  {item.conferenceType} | {item.location}
                </Grid>
              </Typography>
              <Grid spacing={2}>
                <Typography>
                  <Person sx={{ verticalAlign: "middle", mr: 1 }} />
                  Main Speaker: {item.speaker}
                </Typography>
                <Typography>
                  <LocationOn sx={{ verticalAlign: "middle", mr: 1 }} />
                  {item.city}, {item.county}, {item.country}
                </Typography>
                <Typography>
                  <Event sx={{ verticalAlign: "middle", mr: 1 }} />
                  {item.startDate}
                </Typography>
              </Grid>
              <Grid>
                <Chip icon={<PeopleAlt />} label={`${item.attendeesNumber} attendees`} />
              </Grid>
              <Grid>
                <Button variant="contained">View</Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
export default ConferencesContainer;
