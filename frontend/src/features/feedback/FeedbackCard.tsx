import { Box, Card, CardContent, Grid, Rating, Typography } from "@mui/material";
import type { ConferenceDto, FeedbackDto } from "types";
import { useApiSWR } from "units/swr";
import { endpoints } from "utils";

const FeedbackCard: React.FC<{ feedback: FeedbackDto; index: number }> = ({ feedback, index }) => {
  const { data: conference } = useApiSWR<ConferenceDto>(`${endpoints.conferences.conferenceById}/${feedback?.conferenceId}`);
  console.log("conf id: ", feedback.conferenceId);

  return (
    <Grid sx={{ xs: 12, md: 4 }} key={index}>
      <Card
        sx={{
          height: "100%",
          boxShadow: 3,
          borderRadius: 2,
          transition: "transform 0.2s",
          backgroundColor: index % 2 === 0 ? "#f5f5f5" : "white",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
            backgroundColor: index % 2 === 0 ? "#eeeeee" : "#fafafa"
          }
        }}
      >
        <CardContent sx={{ padding: 4, textAlign: "center" }}>
          <Rating
            value={feedback.rating}
            readOnly
            size="large"
            precision={0.5}
            sx={{
              mb: 2,
              "& .MuiRating-iconFilled": {
                color: "#ffd700"
              },
              "& .MuiRating-iconHover": {
                color: "#ffcc02"
              }
            }}
          />

          <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
            {feedback.rating >= 4 ? "Awesome Speaker" : feedback.rating >= 3 ? "Insightful" : "Did not enjoy that much"}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mb: 3,
              fontStyle: "italic",
              color: "text.secondary",
              minHeight: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            "{feedback.message}"
          </Typography>

          <Box sx={{ borderTop: 1, borderColor: "divider", pt: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {feedback.attendeeEmail}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Conference Attendee regarding
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {conference?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Conference
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default FeedbackCard;
