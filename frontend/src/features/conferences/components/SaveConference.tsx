import { Delete, Save } from "@mui/icons-material";
import { Box, Button, Card, Checkbox, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { isNull } from "lodash";
import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { ConferenceDto, DictionaryItem, SaveConferenceDto, SpeakerDto } from "types";
import { mutationFetcher, useApiSWR, useApiSWRMutation } from "units/swr";
import { endpoints, toast } from "utils";

const SaveConference: React.FC<{
  onSaveSuccess?: () => void;
  onSaveError?: () => void;
  conference?: ConferenceDto | null;
  onSavingStateChange?: (isSaving: boolean) => void;
}> = ({ onSaveSuccess, conference, onSavingStateChange }) => {
  const { t } = useTranslation();
  const isEditMode = conference ? true : false;

  const { data: categories = [], isLoading: isLoadingCategory } = useApiSWR<DictionaryItem[]>(endpoints.dictionaries.categories);
  const { data: types = [] } = useApiSWR<DictionaryItem[]>(endpoints.dictionaries.conferenceType);
  const { data: cities = [] } = useApiSWR<DictionaryItem[]>(endpoints.dictionaries.cities);
  const { data: countries = [] } = useApiSWR<DictionaryItem[]>(endpoints.dictionaries.countries);
  const { data: counties = [] } = useApiSWR<DictionaryItem[]>(endpoints.dictionaries.counties);
  const { data: speakers = [] } = useApiSWR<SpeakerDto[], Error>(endpoints.conferences.getSpeakers);
  const { trigger: saveConference, isMutating: isCreatingConference } = useApiSWRMutation(
    endpoints.conferences.saveConference,
    mutationFetcher,
    {
      onSuccess: () => {
        toast.success(t("Conference saved successfully"));
        onSaveSuccess?.();
        if (!isEditMode) resetForm();
      },
      onError: (err) => {
        toast.error(t("User.Error", { message: err.message }));
      }
    }
  );

  const getInitialState = (): SaveConferenceDto => ({
    id: 0,
    name: "",
    organizerEmail: "",
    startDate: "",
    endDate: "",
    conferenceTypeId: 0,
    categoryId: 0,
    locationId: 0,
    location: {
      locationId: 0,
      name: "",
      code: "",
      address: "",
      longitude: 0,
      latitude: 0,
      countryId: 0,
      countyId: 0,
      cityId: 0
    },
    speakerList: [
      {
        conferenceSpeakerId: 0,
        speakerId: 0,
        id: 0,
        name: "",
        nationality: "",
        rating: 0,
        isMainSpeaker: false
      }
    ]
  });

  const getConferenceData = (): SaveConferenceDto => {
    if (isEditMode && conference) {
      return {
        id: conference.id,
        conferenceTypeId: conference.conferenceTypeId || 0,
        categoryId: conference.categoryId || 0,
        locationId: conference.locationId || 0,
        location: {
          locationId: conference.locationId || 0,
          name: conference.location?.name || "",
          code: conference.location?.code || "",
          address: conference.location?.address || "",
          countryId: conference.location?.countryId || 0,
          countyId: conference.location?.countyId || 0,
          cityId: conference.location?.cityId || 0,
          longitude: conference.location?.longitude || 0,
          latitude: conference.location?.latitude || 0
        },
        organizerEmail: conference.organizerEmail,
        startDate: conference.startDate,
        endDate: conference.endDate,
        name: conference.name,
        speakerList: (conference.speakerList || []).map((speaker) => ({
          conferenceSpeakerId: speaker.conferenceSpeakerId ?? 0,
          id: speaker.id || 0,
          speakerId: speaker.id || 0,
          name: speaker.name || "",
          nationality: speaker.nationality || "",
          rating: speaker.rating || 0,
          isMainSpeaker: speaker.isMainSpeaker || false
        })) || [
          {
            conferenceSpeakerId: 0,
            speakerId: 0,
            id: 0,
            name: "",
            nationality: "",
            rating: 0,
            isMainSpeaker: false
          }
        ]
      };
    }
    return getInitialState();
  };

  const formatDate = (date: string): string => {
    if (!date || date === "") return "";
    const actualDate = new Date(date);
    if (isNull(actualDate.getTime())) return "";
    return actualDate.toISOString().slice(0, 10);
  };

  const [conferenceData, setConferenceData] = useState<SaveConferenceDto>(getConferenceData()); //aici ii dau initial conference objectul

  const resetForm = () => {
    setConferenceData(getInitialState());
  };

  const handleChangeInput = (field: string, event: { target: { value: string } }) => {
    setConferenceData((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleChangeForIds = (field: string, event: { target: { value: string } }) => {
    setConferenceData((prev) => ({
      ...prev,
      [field]: parseInt(event.target.value) || 0
    }));
  };

  const handleChangeLocation = (field: string, event: { target: { value: string } }) => {
    setConferenceData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: event.target.value
      }
    }));
  };

  const handleChangeLocationForIds = (field: string, event: { target: { value: string } }) => {
    setConferenceData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: parseInt(event.target.value) || 0 }
    }));
  };

  const handleChangeSpeaker = (index: number | 0, field: string, value: string | number | boolean) => {
    setConferenceData((prev) => ({
      ...prev,
      speakerList: prev.speakerList.map((speaker, i) => (i === index ? { ...speaker, [field]: value } : speaker))
    }));
  };

  const handleSelectExistingSpeaker = (
    event: React.ChangeEvent<HTMLInputElement> | (Event & { target: { value: string; name: string } }),
    _child?: React.ReactNode
  ) => {
    const selectedSpeakerId = parseInt(event?.target.value);
    console.log("selectedSpeakerId ", selectedSpeakerId);
    console.log("speakers ", speakers);
    console.log("conferenceData ", conferenceData);

    if (selectedSpeakerId && selectedSpeakerId > 0) {
      const selectedSpeaker = speakers.find((speaker) => speaker.id === selectedSpeakerId);
      if (selectedSpeaker) {
        const isAlreadyAdded = conferenceData.speakerList.some((speaker) => speaker.id === selectedSpeakerId);
        if (isAlreadyAdded) {
          toast.warning("This speaker is already added to the conference");
          return;
        }
        const emptySlotIndex = conferenceData.speakerList.findIndex(
          (speaker) => !speaker.name.trim() && !speaker.nationality.trim() && speaker.rating === 0
        );
        if (emptySlotIndex !== -1) {
          setConferenceData((prev) => ({
            ...prev,
            speakerList: prev.speakerList.map((speaker, index) =>
              index === emptySlotIndex
                ? {
                    conferenceSpeakerId: selectedSpeaker.conferenceSpeakerId || 0,
                    speakerId: selectedSpeaker.id,
                    id: selectedSpeaker.id,
                    name: selectedSpeaker.name,
                    nationality: selectedSpeaker.nationality,
                    rating: selectedSpeaker.rating,
                    isMainSpeaker: false
                  }
                : speaker
            )
          }));
        } else {
          setConferenceData((prev) => ({
            ...prev,
            speakerList: [
              ...prev.speakerList,
              {
                conferenceSpeakerId: selectedSpeaker.conferenceSpeakerId || 0,
                speakerId: selectedSpeaker.id,
                id: selectedSpeaker.id,
                name: selectedSpeaker.name,
                nationality: selectedSpeaker.nationality,
                rating: selectedSpeaker.rating,
                isMainSpeaker: false
              }
            ]
          }));
        }
        toast.success(`Added ${selectedSpeaker.name} to the conference`);
        console.log("conferenceData dupa", conferenceData);
        event.target.value = "";
      }
    }
  };

  const areAllSpeakersValid = () => {
    return conferenceData.speakerList.every(
      (speaker) => speaker.name.trim() !== "" && speaker.nationality.trim() !== "" && speaker.rating > 0
    );
  };

  const addSpeaker = () => {
    if (!areAllSpeakersValid()) {
      toast.warning("Please fill in all speaker fields before adding a new speaker");
      return;
    }
    setConferenceData((prev) => ({
      ...prev,
      speakerList: [
        ...prev.speakerList,
        { conferenceSpeakerId: 0, speakerId: 0, id: 0, name: "", nationality: "", rating: 0, isMainSpeaker: false }
      ]
    }));
  };

  const removeSpeaker = (index: number) => {
    if (conferenceData.speakerList.length > 1)
      setConferenceData((prev) => {
        const newSpeakers = [...prev.speakerList];
        newSpeakers.splice(index, 1);
        return {
          ...prev,
          speakerList: newSpeakers
        };
      });
  };

  const handleSaveConference = async () => {
    try {
      if (!conferenceData.name || !conferenceData.organizerEmail || !conferenceData.conferenceTypeId || !conferenceData.categoryId) {
        toast.error("Please fill in all required fields");
        return;
      }

      await saveConference(conferenceData);
    } catch (error) {
      console.error("Error saving conference:", error);
    }
  };

  React.useEffect(() => {
    onSavingStateChange?.(isCreatingConference);
  }, [isCreatingConference, onSavingStateChange]);

  const commonFieldStyles = {
    minWidth: { xs: "100%", sm: "200px", md: "250px" },
    maxWidth: { xs: "100%", sm: "300px", md: "350px" },
    flex: 1
  };
  return (
    <Grid container padding={3} display={"flex"} justifyContent={"space-between"}>
      <Grid gap={3} flexDirection={"column"} display={"flex"} justifyContent={"center"} sx={{ background: "white" }}>
        <Card sx={{ padding: 2 }}>
          <h2>Conference Information </h2>

          <Grid
            container
            gap={2}
            display={"flex"}
            justifyContent={"space-around"}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9"
            }}
          >
            <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                id="name"
                label="Conference name"
                variant="outlined"
                value={conferenceData.name}
                onChange={(e) => handleChangeInput("name", e)}
                sx={commonFieldStyles}
              />
            </Grid>

            <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                id="email"
                label="Organizer Email"
                variant="outlined"
                value={conferenceData.organizerEmail}
                onChange={(e) => handleChangeInput("organizerEmail", e)}
                sx={commonFieldStyles}
              />
            </Grid>

            <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                type="date"
                label="Start Date"
                // sx={{ minWidth: 250 }}
                name="startDate"
                value={formatDate(conferenceData.startDate)}
                onChange={(e) => handleChangeInput("startDate", e)}
                InputLabelProps={{ shrink: true }}
                sx={commonFieldStyles}
              />
            </Grid>

            <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                type="date"
                label="End Date"
                // sx={{ minWidth: 250 }}
                name="endDate"
                value={formatDate(conferenceData.endDate)}
                onChange={(e) => handleChangeInput("endDate", e)}
                InputLabelProps={{ shrink: true }}
                sx={commonFieldStyles}
              />
            </Grid>

            <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
              <FormControl fullWidth sx={commonFieldStyles}>
                <InputLabel>Conference Type</InputLabel>
                <Select
                  value={conferenceData.conferenceTypeId}
                  label="Conference Type"
                  onChange={(e) => handleChangeForIds("conferenceTypeId", { target: { value: e.target.value.toString() } })}
                >
                  <MenuItem value={0}>Select type</MenuItem>
                  {types.map((ct) => (
                    <MenuItem key={ct.id} value={ct.id}>
                      {ct.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
              <FormControl fullWidth sx={commonFieldStyles}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={conferenceData.categoryId}
                  label="Category"
                  onChange={(e) => handleChangeForIds("categoryId", { target: { value: e.target.value.toString() } })}
                  disabled={isLoadingCategory}
                >
                  <MenuItem value={0}>{isLoadingCategory ? "Loading category..." : "Select category"}</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>

        <Card sx={{ padding: 3 }}>
          <h2>Location Information </h2>

          <Grid
            container
            spacing={3}
            justifyContent={"space-around"}
            display={"flex"}
            // display={"flex"}
            // justifyContent={"space-around"}
            // rowSpacing={1}
            // columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9"
            }}
          >
            <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                id="location"
                label="Conference location name"
                variant="outlined"
                value={conferenceData.location.name}
                onChange={(e) => handleChangeLocation("name", e)}
                sx={commonFieldStyles}
              />
            </Grid>

            <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                id="address"
                label="Location address"
                variant="outlined"
                value={conferenceData.location.address}
                onChange={(e) => handleChangeLocation("address", e)}
                sx={commonFieldStyles}
              />
            </Grid>
            <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                id="longitude"
                label="Longitude"
                variant="outlined"
                value={conferenceData.location.longitude}
                onChange={(e) => handleChangeLocation("longitude", e)}
                sx={commonFieldStyles}
              />
            </Grid>
            <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                id="latitude"
                label="Latitude"
                variant="outlined"
                value={conferenceData.location.latitude}
                onChange={(e) => handleChangeLocation("latitude", e)}
                sx={commonFieldStyles}
              />
            </Grid>

            <Grid container display={"flex"} justifyContent={"space-around"} rowSpacing={1} columnSpacing={{ xs: 6, sm: 6 }}>
              <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Country</InputLabel>
                  <Select
                    value={conferenceData.location.countryId}
                    label="Country"
                    onChange={(e) => handleChangeLocationForIds("countryId", { target: { value: e.target.value.toString() } })}
                  >
                    <MenuItem value={0}>Select country</MenuItem>
                    {countries.map((country) => (
                      <MenuItem key={country.id} value={country.id}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>County</InputLabel>
                  <Select
                    value={conferenceData.location.countyId}
                    label="County"
                    onChange={(e) => handleChangeLocationForIds("countyId", { target: { value: e.target.value.toString() } })}
                  >
                    <MenuItem value={0}>Select county</MenuItem>
                    {counties.map((county) => (
                      <MenuItem key={county.id} value={county.id}>
                        {county.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>City</InputLabel>
                  <Select
                    value={conferenceData.location.cityId}
                    label="City"
                    onChange={(e) => handleChangeLocationForIds("cityId", { target: { value: e.target.value.toString() } })}
                  >
                    <MenuItem value={0}>Select city</MenuItem>
                    {cities.map((city) => (
                      <MenuItem key={city.id} value={city.id}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Card>

        <Card sx={{ padding: 3 }}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid sx={{ xs: 12, md: 6 }}>
              <h2>Speaker Information</h2>
            </Grid>
            <Grid sx={{ xs: 12, md: 6 }}>
              <FormControl fullWidth sx={commonFieldStyles}>
                <InputLabel>Choose Existing Speaker</InputLabel>
                <Select value="" label="Choose Existing Speaker" onChange={handleSelectExistingSpeaker}>
                  <MenuItem value="">Choose an existing speaker</MenuItem>
                  {speakers.map((speaker) => (
                    <MenuItem key={`existing-speaker-${speaker.id}`} value={speaker.id}>
                      {speaker.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {conferenceData.speakerList.map((speaker, index) => (
            <Grid
              key={`conference-speaker-${index}`}
              gap={2}
              mt={2}
              spacing={2}
              display={"flex"}
              justifyContent={"space-between"}
              flexDirection={"row"}
              sx={{
                p: 2,
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9"
              }}
            >
              <Grid sx={{ xs: 12, md: 3, sm: 6 }}>
                <TextField
                  // fullWidth
                  id={`speakerName-${index}`}
                  label="Speaker name"
                  variant="outlined"
                  value={speaker.name}
                  onChange={(e) => handleChangeSpeaker(index, "name", e.target.value)}
                  // sx={commonFieldStyles}
                />
              </Grid>

              <Grid sx={{ xs: 12, md: 3, sm: 6 }}>
                <TextField
                  // fullWidth
                  id={`nationality-${index}`}
                  label="Speaker nationality"
                  variant="outlined"
                  // sx={{ flex: 1 }}
                  value={speaker.nationality}
                  onChange={(e) => handleChangeSpeaker(index, "nationality", e.target.value)}
                  // sx={commonFieldStyles}
                />
              </Grid>

              <Grid sx={{ xs: 12, sm: 6, md: 2 }}>
                <TextField
                  id={`rating-${index}`}
                  label="Rating"
                  variant="outlined"
                  // sx={{ flex: 1 }}
                  value={speaker.rating}
                  onChange={(e) => handleChangeSpeaker(index, "rating", e.target.value)}
                  // sx={commonFieldStyles}
                />
              </Grid>

              <Grid sx={{ xs: 12, sm: 6, md: 2 }}>
                <Box display="flex" alignItems="center" flexDirection="column">
                  <label htmlFor={`mainSpeaker-${index}`} style={{ fontSize: "0.875rem", marginBottom: "4px" }}>
                    Main Speaker?
                  </label>
                  <Checkbox
                    id={`mainSpeaker-${index}`}
                    checked={speaker.isMainSpeaker}
                    onChange={(e) => handleChangeSpeaker(index, "isMainSpeaker", e.target.checked)}
                  />
                </Box>
              </Grid>
              <Grid sx={{ xs: 12, sm: 6, md: 2 }}>
                <Box display="flex" justifyContent="center">
                  <IconButton
                    onClick={() => removeSpeaker(index)}
                    disabled={conferenceData.speakerList.length === 1}
                    color="error"
                    size="large"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          ))}

          <Button size="medium" sx={{ background: "darkblue", color: "white", mt: 3 }} onClick={addSpeaker}>
            {/* <Add sx={{ color: "white" }} /> */}
            Add New Speaker
          </Button>
        </Card>
        <Grid container justifyContent="flex-end" sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveConference}
            disabled={isCreatingConference}
            sx={{
              backgroundColor: "darkblue",
              "&:hover": { backgroundColor: "navy" }
            }}
          >
            {isEditMode ? "Update Conference" : "Create Conference"}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default SaveConference;
