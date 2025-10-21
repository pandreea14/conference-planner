import { ArrowBack } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Grid,
  IconButton,
  Paper,
  Rating,
  Skeleton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ConferenceDto, FeedbackDto, SpeakerDto } from "types";
import { putMutationFetcher, useApiSWR, useApiSWRMutation } from "units/swr";
import { endpoints, toast } from "utils";
import { useSubscription } from "units/notifications";
import { useTranslation } from "react-i18next";
import { notificationTypes } from "constants";
import { useUserData } from "hooks";
import FeedbacksList from "./FeedbacksList";
import { ATTENDANCE_STATUS, TIME_STATUS } from "utils/feedbackUtils";

const FeedbackContainer: React.FC = () => {
  const { conferenceId, id } = useParams<{ conferenceId: string; id: string }>();
  const { t } = useTranslation();
  const { userEmail } = useUserData();
  const navigation = useNavigate();
  const [newReview, setNewReview] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(0);
  const { data: speaker } = useApiSWR<SpeakerDto>(`${endpoints.conferences.getSpeakerById}/${id}`);
  const { data: conference } = useApiSWR<ConferenceDto>(`${endpoints.conferences.conferenceById}/${conferenceId}`);
  const {
    data: feedbackForSpeaker = [],
    mutate,
    isLoading,
    error
  } = useApiSWR<FeedbackDto[]>(`${endpoints.conferences.getFeedbackBySpeaker}/${id}`);

  const { trigger: submitFeedback, isMutating: isSubmittingFeedback } = useApiSWRMutation(
    endpoints.conferences.updateFeedback,
    putMutationFetcher<{ conferenceId: number; speakerId: number; attendeeEmail: string; rating: number; message: string }>,
    {
      onSuccess: () => {
        mutate();
        toast.success("Successfully updated!");
        setNewRating(0);
        setNewReview("");
      },
      onError: (err) => toast.error(err.message)
    }
  );
  useSubscription(notificationTypes.FEEDBACK_UPDATED, {
    onNotification: () => {
      mutate();
      toast.info(t("Feedback updated"));
    }
  });

  const handleBack = () => {
    navigation(-1);
  };

  const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
    setNewRating(newValue ?? 0);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewReview(e.target.value);
  };

  // const handleSubmitFeedback = async () => {
  //   if (!newReview.trim() || !newRating) {
  //     toast.error("Please provide both rating and review message");
  //     return;
  //   }

  //   await submitFeedback({
  //     conferenceId: parseInt(conferenceId!),
  //     speakerId: parseInt(id!),
  //     attendeeEmail: userEmail,
  //     rating: newRating,
  //     message: newReview.trim()
  //   });
  // };
  const handleSubmitFeedback = async () => {
    const reviewCheck = canSubmitReview();

    if (!reviewCheck.allowed) {
      toast.error(reviewCheck.reason || "You cannot submit a review");
      return;
    }

    if (!newReview.trim() || !newRating) {
      toast.error("Please provide both rating and review message");
      return;
    }

    await submitFeedback({
      conferenceId: parseInt(conferenceId!),
      speakerId: parseInt(id!),
      attendeeEmail: userEmail,
      rating: newRating,
      message: newReview.trim()
    });
  };

  const getConferenceTimeStatus = (): (typeof TIME_STATUS)[keyof typeof TIME_STATUS] => {
    if (!conference) return TIME_STATUS.FUTURE;

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

  const canSubmitReview = (): { allowed: boolean; reason?: string } => {
    if (!userEmail) {
      return { allowed: false, reason: "Please log in to submit a review" };
    }

    if (!conference) {
      return { allowed: false, reason: "Conference data not loaded" };
    }

    const timeStatus = getConferenceTimeStatus();

    // Can only review if conference is ongoing or ended
    if (timeStatus === TIME_STATUS.FUTURE) {
      return { allowed: false, reason: "You can only submit reviews for ongoing or completed conferences" };
    }

    // Check if user attended or joined the conference
    const userAttendance = conference.attendeesList?.find((attendee) => attendee.attendeeEmail === userEmail);

    if (!userAttendance) {
      return { allowed: false, reason: "You must register for the conference to leave a review" };
    }

    if (userAttendance.statusName === ATTENDANCE_STATUS.WITHDRAWN) {
      return { allowed: false, reason: "You have withdrawn from this conference" };
    }

    if (userAttendance.statusName === ATTENDANCE_STATUS.KICKED) {
      return { allowed: false, reason: "You cannot submit reviews for this conference" };
    }

    if (userAttendance.statusName !== ATTENDANCE_STATUS.JOINED && userAttendance.statusName !== ATTENDANCE_STATUS.ATTENDED) {
      return { allowed: false, reason: "You must attend or join the conference to leave a review" };
    }

    return { allowed: true };
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 3, borderRadius: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={300} sx={{ mb: 3, borderRadius: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          <Typography variant="h6">Error loading conference</Typography>
          <Typography>{error.message}</Typography>
        </Alert>
      </Container>
    );
  }

  const reviewCheck = canSubmitReview();
  return (
    <Container maxWidth="lg" sx={{ minHeight: "100%" }}>
      <Paper
        sx={{
          position: "sticky",
          zIndex: 1000,
          top: 0,
          padding: 2,
          borderRadius: 3,
          background: "white",
          color: "black"
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ maxWidth: "lg", mx: "auto" }}>
          <IconButton
            onClick={handleBack}
            sx={{
              backgroundColor: "darkblue",
              color: "white",
              "&:hover": {
                backgroundColor: "lightblue",
                transform: "translateX(-2px)"
              },
              transition: "all 0.2s ease"
            }}
          >
            <ArrowBack />
          </IconButton>

          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              flexGrow: 1,
              textAlign: "center",
              pr: 5
            }}
          >
            Feedback for {speaker?.name || "Speaker"}
          </Typography>
        </Stack>
      </Paper>
      <Grid container spacing={3} display={"flex"} justifyContent={"center"} flexDirection={"column"}>
        {!reviewCheck.allowed && (
          <Alert severity="warning" sx={{ mx: 3, mt: 2 }}>
            {reviewCheck.reason}
          </Alert>
        )}
        <Card sx={{ width: "100%", mb: 3 }}>
          <Typography variant="h4" padding={3}>
            Help us improve our conferences and speakers!
          </Typography>
          <Grid container spacing={3} padding={3} alignItems={"center"} flexDirection={"row"} display={"flex"} justifyContent={"center"}>
            <Grid sx={{ xs: 12, md: 4 }}>
              <TextField
                label="Review Message"
                multiline
                rows={2}
                fullWidth
                value={newReview}
                onChange={handleMessageChange}
                placeholder="Share your thoughts about this speaker..."
              />
            </Grid>

            <Grid sx={{ xs: 12, md: 3 }}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="body2" gutterBottom>
                  Your Rating: {newRating}/5
                </Typography>
                <Rating
                  name="speaker-rating"
                  value={newRating}
                  onChange={handleRatingChange}
                  precision={0.5}
                  size="large"
                  sx={{
                    fontSize: "2rem",
                    "& .MuiRating-iconFilled": {
                      color: "#ffd700"
                    },
                    "& .MuiRating-iconHover": {
                      color: "#ffcc02"
                    }
                  }}
                />
              </Box>
            </Grid>

            <Grid sx={{ xs: 12, md: 4 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSubmitFeedback}
                disabled={!reviewCheck.allowed || !newReview.trim() || !newRating || isSubmittingFeedback}
                sx={{
                  padding: 2,
                  height: "56px",
                  backgroundColor: "darkblue",
                  "&:hover": { backgroundColor: "blue" }
                }}
              >
                {isSubmittingFeedback ? "Submitting..." : "Submit Review"}
              </Button>
            </Grid>
          </Grid>
        </Card>
        <FeedbacksList feedbacks={feedbackForSpeaker} />
      </Grid>
    </Container>
  );
};
export default FeedbackContainer;
