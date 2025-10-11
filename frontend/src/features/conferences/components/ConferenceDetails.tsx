import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ConferenceDetails = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/conferences");
  };
  return <Grid></Grid>;
};
export default ConferenceDetails;
