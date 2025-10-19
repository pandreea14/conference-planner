import React, { useState } from "react";
import { Grid, Typography, IconButton, Card, CardContent } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import type { FeedbackDto } from "types";
import FeedbackCard from "./FeedbackCard";

const FeedbacksList: React.FC<{ feedbacks: FeedbackDto[] }> = ({ feedbacks }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  const nextSlide = () => {
    if (currentIndex + itemsPerPage < feedbacks.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <Grid>
        <Typography variant="h3" fontWeight={"bold"} textAlign={"center"}>
          Be the first to leave a review!
        </Typography>
      </Grid>
    );
  }

  const visibleFeedback = feedbacks.slice(currentIndex, currentIndex + Math.min(itemsPerPage, feedbacks.length));

  return (
    <Grid sx={{ xs: 12 }}>
      <Card sx={{ position: "relative", minHeight: 200 }}>
        <CardContent sx={{ padding: 3 }}>
          {feedbacks.length > 1 && (
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
              <FeedbackCard feedback={fb} index={index} />
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default FeedbacksList;
