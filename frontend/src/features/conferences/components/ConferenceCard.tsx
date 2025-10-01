import { ArrowForward, Delete, Edit, LocationOn, PeopleAlt, Person, Event } from "@mui/icons-material";
import { Button, Card, Chip, Grid, IconButton, Typography } from "@mui/material";
import type { Conference } from "../mockDate";

const ConferenceCard: React.FC<{ conference: Conference }> = ({ conference }) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 2,
        width: "100%",
        flex: 1
      }}
    >
      <Grid container flexDirection={"column"} padding={1} gap={2}>
        <Grid>
          <Grid container justifyContent={"space-between"} align-items={"center"} spacing={1}>
            <Typography variant="h6">{conference.name}</Typography>
            <Grid justifyContent={"flex-end"} display={"flex"} color={"orange"}>
              <IconButton size="small" sx={{ color: "orange", mr: 1 }} onClick={() => console.log("Edit clicked for:", conference.name)}>
                <Edit />
              </IconButton>
              <IconButton size="small" sx={{ color: "orange" }} onClick={() => console.log("Delete clicked for:", conference.name)}>
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
          <Typography variant="caption">
            <Grid container justifyContent="flex" flexDirection="row" color={"grey"}>
              {conference.conferenceType} | {conference.location}
            </Grid>
          </Typography>
        </Grid>
        <Grid spacing={2}>
          <Typography fontSize={13}>
            <Person sx={{ verticalAlign: "middle", mr: 1 }} />
            Main Speaker: {conference.speaker}
          </Typography>
          <Typography fontSize={13}>
            <LocationOn sx={{ verticalAlign: "middle", mr: 1 }} />
            {conference.city}, {conference.county}, {conference.country}
          </Typography>
          {/* daca e aceeasi zi vreau sa afizeze doar ora */}
          <Grid container spacing={1}>
            <Typography fontSize={13}>
              <Event sx={{ verticalAlign: "middle", mr: 1 }} />
              {conference.startDate instanceof Date ? conference.startDate.toLocaleString() : conference.startDate}
            </Typography>
            <Typography fontSize={13}>
              <ArrowForward sx={{ verticalAlign: "top", mr: 1 }} />
              {conference.endDate instanceof Date ? conference.endDate.toLocaleString() : conference.endDate}
            </Typography>
          </Grid>
        </Grid>
        <Grid>
          <Chip icon={<PeopleAlt />} label={`${conference.attendeesNumber} attendees`} />
        </Grid>
        <Grid justifyContent={"center"} display={"flex"}>
          <Button variant="contained">Show Details</Button>
        </Grid>
      </Grid>
    </Card>
  );
};
export default ConferenceCard;
