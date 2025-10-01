import { Button, Card, Chip, Grid, Typography, IconButton } from "@mui/material";
import { mockData } from "../mockDate";
import { Person, Event, LocationOn, PeopleAlt, Edit, Delete, ArrowForward } from "@mui/icons-material";

const ConferencesContainer: React.FC = () => {
  return (
    <Grid container spacing={1} padding={1} sx={{ width: "100%", height: "100%" }}>
      {mockData.map((item) => (
        <Grid key={item.id} size={{ xs: 6, md: 6 }} sx={{ display: "flex", padding: 1 }}>
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
                  <Typography variant="h6">{item.name}</Typography>
                  <Grid justifyContent={"flex-end"} display={"flex"} color={"orange"}>
                    <IconButton size="small" sx={{ color: "orange", mr: 1 }} onClick={() => console.log("Edit clicked for:", item.name)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "orange" }} onClick={() => console.log("Delete clicked for:", item.name)}>
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
                <Typography variant="caption">
                  <Grid container justifyContent="flex" flexDirection="row" color={"grey"}>
                    {item.conferenceType} | {item.location}
                  </Grid>
                </Typography>
              </Grid>
              <Grid spacing={2}>
                <Typography fontSize={13}>
                  <Person sx={{ verticalAlign: "middle", mr: 1 }} />
                  Main Speaker: {item.speaker}
                </Typography>
                <Typography fontSize={13}>
                  <LocationOn sx={{ verticalAlign: "middle", mr: 1 }} />
                  {item.city}, {item.county}, {item.country}
                </Typography>
                {/* daca e aceeasi zi vreau sa afizeze doar ora */}
                <Grid container justifyContent={"flex-start"} spacing={1}>
                  <Typography fontSize={13}>
                    <Event sx={{ verticalAlign: "middle", mr: 1 }} />
                    {item.startDate}
                  </Typography>
                  <Typography fontSize={13}>
                    <ArrowForward sx={{ verticalAlign: "top", mr: 1 }} />
                    {item.endDate}
                  </Typography>
                </Grid>
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
