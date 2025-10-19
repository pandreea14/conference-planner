import { Delete } from "@mui/icons-material";
import { Box, Card, CardContent, Grid, IconButton, Rating, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { ConferenceDto, FeedbackDto, SpeakerDto } from "types";
import { deleteMutationFetcher, useApiSWR, useApiSWRMutation } from "units/swr";
import { endpoints, toast } from "utils";

const MyFeedbackCard: React.FC<{ feedback: FeedbackDto; index: number; onFeedbackDeleted?: () => void }> = ({
  feedback,
  index,
  onFeedbackDeleted
}) => {
  const navigation = useNavigate();
  const { t } = useTranslation();
  const { data: speaker } = useApiSWR<SpeakerDto>(`${endpoints.conferences.getSpeakerById}/${feedback.speakerId}`);
  const { data: conference } = useApiSWR<ConferenceDto>(`${endpoints.conferences.conferenceById}/${feedback.conferenceId}`);

  const { trigger: deleteFeedback, isMutating: isDeletingFeedback } = useApiSWRMutation(
    endpoints.conferences.deleteFeedback,
    deleteMutationFetcher<{ id: number }>,
    {
      onSuccess: () => {
        onFeedbackDeleted?.();
        toast.success(t("Feedback deleted successfully"));
      },
      onError: (err) => toast.error(err.message)
    }
  );
  const handleFeedbackNav = () => {
    navigation(`/conferences/details/${conference?.id}/feedback/${speaker?.speakerId}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteFeedback({ id: feedback.id });
  };

  return (
    <Grid sx={{ xs: 12, md: 4 }} key={index}>
      <Card
        onClick={handleFeedbackNav}
        sx={{
          height: "100%",
          boxShadow: 3,
          borderRadius: 2,
          transition: "transform 0.2s",
          cursor: "pointer",
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

          <Box sx={{ borderTop: 1, borderBottom: 1, borderColor: "divider", pt: 2, pb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {speaker?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              speaker in
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {conference?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              conference
            </Typography>
          </Box>
        </CardContent>
        <Box sx={{ p: 2, textAlign: "center" }}>
          <IconButton
            onClick={handleDelete}
            disabled={isDeletingFeedback}
            sx={{
              color: "red",
              "&:hover": {
                backgroundColor: "rgba(255, 0, 0, 0.1)"
              }
            }}
          >
            <Delete />
          </IconButton>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            Delete review
          </Typography>
        </Box>
      </Card>
    </Grid>
  );
};
export default MyFeedbackCard;
