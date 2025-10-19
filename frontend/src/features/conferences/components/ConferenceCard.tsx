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
  Close,
  OnlinePrediction,
  Grade,
  HistoryToggleOff,
  AccessTime,
  PlayCircleFilled
} from "@mui/icons-material";
import { Box, Button, Card, Chip, Grid, Stack, Typography } from "@mui/material";
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

const TIME_STATUS = {
  PAST: "Ended",
  ONGOING: "Ongoing",
  FUTURE: "Future"
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

  // const handleJoin = async () => {
  //   if (!userEmail) {
  //     toast.error("Please log in to join the conference.");
  //     return;
  //   }

  //   // 1. Schimbă starea de participare la "Joined" (Dacă nu e deja Joined)
  //   const currentStatus = getUserStatusPerConference();

  //   if (!currentStatus.isJoined) {
  //       try {
  //           await changeAttendeeStatus({
  //               conferenceId: conference.id,
  //               newStatusId: STATUS_NAME_TO_ID["Joined"],
  //               atendeeEmail: userEmail
  //           });
  //       } catch (error) {
  //           console.error("error joining conference: ", error);
  //           toast.error("Failed to register attendance status.");
  //           return; // Oprește execuția dacă statusul nu se poate schimba
  //       }
  //   }

  //   // 2. Redirecționează către Zoom DOAR dacă este ONGOING
  //   const timeStatus = getConferenceTimeStatus();

  //   if (timeStatus === TIME_STATUS.ONGOING) {
  //       // Presupunem că 'joinUrl' este câmpul care conține link-ul Zoom
  //       if (conference.joinUrl) {
  //           // Folosim window.open pentru a deschide link-ul într-o fereastră nouă, păstrând aplicația activă
  //           window.open(conference.joinUrl, "_blank");
  //           toast.info("Redirecting to the live meeting!");
  //       } else {
  //           toast.warning("The live meeting link is not available yet.");
  //       }
  //   } else if (timeStatus === TIME_STATUS.FUTURE) {
  //       // Dacă e în viitor, arată doar mesajul de succes pentru înregistrare.
  //       toast.success("Successfully registered for the conference!");
  //   } else if (timeStatus === TIME_STATUS.PAST) {
  //       toast.warning("This conference has already ended.");
  //   }
  // };

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

  // const getConferenceTimeStatus = () => {
  //   const endDate = new Date(conference.endDate);
  //   const now = new Date();
  //   return endDate < now;
  // };
  const getConferenceTimeStatus = (): (typeof TIME_STATUS)[keyof typeof TIME_STATUS] => {
    const startDate = new Date(conference.startDate);
    const endDate = new Date(conference.endDate);
    const now = new Date();

    if (endDate < now) {
      return TIME_STATUS.PAST;
    } else if (startDate <= now && endDate >= now) {
      return TIME_STATUS.ONGOING;
    } else {
      return TIME_STATUS.FUTURE;
    }
  };

  // const isPastConference = getConferenceTimeStatus();
  const conferenceTimeStatus = getConferenceTimeStatus();
  const userStatus = getUserStatusPerConference();
  const buttonsToShow = getButtonsToShow();

  const getTimeChipProps = () => {
    switch (conferenceTimeStatus) {
      case TIME_STATUS.PAST:
        return { label: "Ended", icon: <HistoryToggleOff /> };
      case TIME_STATUS.ONGOING:
        return { label: "Ongoing", icon: <PlayCircleFilled /> };
      case TIME_STATUS.FUTURE:
        return { label: "UpComing", icon: <AccessTime /> };
      default:
        return { label: "", icon: null };
    }
  };

  const timeChipProps = getTimeChipProps();

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
                  color={userStatus.hasAttended ? "default" : userStatus.isJoined ? "success" : userStatus.isWithdrawn ? "error" : "info"}
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
              Speakers invited:
            </Typography>
            <Stack spacing={1} pl={4}>
              {conference.speakersList?.filter((speaker) => speaker.isMainSpeaker).length === 0 ? (
                <Box display="flex" alignItems="center" gap={1} sx={{ borderBottom: "1px solid #eee", pb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary" fontStyle="italic">
                    To be announced
                  </Typography>
                </Box>
              ) : (
                conference.speakersList
                  ?.filter((speaker) => speaker.isMainSpeaker)
                  .map((speaker, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      justifyContent={"center"}
                      gap={1}
                      sx={{ borderBottom: "1px solid #eee", pb: 0.5 }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {speaker.speakerName}:
                      </Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Typography fontWeight={500} color="text.primary">
                          {speaker.rating}
                        </Typography>
                        <Grade />
                      </Box>
                    </Box>
                  ))
              )}
            </Stack>
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
              {/* <Chip
                icon={isPastConference ? <HistoryToggleOff /> : <AccessTime />}
                label={isPastConference ? "Ended" : "Future"}
                color={isPastConference ? "warning" : "primary"}
                size="small"
                sx={{ ml: 1, height: "20px" }}
              /> */}
              <Chip label={timeChipProps.label} color={"default"} size="small" sx={{ ml: 1, height: "20px" }} />
            </Grid>
          </Grid>
          {isOrganizer === true ? (
            <Grid>
              <Chip
                icon={<CheckCircle />}
                label={`${conference.attendeesList?.filter((attendee) => attendee.statusName === "Attended" || attendee.statusName === "Joined").length || 0} attendees`}
              />
              <Chip icon={<PeopleAlt />} label={`${conference.attendeesList?.length || 0} total`} sx={{ ml: 1 }} variant="outlined" />
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
              </>
            )}
          </Grid>
        </Grid>
      </Card>
    </>
  );
};
export default ConferenceCard;
