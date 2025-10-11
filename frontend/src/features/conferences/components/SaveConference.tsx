import { Delete, Save } from "@mui/icons-material";
import { Button, Card, Checkbox, Grid, IconButton, TextField } from "@mui/material";
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

  const formatDate = (date: string): string => {
    if (!date || date === "") return "";
    const actualDate = new Date(date);
    if (isNull(actualDate.getTime())) return "";
    return actualDate.toISOString().slice(0, 10);
  };

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

  const handleSelectExistingSpeaker = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSpeakerId = parseInt(event?.target.value);

    if (selectedSpeakerId && selectedSpeakerId > 0) {
      const selectedSpeaker = speakers.find((speaker) => speaker.id === selectedSpeakerId);
      if (selectedSpeaker) {
        const isAlreadyAdded = conferenceData.speakerList.some((speaker) => speaker.id === selectedSpeaker.id);

        if (isAlreadyAdded) {
          toast.warning("This speaker is already added to the conference");
          return;
        }
        const emptySlotIndex = conferenceData.speakerList.findIndex(
          (speaker) => !speaker.name.trim() && !speaker.nationality.trim() && speaker.rating === 0
        );
        if (emptySlotIndex !== -1) {
          // ✅ Fill the empty slot instead of adding new row
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

  return (
    <Grid container padding="10px" display={"flex"} justifyContent={"space-between"}>
      <Grid gap={3} flexDirection={"column"} display={"flex"} justifyContent={"center"} sx={{ background: "white" }}>
        <Card sx={{ padding: "20px" }}>
          <h2>Conference information </h2>

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
            <TextField
              id="name"
              label="Conference name"
              variant="outlined"
              value={conferenceData.name}
              onChange={(e) => handleChangeInput("name", e)}
            />

            <TextField
              id="email"
              label="Organizer Email"
              variant="outlined"
              value={conferenceData.organizerEmail}
              onChange={(e) => handleChangeInput("organizerEmail", e)}
            />

            <TextField
              type="date"
              label="Start Date"
              sx={{ minWidth: 250 }}
              name="startDate"
              value={formatDate(conferenceData.startDate)}
              onChange={(e) => handleChangeInput("startDate", e)}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              type="date"
              label="End Date"
              sx={{ minWidth: 250 }}
              name="endDate"
              value={formatDate(conferenceData.endDate)}
              onChange={(e) => handleChangeInput("endDate", e)}
              InputLabelProps={{ shrink: true }}
            />

            <select
              name={"ConferenceType"}
              value={conferenceData.conferenceTypeId}
              onChange={(e) => handleChangeForIds("conferenceTypeId", e)}
              style={{
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
                width: "34%",
                backgroundColor: "#fff"
              }}
            >
              <option value={0}>Select type</option>
              {types.map((ct) => (
                <option key={ct.id} value={ct.id}>
                  {ct.name}
                </option>
              ))}
            </select>

            <select
              name={"Category"}
              value={conferenceData.categoryId}
              onChange={(e) => handleChangeForIds("categoryId", e)}
              style={{
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
                width: "34%",
                backgroundColor: "#fff"
              }}
            >
              <option value={0}>{isLoadingCategory ? "Loading category.." : "Select category"}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Grid>
        </Card>

        <Card sx={{ padding: "20px" }}>
          <h2>Location information </h2>

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
            <TextField
              id="location"
              label="Conference location name"
              variant="outlined"
              value={conferenceData.location.name}
              onChange={(e) => handleChangeLocation("name", e)}
            />

            <TextField
              id="address"
              label="Location address"
              variant="outlined"
              value={conferenceData.location.address}
              onChange={(e) => handleChangeLocation("address", e)}
            />
            <TextField
              id="longitude"
              label="Longitude"
              variant="outlined"
              value={conferenceData.location.longitude}
              onChange={(e) => handleChangeLocation("longitude", e)}
            />
            <TextField
              id="latitude"
              label="Latitude"
              variant="outlined"
              value={conferenceData.location.latitude}
              onChange={(e) => handleChangeLocation("latitude", e)}
            />

            <Grid container display={"flex"} justifyContent={"space-around"} rowSpacing={1} columnSpacing={{ xs: 6, sm: 6 }}>
              <select
                name={"Country"}
                value={conferenceData.location.countryId}
                onChange={(e) => handleChangeLocationForIds("countryId", e)}
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                  width: "25%",
                  backgroundColor: "#fff"
                }}
              >
                <option value={0}>Select country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>

              <select
                name={"County"}
                value={conferenceData.location.countyId}
                onChange={(e) => {
                  handleChangeLocationForIds("countyId", e);
                }}
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                  width: "25%",
                  backgroundColor: "#fff"
                }}
              >
                <option value={0}>Select county</option>
                {counties.map((county) => (
                  <option key={county.id} value={county.id}>
                    {county.name}
                  </option>
                ))}
              </select>

              <select
                name={"City"}
                value={conferenceData.location.cityId}
                onChange={(e) => handleChangeLocationForIds("cityId", e)}
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                  width: "25%",
                  backgroundColor: "#fff"
                }}
              >
                <option value={0}>Select city</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>
        </Card>

        <Card sx={{ padding: "20px" }}>
          <Grid container gap={2} display={"flex"} justifyContent={"space-between"}>
            <h2>Speaker information </h2>

            <select
              onChange={handleSelectExistingSpeaker}
              value={""}
              style={{
                marginTop: "10px",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
                width: "40%",
                height: "50%",
                backgroundColor: "#fff"
              }}
            >
              <option value="">Choose an existing speaker</option>
              {speakers.map((speaker) => (
                <option key={`existing-speaker-${speaker.id}`} value={speaker.id}>
                  {speaker.name}
                </option>
              ))}
            </select>
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
              <TextField
                id={`speakerName-${index}`}
                label="Speaker name"
                variant="outlined"
                value={speaker.name}
                onChange={(e) => handleChangeSpeaker(index, "name", e.target.value)}
              />

              <TextField
                id={`nationality-${index}`}
                label="Speaker nationality"
                variant="outlined"
                sx={{ flex: 1 }}
                value={speaker.nationality}
                onChange={(e) => handleChangeSpeaker(index, "nationality", e.target.value)}
              />

              <TextField
                id={`rating-${index}`}
                label="Rating"
                variant="outlined"
                sx={{ flex: 1 }}
                value={speaker.rating}
                onChange={(e) => handleChangeSpeaker(index, "rating", e.target.value)}
              />

              <Grid display={"flex"} justifyContent={"space-between"} flexDirection={"row"}>
                <label htmlFor={`mainSpeaker-${index}`}>Main Speaker?</label>
                <Checkbox
                  id={`mainSpeaker-${index}`}
                  checked={speaker.isMainSpeaker}
                  onChange={(e) => handleChangeSpeaker(index, "isMainSpeaker", e.target.checked)}
                />
                <IconButton
                  onClick={() => removeSpeaker(index)}
                  disabled={conferenceData.speakerList.length === 1}
                  color="error"
                  size="small"
                >
                  <Delete />
                </IconButton>
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
