import React, { useEffect, useState } from "react";
import { Typography, Card, CardContent, TextField, Grid, Button, Fade, Box } from "@mui/material";

const HomeContainer: React.FC = () => {
  // const { t } = useTranslation();
  const [email, setEmail] = useState<string>("");
  const [savedUser, setSavedUser] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setSavedUser(storedUser);
      // setEmail(storedUser);
    }
  }, []);

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

    setSavedUser(trimmedEmail);
    setEmailError("");
    setEmail("");

    localStorage.setItem("currentUser", trimmedEmail);
  };

  const handleClear = () => {
    setSavedUser("");
    setEmail("");
    localStorage.removeItem("currentUser");
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
          <Button sx={{ backgroundColor: "darkblue", color: "white" }} onClick={handleSave}>
            Save
          </Button>
          <Fade in={!!savedUser} timeout={500}>
            <Box>
              {savedUser && (
                <Box
                  sx={{
                    marginTop: 2,
                    padding: 3,
                    backgroundColor: "#e3f2fd",
                    borderRadius: 2,
                    textAlign: "center",
                    border: "1px solid #2196f3"
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Current user:
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {savedUser}
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
