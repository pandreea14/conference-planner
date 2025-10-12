import { ArrowBack } from "@mui/icons-material";
import { Card, Grid, IconButton, Paper, Typography, Divider, Box, Chip, Avatar } from "@mui/material";
import { isNull } from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import type { ConferenceDto } from "types";
import { useApiSWR } from "units/swr";
import { endpoints } from "utils";

const ConferenceDetailsContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: conference, error, isLoading } = useApiSWR<ConferenceDto>(`${endpoints.conferences.conferenceById}/${id}`);

  const handleBack = () => {
    navigate("/conferences");
  };

  if (isLoading) {
    return (
      <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <Typography>Loading conference...</Typography>
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <Typography color="error">Error loading conference: {error.message}</Typography>
      </Grid>
    );
  }
  const formatDate = (date?: string): string => {
    if (!date || date === "") return "";
    const actualDate = new Date(date);
    if (isNull(actualDate.getTime())) return "";
    return actualDate.toISOString().slice(0, 10);
  };

  return (
    <Grid container direction="row" spacing={3} sx={{ px: 4, py: 2, minHeight: "100%" }}>
      {/* Header */}
      <Grid>
        <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid>
              <IconButton onClick={handleBack} sx={{ backgroundColor: "darkblue" }}>
                <ArrowBack sx={{ color: "white" }} />
              </IconButton>
            </Grid>
            <Grid>
              <Typography variant="h4">Conference Details</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Main Details Card */}
      <Grid>
        <Card sx={{ p: 3 }}>
          {/* General Info */}
          <Typography variant="h5" gutterBottom>
            {conference?.name}
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid sx={{ xs: "12", sm: "6" }}>
              <Typography variant="subtitle1">
                <strong>Type:</strong> {conference?.conferenceTypeName}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Category:</strong> {conference?.categoryName}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Organizer Email:</strong> {conference?.organizerEmail}
              </Typography>
            </Grid>

            {/* Location */}
            <Grid sx={{ xs: "12", sm: "6" }}>
              <Typography variant="subtitle1">
                <strong>Location:</strong> {conference?.location?.name}
              </Typography>
              <Typography variant="subtitle1">{conference?.location?.address}</Typography>
            </Grid>
          </Grid>

          {/* Dates */}
          <Box mt={3}>
            <Typography variant="subtitle1">
              <strong>Dates:</strong> {formatDate(conference?.startDate)} – {formatDate(conference?.endDate)}
            </Typography>
          </Box>
        </Card>
      </Grid>

      {/* Speakers Section */}
      {(conference?.speakerList?.length ?? 0) > 0 && (
        <Grid>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Speakers
            </Typography>
            <Grid container spacing={2}>
              {conference?.speakerList?.map((speaker, index) => (
                <Grid sx={{ xs: "12", sm: "6", md: "4" }} key={index}>
                  <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Avatar sx={{ mr: 2 }}>{speaker.name.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="subtitle1">{speaker.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Nationality: {speaker.nationality}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Rating: {speaker.rating}/5
                        </Typography>
                        {speaker.isMainSpeaker && <Chip label="Main Speaker" size="small" color="primary" sx={{ mt: 1 }} />}
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default ConferenceDetailsContainer;
