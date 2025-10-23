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
  PlayCircleFilled,
  Block
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import { notificationTypes } from "constants";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import type { ConferenceDto, ConferenceXAttendeeDto } from "types";
import { useSubscription } from "units/notifications";
import { deleteMutationFetcher, putMutationFetcher, useApiSWR, useApiSWRMutation } from "units/swr";
import { endpoints } from "utils";
import { useNavigate } from "react-router-dom";
import { useUserData } from "hooks";
import { ATTENDANCE_STATUS, TIME_STATUS } from "utils/feedbackUtils";
import { useState } from "react";
import QRCode from "react-qr-code";

const STATUS_NAME_TO_ID = {
  Joined: 1,
  Withdrawn: 2,
  Attended: 3,
  Kicked: 4
} as const;

const ConferenceCard: React.FC<{ conference: ConferenceDto; isOrganizer: boolean }> = ({ conference, isOrganizer }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userEmail } = useUserData();

  const [qrOpen, setQrOpen] = useState(false);
  const [qrValue, setQrValue] = useState<string>("");

  const { trigger: changeAttendeeStatus, isMutating: isChangingStatus } = useApiSWRMutation(
    endpoints.conferences.updateAttendanceStatus,
    putMutationFetcher<{ conferenceId: number; newStatusId: number; atendeeEmail: string }>,
    {
      onSuccess: () => {
        refetchConferenceList();
        toast.success("Successfully marked!");
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

      const payload = conference.joinUrl ? conference.joinUrl : JSON.stringify({ conferenceId: conference.id, userEmail, ts: Date.now() });

      setQrValue(payload);
      setQrOpen(true);

      toast.success("Successfully registered! Scan the QR to join the meeting.");
    } catch (error) {
      console.error("error adding attendance: ", error);
      toast.error("Failed to mark attendance");
    }
  };

  const getUserStatusPerConference = () => {
    if (!userEmail) {
      return { statusName: null, isJoined: false, isWithdrawn: false, hasAttended: false, isKicked: false, isRegistered: false };
    }

    if (!conference.attendeesList || conference.attendeesList.length === 0) {
      return { statusName: null, isJoined: false, isWithdrawn: false, hasAttended: false, isKicked: false, isRegistered: false };
    }

    const userAttendance = conference.attendeesList.find((attendee: ConferenceXAttendeeDto) => attendee.attendeeEmail === userEmail);

    if (!userAttendance) {
      return { statusName: null, isJoined: false, isWithdrawn: false, hasAttended: false, isKicked: false, isRegistered: false };
    }

    return {
      statusName: userAttendance.statusName,
      isJoined: userAttendance.statusName === ATTENDANCE_STATUS.JOINED,
      isWithdrawn: userAttendance.statusName === ATTENDANCE_STATUS.WITHDRAWN,
      hasAttended: userAttendance.statusName === ATTENDANCE_STATUS.ATTENDED,
      isKicked: userAttendance.statusName === ATTENDANCE_STATUS.KICKED,
      isRegistered: true
    };
  };

  const getButtonsToShow = () => {
    const status = getUserStatusPerConference();
    const timeStatus = getConferenceTimeStatus();

    if (timeStatus === TIME_STATUS.PAST) {
      return {
        showAttend: false,
        showJoin: false,
        showWithdraw: false,
        showLoginMessage: false
      };
    }

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

      case ATTENDANCE_STATUS.KICKED:
        return { showAttend: false, showJoin: false, showWithdraw: false, showLoginMessage: false };

      default:
        return { showAttend: true, showJoin: false, showWithdraw: false, showLoginMessage: false };
    }
  };

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
                    ) : userStatus.isKicked ? (
                      <Block />
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
                          : userStatus.isKicked
                            ? "Banned by organizer"
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
              <Chip label={timeChipProps.label} color={"default"} size="small" sx={{ ml: 1, height: "20px" }} />
            </Grid>
          </Grid>
          {isOrganizer === true ? (
            <Grid>
              <Chip
                icon={<CheckCircle />}
                label={`${conference.attendeesList?.filter((attendee) => attendee.statusName === "Attended" || attendee.statusName === "Joined").length || 0} attendees`}
              />
              <Chip
                icon={<PeopleAlt />}
                label={`${conference.attendeesList?.length || 0} interacted with`}
                sx={{ ml: 1 }}
                variant="outlined"
              />
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
      <Dialog open={qrOpen} onClose={() => setQrOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          Join Conference
          <IconButton aria-label="close" onClick={() => setQrOpen(false)} sx={{ position: "absolute", right: 8, top: 8 }} size="large">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" p={2}>
            {qrValue ? <QRCode value={qrValue} size={200} /> : <Typography>No QR available</Typography>}
          </Box>
        </DialogContent>
        <DialogActions sx={{ alignSelf: "center" }}>
          <Alert>Info: View ticket in conference description</Alert>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ConferenceCard;
