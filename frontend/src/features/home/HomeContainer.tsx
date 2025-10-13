import React, { useState } from "react";
import { Typography, Card, CardContent, TextField, Grid, Button, Fade, Box } from "@mui/material";
import { useUserData } from "hooks";

const HomeContainer: React.FC = () => {
  const { userEmail, setUserEmail, clearUserEmail, isLoggedIn } = useUserData();
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);

    if (emailError) {
      setEmailError("");
    }
  };

  const handleSave = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setUserEmail(trimmedEmail);
    setEmailError("");
    setEmail("");
  };

  const handleClear = () => {
    setEmail("");
    clearUserEmail();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSave();
    }
  };
  return (
    <Card sx={{ maxWidth: 500, width: "100%" }}>
      <CardContent>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Welcome!
        </Typography>
        <Grid container flexDirection={"column"} display={"flex"} justifyContent={"center"}>
          <TextField
            label="Enter email to continue..."
            value={email}
            onChange={handleEmailChange}
            onKeyDown={handleKeyPress}
            type="email"
            fullWidth
            variant="outlined"
            error={!!emailError}
            helperText={emailError}
          ></TextField>
          <Button sx={{ backgroundColor: "darkblue", color: "white" }} onClick={handleSave} disabled={!email.trim()}>
            Save
          </Button>
          <Fade in={isLoggedIn} timeout={500}>
            <Box>
              {isLoggedIn && (
                <Box
                  sx={{
                    marginTop: 2,
                    padding: 3,
                    backgroundColor: "#e3f2fd",
                    borderRadius: 2,
                    textAlign: "center"
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Current user:
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {userEmail}
                  </Typography>
                  <Button size="small" color="error" onClick={handleClear} sx={{ marginTop: 1, backgroundColor: "pink" }}>
                    Clear
                  </Button>
                </Box>
              )}
            </Box>
          </Fade>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default HomeContainer;
