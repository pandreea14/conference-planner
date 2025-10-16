import { ArrowBack } from "@mui/icons-material";
import {
  Alert,
  Button,
  Card,
  Container,
  Fade,
  Grid,
  IconButton,
  Paper,
  Rating,
  Skeleton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useUserData } from "hooks";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { FeedbackDto } from "types";
import { useApiSWR } from "units/swr";
import { endpoints } from "utils";
import FeedbackCard from "./FeedbackCard";

const FeedbackContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { userEmail } = useUserData();
  console.log("speaker id: ", id);
  const navigation = useNavigate();
  // const [newReview, setNewReview] = useState<string>("");
  // const [newRating, setNewRating] = useState<number>(0);
  const {
    data: feedbackForSpeaker = [],
    isLoading,
    error
  } = useApiSWR<FeedbackDto[]>(`${endpoints.conferences.getFeedbackBySpeaker}/${id}`);

  console.log("feedback: ", feedbackForSpeaker);

  const handleBack = () => {
    navigation(-1);
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

  // const FeedbackCard: React.FC<{ feedback: FeedbackDto[] }> = ({ feedback }) => {
  //   return (
  //     <Grid>
  //       <Typography variant="h3" fontWeight={"bold"}>
  //         Reviews for {}
  //       </Typography>
  //       {feedback
  //         // ?.filter((fb) => fb.attendeeEmail === userEmail)
  //         .map((fb, index) => (
  //           <Grid container key={index} spacing={3} alignItems={"center"} flexDirection={"row"} display={"grid"}>
  //             <Grid container display={"flex"} justifyContent={"space-between"}>
  //               {fb.attendeeEmail}
  //               <Rating value={fb.rating} readOnly />
  //             </Grid>
  //             <Grid sx={{ xs: 12, sm: 8 }}>
  //               <TextField label="Review Message" value={fb.message} fullWidth InputProps={{ readOnly: true }} />
  //             </Grid>
  //             <Grid sx={{ xs: 6, sm: 2 }}></Grid>
  //           </Grid>
  //         ))}
  //     </Grid>
  //   );
  // };

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
              Speaker Feedback
            </Typography>
          </Stack>
        </Paper>
      </Fade>
      <Grid container spacing={3} display={"flex"} justifyContent={"center"} flexDirection={"column"}>
        <Grid sx={{ xs: 12 }} alignSelf={"center"}>
          <Typography variant="h3" fontWeight={"bold"} gutterBottom>
            Reviews
          </Typography>
        </Grid>
        <Card>
          <Typography variant="h4" padding={3}>
            Help up improve our conferences!
          </Typography>
          <Grid container spacing={3} padding={3} alignItems={"center"} flexDirection={"row"} display={"flex"} justifyContent={"center"}>
            <TextField label="Review Message"></TextField>
            <Rating></Rating>
            <Button>Submit Review</Button>
          </Grid>
        </Card>
        <FeedbackCard feedback={feedbackForSpeaker} />
      </Grid>
    </Container>
  );
};
export default FeedbackContainer;
