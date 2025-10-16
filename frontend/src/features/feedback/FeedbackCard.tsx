import React, { useState } from "react";
import { Grid, Typography, Rating, IconButton, Box, Card, CardContent } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import type { FeedbackDto } from "types";

const FeedbackCard: React.FC<{ feedback: FeedbackDto[] }> = ({ feedback }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  const nextSlide = () => {
    if (currentIndex + itemsPerPage < feedback.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (!feedback || feedback.length === 0) {
    return (
      <Grid>
        <Typography variant="h3" fontWeight={"bold"}>
          Reviews
        </Typography>
        <Typography>No reviews yet</Typography>
      </Grid>
    );
  }

  const visibleFeedback = feedback.slice(currentIndex, currentIndex + Math.min(itemsPerPage, feedback.length));

  // while (visibleFeedback.length < itemsPerPage) {
  //   visibleFeedback.push({} as FeedbackDto);
  // }

  return (
    <Grid sx={{ xs: 12 }}>
      <Card sx={{ position: "relative", minHeight: 200 }}>
        <CardContent sx={{ padding: 3 }}>
          {feedback.length > 1 && (
            <>
              <IconButton
                onClick={prevSlide}
                sx={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" }
                }}
              >
                <ChevronLeft />
              </IconButton>

              <IconButton
                onClick={nextSlide}
                sx={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" }
                }}
              >
                <ChevronRight />
              </IconButton>
            </>
          )}

          <Grid container spacing={3} justifyContent="center">
            {visibleFeedback.map((fb, index) => (
              <Grid sx={{ xs: 12, md: 4 }} key={currentIndex + index}>
                <Card
                  sx={{
                    height: "100%",
                    boxShadow: 3,
                    borderRadius: 2,
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent sx={{ padding: 4, textAlign: "center" }}>
                    <Rating value={fb.rating} readOnly size="large" sx={{ mb: 2 }} />

                    <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                      {fb.rating >= 4 ? "Awesome Speaker" : fb.rating >= 3 ? "Insightful" : "Did not enjoy that much"}
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
                      "{fb.message}"
                    </Typography>

                    <Box sx={{ borderTop: 1, borderColor: "divider", pt: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {fb.attendeeEmail}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Conference Attendee
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default FeedbackCard;
