import {
  ArrowForward,
  Delete,
  Edit,
  LocationOn,
  Person,
  Event,
  PeopleAlt,
  EmojiObjects,
  CheckCircle,
  // EventBusy,
  Close,
  OnlinePrediction
} from "@mui/icons-material";
import { Button, Card, Chip, Grid, Typography } from "@mui/material";
import { notificationTypes } from "constants";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import type { ConferenceDto, ConferenceXAttendeeDto } from "types";
import { useSubscription } from "units/notifications";
import { deleteMutationFetcher, putMutationFetcher, useApiSWR, useApiSWRMutation } from "units/swr";
import { endpoints } from "utils";
import { useNavigate } from "react-router-dom";
import { useUserData } from "hooks";

const ATTENDANCE_STATUS = {
  JOINED: "Joined",
  WITHDRAWN: "Withdrawn",
  ATTENDED: "Attended"
} as const;

const STATUS_NAME_TO_ID = {
  Joined: 1,
  Withdrawn: 2,
  Attended: 3
} as const;

const ConferenceCard: React.FC<{ conference: ConferenceDto; isOrganizer: boolean }> = ({ conference, isOrganizer }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userEmail } = useUserData();

  const getUserStatusPerConference = () => {
    if (!userEmail) {
      return { statusName: null, isJoined: false, isWithdrawn: false, hasAttended: false, isRegistered: false };
    }

    if (!conference.attendeesList || conference.attendeesList.length === 0) {
      return { statusName: null, isJoined: false, isWithdrawn: false, hasAttended: false, isRegistered: false };
    }

    const userAttendance = conference.attendeesList.find((attendee: ConferenceXAttendeeDto) => attendee.attendeeEmail === userEmail);

    if (!userAttendance) {
      return { statusName: null, isJoined: false, isWithdrawn: false, hasAttended: false, isRegistered: false };
    }

    return {
      statusName: userAttendance.statusName,
      isJoined: userAttendance.statusName === ATTENDANCE_STATUS.JOINED,
      isWithdrawn: userAttendance.statusName === ATTENDANCE_STATUS.WITHDRAWN,
      hasAttended: userAttendance.statusName === ATTENDANCE_STATUS.ATTENDED,
      isRegistered: true
    };
  };

  const { trigger: changeAttendeeStatus, isMutating: isChangingStatus } = useApiSWRMutation(
    endpoints.conferences.updateAttendanceStatus,
    putMutationFetcher<{ conferenceId: number; newStatusId: number; atendeeEmail: string }>,
    {
      onSuccess: () => {
        refetchConferenceList();
        toast.success("Succesfully marked!");
      },
      onError: (err) => toast.error(err.message)
    }
  );

  useSubscription(notificationTypes.STATUS_UPDATED, {
    onNotification: () => {
      refetchConferenceList();
      //toast.info(t("Status updated"));
    }
  });

  const { trigger: deleteConference, isMutating: isDeletingConference } = useApiSWRMutation(
    endpoints.conferences.deleteConference,
    deleteMutationFetcher<{ id: number }>,
    {
      onError: (err) => toast.error(err.message)
    }
  );

  const { mutate: refetchConferenceList } = useApiSWR<ConferenceDto[], Error>(endpoints.conferences.conferencesForAttendees, {
    onError: (err) => toast.error(t("User.Error", { message: err.message }))
  });

  useSubscription(notificationTypes.CONFERENCE_DELETED, {
    onNotification: () => {
      refetchConferenceList();
      //toast.info(t("Conferences.ConferenceDeletedNotification"));
    }
  });

  const handleEditConference = () => {
    navigate(`/conferences/edit/${conference.id}`);
  }; //saveconferencecontainer

  const handleDetailPage = () => {
    navigate(`/conferences/details/${conference.id}`);
  }; //conferenceDataContainer

  const handleAttend = async () => {
    if (!userEmail) {
      toast.error("Please log in to attend conferences");
      return;
    }
    try {
      await changeAttendeeStatus({
        conferenceId: conference.id,
        newStatusId: STATUS_NAME_TO_ID["Attended"],
        atendeeEmail: userEmail
      });
    } catch (error) {
      console.error("error adding attendance: ", error);
      toast.error("Failed to mark attendance");
    }
  };

  const handleWithdraw = async () => {
    if (!userEmail) {
      toast.error("Please log in to attend conferences");
      return;
    }
    try {
      await changeAttendeeStatus({
        conferenceId: conference.id,
        newStatusId: STATUS_NAME_TO_ID["Withdrawn"],
        atendeeEmail: userEmail
      });
    } catch (error) {
      console.error("error adding attendance: ", error);
      toast.error("Failed to mark attendance");
    }
  };

  const handleJoin = async () => {
    if (!userEmail) {
      toast.error("Please log in to attend conferences");
      return;
    }
    try {
      await changeAttendeeStatus({
        conferenceId: conference.id,
        newStatusId: STATUS_NAME_TO_ID["Joined"],
        atendeeEmail: userEmail
      });
    } catch (error) {
      console.error("error adding attendance: ", error);
      toast.error("Failed to mark attendance");
    }
  };

  const getButtonsToShow = () => {
    const status = getUserStatusPerConference();

    if (!userEmail) {
      return { showAttend: false, showJoin: false, showWithdraw: false, showLoginMessage: true };
    }

    if (!status.isRegistered) {
      return { showAttend: true, showJoin: false, showWithdraw: false, showLoginMessage: false };
    }

    switch (status.statusName) {
      case ATTENDANCE_STATUS.JOINED:
        return { showAttend: false, showJoin: false, showWithdraw: true, showLoginMessage: false };

      case ATTENDANCE_STATUS.WITHDRAWN:
        return { showAttend: true, showJoin: false, showWithdraw: false, showLoginMessage: false };

      case ATTENDANCE_STATUS.ATTENDED:
        return { showAttend: false, showJoin: true, showWithdraw: true, showLoginMessage: false };

      default:
        return { showAttend: true, showJoin: false, showWithdraw: false, showLoginMessage: false };
    }
  };

  const userStatus = getUserStatusPerConference();
  const buttonsToShow = getButtonsToShow();

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
              {userStatus.isRegistered && !isOrganizer && userEmail && (
                <Chip
                  icon={
                    userStatus.hasAttended ? (
                      <CheckCircle />
                    ) : userStatus.isJoined ? (
                      <OnlinePrediction />
                    ) : userStatus.isWithdrawn ? (
                      <Close />
                    ) : (
                      <EmojiObjects />
                    )
                  }
                  label={
                    userStatus.hasAttended
                      ? "Attended"
                      : userStatus.isJoined
                        ? "Joined"
                        : userStatus.isWithdrawn
                          ? "Withdrawn"
                          : `Status ${userStatus.statusName}`
                  }
                  color={
                    userStatus.hasAttended ? "success" : userStatus.isJoined ? "primary" : userStatus.isWithdrawn ? "error" : "default"
                  }
                  size="small"
                />
              )}
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
          {isOrganizer === true ? (
            <Grid>
              <Chip icon={<PeopleAlt />} label={`${conference.attendeesList?.length || 0} attendees`} />
            </Grid>
          ) : (
            ""
          )}
          <Grid justifyContent={"center"} display={"flex"}>
            <Button variant="contained" onClick={handleDetailPage}>
              Show Details
            </Button>

            {isOrganizer === true ? (
              <>
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
              </>
            ) : (
              ""
            )}

            {!isOrganizer && (
              // <Grid container display={"flex"} justifyContent={"space-between"} gap={1}>
              <>
                {buttonsToShow.showLoginMessage && (
                  <Typography variant="caption" color="text.secondary">
                    Please log in to manage attendance
                  </Typography>
                )}

                {buttonsToShow.showAttend && (
                  <Button
                    size="small"
                    sx={{ color: "black", backgroundColor: "#d3e3edff", ml: 1, mr: 1 }}
                    onClick={handleAttend}
                    disabled={isChangingStatus}
                  >
                    <EmojiObjects sx={{ color: "#4639b9" }} />
                    {isChangingStatus ? "Processing..." : "Attend"}
                  </Button>
                )}

                {buttonsToShow.showJoin && (
                  <Button
                    size="small"
                    sx={{ color: "black", backgroundColor: "lightgreen", ml: 1 }}
                    onClick={handleJoin}
                    disabled={isChangingStatus}
                  >
                    <OnlinePrediction sx={{ color: "green" }} />
                    {isChangingStatus ? "Processing..." : "Join"}
                  </Button>
                )}

                {buttonsToShow.showWithdraw && (
                  <Button
                    size="small"
                    sx={{ color: "black", backgroundColor: "pink", ml: 1 }}
                    onClick={handleWithdraw}
                    disabled={isChangingStatus}
                  >
                    <Close sx={{ color: "red" }} />
                    {isChangingStatus ? "Processing..." : "Withdraw"}
                  </Button>
                )}
                {/* </Grid> */}
              </>
            )}
          </Grid>
        </Grid>
      </Card>
    </>
  );
};
export default ConferenceCard;
