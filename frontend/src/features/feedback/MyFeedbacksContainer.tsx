import { Alert, Box, Button, Container, Grid, Skeleton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { FeedbackDto } from "types";
import { useApiSWR } from "units/swr";
import { endpoints, toast } from "utils";
import { useUserData } from "hooks";
import MyFeedbacksList from "./MyFeedbacksList";
import { notificationTypes } from "constants";
import { useSubscription } from "units/notifications";
import { useTranslation } from "react-i18next";

const MyFeedbacksContainer: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigate();
  const { userEmail } = useUserData();
  const handleGoToConferences = () => {
    navigation("/allConferences");
  };

  const {
    data: feedback = [],
    isLoading,
    error,
    mutate: refetchAllFeedback
  } = useApiSWR<FeedbackDto[]>(`${endpoints.conferences.getFeedback}`);
  useSubscription(notificationTypes.FEEDBACK_DELETED, {
    onNotification: () => {
      refetchAllFeedback();
      toast.info(t("Feedback updated"));
    }
  });
  const userFeedbacks = feedback.filter((fb) => fb.attendeeEmail === userEmail);

  const handleFeedbackDeleted = () => {
    refetchAllFeedback();
    toast.info(t("Feedback refetched"));
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

  return (
    <Container maxWidth="lg" sx={{ minHeight: "100%" }}>
      <Grid container spacing={3} display={"flex"} justifyContent={"center"} flexDirection={"column"}>
        {userFeedbacks.length > 0 && (
          <>
            <Box sx={{ marginBottom: 3, padding: 2, backgroundColor: "#e3f2fd", borderRadius: 2 }}>
              <Typography variant="h5" fontWeight={"bold"} gutterBottom>
                {t("Review.Title")}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Logged in with: <strong>{userEmail}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total reviews left: <strong>{feedback.filter((fb) => fb.attendeeEmail === userEmail).length}</strong>
              </Typography>
            </Box>
            <MyFeedbacksList feedbacks={userFeedbacks} onFeedbackDeleted={handleFeedbackDeleted} />
          </>
        )}
        {userFeedbacks.length === 0 && (
          <Alert severity="info" sx={{ borderRadius: 2, marginBottom: 3 }}>
            <Typography variant="h6" gutterBottom>
              No reviews found
            </Typography>
            <Typography>You haven't left any reviews yet. Attend some conferences and share your feedback!</Typography>
            <Button
              sx={{
                backgroundColor: "darkblue",
                color: "white",
                mt: 2,
                alignSelf: "center"
              }}
              onClick={handleGoToConferences}
            >
              Go To Conferences Page
            </Button>
          </Alert>
        )}
      </Grid>
    </Container>
  );
};
export default MyFeedbacksContainer;
