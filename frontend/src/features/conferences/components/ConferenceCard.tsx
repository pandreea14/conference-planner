import { ArrowForward, Delete, Edit, LocationOn, Person, Event, PeopleAlt } from "@mui/icons-material";
import { Button, Card, Chip, Grid, Typography } from "@mui/material";
import { notificationTypes } from "constants";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import type { ConferenceDto } from "types";
import { useSubscription } from "units/notifications";
import { deleteMutationFetcher, useApiSWR, useApiSWRMutation } from "units/swr";
import { endpoints } from "utils";
import { useNavigate } from "react-router-dom";

const ConferenceCard: React.FC<{ conference: ConferenceDto }> = ({ conference }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { trigger: deleteConference, isMutating: isDeletingConference } = useApiSWRMutation(
    endpoints.conferences.deleteConference,
    deleteMutationFetcher<{ id: number }>,
    {
      onError: (err) => toast.error(err.message)
    }
  );

  const {
    // data: conferences = [],
    // isLoading: isLoadingConferenceList,
    mutate: refetchConferenceList
  } = useApiSWR<ConferenceDto[], Error>(endpoints.conferences.conferencesForAttendees, {
    onError: (err) => toast.error(t("User.Error", { message: err.message }))
  });

  useSubscription(notificationTypes.CONFERENCE_DELETED, {
    onNotification: () => {
      refetchConferenceList();
      toast.info(t("Conferences.ConferenceDeletedNotification"));
    }
  });

  // const { data: conferenceById } = useApiSWR<ConferenceDto>(`${endpoints.conferences.conferenceById}/${conference.id}`);
  // console.log("conference ", conferenceById);
  // console.log("conference id", conference.id);

  const handleEditConference = () => {
    navigate(`/conferences/edit/${conference.id}`);
  }; //saveconferencecontainer

  const handleDetailPage = () => {
    navigate(`/conferences/details/${conference.id}`);
  }; //conferenceDataContainer

  return (
    <>
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
            </Grid>
            <Typography variant="caption">
              <Grid container justifyContent="flex" flexDirection="row" color={"grey"}>
                {conference.conferenceTypeName} | {conference.locationName}
              </Grid>
            </Typography>
          </Grid>
          <Grid spacing={2}>
            <Typography fontSize={13}>
              <Person sx={{ verticalAlign: "middle", mr: 1 }} />
              Main Speaker:
              {conference.mainSpeakerName ? " " + conference.mainSpeakerName : " none yet"}
            </Typography>
            <Typography fontSize={13}>
              <LocationOn sx={{ verticalAlign: "middle", mr: 1 }} />
              {conference.cityName}, {conference.countyName}, {conference.countryName}
            </Typography>
            <Grid container spacing={1}>
              <Typography fontSize={13}>
                <Event sx={{ verticalAlign: "middle", mr: 1 }} />
                {new Date(conference.startDate).toLocaleString("en-CA", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })}
              </Typography>
              <Typography fontSize={13}>
                <ArrowForward sx={{ verticalAlign: "top", mr: 1 }} />
                {new Date(conference.endDate).toLocaleString("en-CA", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })}
              </Typography>
            </Grid>
          </Grid>
          <Grid>
            <Chip icon={<PeopleAlt />} label={`${conference.attendeesList?.length || 0} attendees`} />
          </Grid>
          <Grid justifyContent={"flex-end"} display={"flex"}>
            <Button variant="contained" onClick={handleDetailPage}>
              Show Details
            </Button>
            <Button size="small" sx={{ color: "black", mr: 1, ml: 1, backgroundColor: "beige" }} onClick={handleEditConference}>
              <Edit sx={{ color: "orange" }} /> Edit
            </Button>
            <Button
              size="small"
              sx={{ color: "black", backgroundColor: "pink" }}
              onClick={() => deleteConference({ id: conference.id })}
              disabled={isDeletingConference}
            >
              <Delete sx={{ color: "red" }} /> Remove
            </Button>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};
export default ConferenceCard;
