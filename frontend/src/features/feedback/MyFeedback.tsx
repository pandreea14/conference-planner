import { ArrowBack } from "@mui/icons-material";
import { Alert, Container, Fade, Grid, IconButton, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FeedbackCard from "./FeedbackCard";
import type { FeedbackDto } from "types";
import { useApiSWR } from "units/swr";
import { endpoints } from "utils";
import { useUserData } from "hooks";

const MyFeedback: React.FC = () => {
  const navigation = useNavigate();
  const { userEmail } = useUserData();
  const handleBack = () => {
    navigation(-1);
  };

  const { data: feedback = [], isLoading, error } = useApiSWR<FeedbackDto[]>(`${endpoints.conferences.getFeedback}`);

  console.log("feedback: ", feedback);
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
      <Fade in timeout={300}>
        <Paper
          elevation={2}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 3,
            background: "white",
            color: "black"
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
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
            <Typography variant="h5" fontWeight="bold">
              My Feedbacks
            </Typography>
          </Stack>
        </Paper>
      </Fade>
      <Grid container spacing={3} display={"flex"} justifyContent={"center"} flexDirection={"column"}>
        <Typography variant="h3" fontWeight={"bold"} alignSelf={"center"}>
          Click your review to edit
        </Typography>
        <FeedbackCard feedback={feedback.filter((fb) => fb.attendeeEmail === userEmail)} />
      </Grid>
    </Container>
  );
};
export default MyFeedback;
