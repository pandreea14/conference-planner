import { ArrowBack, ArrowForward, LocationOn, Email, CalendarToday, Category, BusinessCenter, Star, Person } from "@mui/icons-material";
import {
  Card,
  Grid,
  IconButton,
  Paper,
  Typography,
  Divider,
  Box,
  Chip,
  Avatar,
  Container,
  Skeleton,
  Alert,
  Fade,
  CardContent,
  Stack
} from "@mui/material";
import { isNull } from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import type { DictionaryItem, ConferenceDto } from "types";
import { useApiSWR } from "units/swr";
import { endpoints } from "utils";
// import { APIProvider } from "@vis.gl/react-google-maps";

const ConferenceDetailsContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigation = useNavigate();
  const { data: conference, error, isLoading } = useApiSWR<ConferenceDto>(`${endpoints.conferences.conferenceById}/${id}`);
  const { data: countries } = useApiSWR<DictionaryItem[]>(endpoints.dictionaries.countries);
  const { data: counties } = useApiSWR<DictionaryItem[]>(endpoints.dictionaries.counties);
  const { data: cities } = useApiSWR<DictionaryItem[]>(endpoints.dictionaries.cities);

  const getCountryName = (countryId?: number): string => {
    if (!countryId || !countries) return "Unknown Country";
    const country = countries.find((c) => c.id === countryId);
    return country?.name || "Unknown Country";
  };

  const getCountyName = (countyId?: number): string => {
    if (!countyId || !counties) return "Unknown County";
    const county = counties.find((c) => c.id === countyId);
    return county?.name || "Unknown County";
  };

  const getCityName = (cityId?: number): string => {
    if (!cityId || !cities) return "Unknown City";
    const city = cities.find((c) => c.id === cityId);
    return city?.name || "Unknown City";
  };

  const handleBack = () => {
    navigation(-1);
  };

  const formatDate = (date?: string): string => {
    if (!date || date === "") return "";
    const actualDate = new Date(date);
    if (isNull(actualDate.getTime())) return "";
    return actualDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "#4caf50";
    if (rating >= 3) return "#ff9800";
    return "#f44336";
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

  const handleFeedbackNav = () => {
    console.log("sunt aici");
    navigation("/conferences/details/feedback");
  };

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
              Conference Details
            </Typography>
          </Stack>
        </Paper>
      </Fade>

      <Fade in timeout={500}>
        <Card
          elevation={3}
          sx={{
            mb: 4,
            borderRadius: 3,
            overflow: "visible",
            position: "relative"
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: "bold",
                background: "black",
                WebkitBackgroundClip: "text"
                // WebkitTextFillColor: "transparent",
                // mb: 3
              }}
            >
              {conference?.name}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={4}>
              <Grid sx={{ xs: 12, md: 6 }}>
                <Stack spacing={3}>
                  <Box display="flex" alignItems="center">
                    <BusinessCenter sx={{ mr: 2, color: "darkblue" }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Type
                      </Typography>
                      <Typography variant="h6">{conference?.conferenceTypeName}</Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <Category sx={{ mr: 2, color: "darkblue" }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Category
                      </Typography>
                      <Typography variant="h6">{conference?.categoryName}</Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <Email sx={{ mr: 2, color: "darkblue" }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Organizer
                      </Typography>
                      <Typography variant="h6">{conference?.organizerEmail}</Typography>
                    </Box>
                  </Box>
                </Stack>
              </Grid>

              <Grid sx={{ xs: 12, md: 6 }}>
                <Stack spacing={3}>
                  <Box display="flex" alignItems="center">
                    <LocationOn sx={{ mr: 2, color: "darkblue" }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="h6">{conference?.location?.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {conference?.location?.address}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getCityName(conference?.location?.cityId)}, {getCountyName(conference?.location?.countyId)},{" "}
                        {getCountryName(conference?.location?.countryId)}
                      </Typography>
                    </Box>
                    {/* <APIProvider apiKey={"Your API key here"} onLoad={() => console.log("Maps API has loaded.")}></APIProvider> */}
                  </Box>

                  <Box display="flex" alignItems="center">
                    <CalendarToday sx={{ mr: 2, color: "darkblue" }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Event Dates
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="h6">{formatDate(conference?.startDate)}</Typography>
                        <ArrowForward sx={{ color: "darkblue" }} />
                        <Typography variant="h6">{formatDate(conference?.endDate)}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>

      <Fade in timeout={700} onClick={handleFeedbackNav}>
        <Card
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: "hidden"
          }}
        >
          <Box
            sx={{
              p: 3,
              background: "lightblue",
              color: "white"
            }}
          >
            <Box display="flex" alignItems="center">
              <Person sx={{ mr: 2, color: "black" }} />
              <Typography variant="h5" fontWeight="bold">
                Speakers ({conference?.speakerList?.length || 0})
              </Typography>
            </Box>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {conference?.speakerList?.length ? (
              <Grid container spacing={3}>
                {conference.speakerList.map((speaker, index) => (
                  <Grid sx={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                    <Fade in timeout={800 + index * 100}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          "&:hover": {
                            elevation: 6
                            // transform: "translateY(-4px)",
                            // boxShadow: "0 8px 25px rgba(0,0,0,0.12)"
                          }
                        }}
                      >
                        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                          <Avatar
                            sx={{
                              width: 64,
                              height: 64,
                              mb: 2,
                              background: "blue",
                              fontSize: "1.5rem",
                              fontWeight: "bold"
                            }}
                          >
                            {speaker.name.charAt(0).toUpperCase()}
                          </Avatar>

                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {speaker.name}
                          </Typography>

                          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                            <Typography variant="body2" color="text.secondary">
                              Nationality:
                            </Typography>
                            <Chip label={speaker.nationality.toUpperCase()} size="small" variant="outlined" sx={{ fontWeight: "bold" }} />
                          </Stack>

                          <Box display="flex" alignItems="center" mb={2}>
                            <Star sx={{ color: getRatingColor(speaker.rating), mr: 0.5, fontSize: "1.2rem" }} />
                            <Typography variant="h6" sx={{ color: getRatingColor(speaker.rating), fontWeight: "bold" }}>
                              {speaker.rating}/5
                            </Typography>
                          </Box>

                          {speaker.isMainSpeaker && (
                            <Chip
                              label="Main Speaker"
                              color="primary"
                              variant="filled"
                              sx={{
                                fontWeight: "bold",
                                background: "blue"
                              }}
                            />
                          )}
                        </Box>
                      </Paper>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper
                sx={{
                  p: 6,
                  textAlign: "center",
                  backgroundColor: "#fafafa",
                  borderRadius: 3,
                  border: "2px dashed #e0e0e0"
                }}
              >
                <Person sx={{ fontSize: 48, color: "#bdbdbd", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Speakers Announced
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Speakers for this conference will be announced soon.
                </Typography>
              </Paper>
            )}
          </CardContent>
        </Card>
      </Fade>

      <Fade in timeout={700}>
        <Card
          elevation={3}
          sx={{
            mb: 4,
            mt: 4,
            borderRadius: 3,
            overflow: "hidden"
          }}
        >
          <Box
            sx={{
              p: 3,
              background: "lightblue",
              color: "white"
            }}
          >
            <Box display="flex" alignItems="center">
              <Person sx={{ mr: 2, color: "black" }} />
              <Typography variant="h5" fontWeight="bold">
                Attendees ({conference?.attendeesList?.length || 0})
              </Typography>
            </Box>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {conference?.attendeesList?.length ? (
              <Grid container spacing={3}>
                {conference.attendeesList.map((attendee, index) => (
                  <Grid sx={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                    <Fade in timeout={800 + index * 100}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          "&:hover": {
                            elevation: 6,
                            transform: "translateY(-4px)",
                            boxShadow: "0 8px 25px rgba(0,0,0,0.12)"
                          }
                        }}
                      >
                        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                          <Avatar
                            sx={{
                              width: 64,
                              height: 64,
                              mb: 2,
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              fontSize: "1.5rem",
                              fontWeight: "bold"
                            }}
                          >
                            {attendee.attendeeEmail.charAt(0).toUpperCase()}
                          </Avatar>

                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {attendee.attendeeEmail}
                          </Typography>

                          {/* <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                            <Typography variant="body2" color="text.secondary">
                              Nationality:
                            </Typography>
                            <Chip label={speaker.nationality.toUpperCase()} size="small" variant="outlined" sx={{ fontWeight: "bold" }} />
                          </Stack> */}

                          {/* <Box display="flex" alignItems="center" mb={2}>
                            <Star sx={{ color: getRatingColor(speaker.rating), mr: 0.5, fontSize: "1.2rem" }} />
                            <Typography variant="h6" sx={{ color: getRatingColor(speaker.rating), fontWeight: "bold" }}>
                              {speaker.rating}/5
                            </Typography>
                          </Box> */}

                          {/* {speaker.isMainSpeaker && (
                            <Chip
                              label="Main Speaker"
                              color="primary"
                              variant="filled"
                              sx={{
                                fontWeight: "bold",
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                              }}
                            />
                          )} */}
                        </Box>
                      </Paper>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper
                sx={{
                  p: 6,
                  textAlign: "center",
                  backgroundColor: "#fafafa",
                  borderRadius: 3,
                  border: "2px dashed #e0e0e0"
                }}
              >
                <Person sx={{ fontSize: 48, color: "#bdbdbd", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Attendees Yet
                </Typography>
                {/* <Typography variant="body2" color="text.secondary">
                  Speakers for this conference will be announced soon.
                </Typography> */}
              </Paper>
            )}
          </CardContent>
        </Card>
      </Fade>
    </Container>
  );
};

export default ConferenceDetailsContainer;
