import { Button, Grid, Rating, TextField } from "@mui/material";

const SpeakerFeedback: React.FC = () => {
  return (
    <Grid container spacing={3} alignItems={"center"} flexDirection={"row"}>
      <TextField label="Review Message"></TextField>
      <Rating></Rating>
      <Button>Submit Review</Button>
    </Grid>
  );
};
export default SpeakerFeedback;
