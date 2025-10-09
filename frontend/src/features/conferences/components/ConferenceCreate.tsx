import { Delete, Save } from "@mui/icons-material";
import { Box, Button, Card, Checkbox, Grid, IconButton, TextField } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { DictionaryItem } from "types";
import { mutationFetcher, useApiSWR, useApiSWRMutation } from "units/swr";
import { endpoints, toast } from "utils";

const ConferenceCreate: React.FC<{ onSaveSuccess?: () => void }> = ({ onSaveSuccess }) => {
  const { t } = useTranslation();

  const { data: categories = [] } = useApiSWR<DictionaryItem[]>(endpoints.dictionaries.categories, {
    onError: (err) => toast.error(t("User.Error", { message: err.message }))
  });
  const { data: types = [] } = useApiSWR<DictionaryItem[]>(endpoints.dictionaries.conferenceType, {
    onError: (err) => toast.error(t("User.Error", { message: err.message }))
  });
  const { data: cities = [] } = useApiSWR<DictionaryItem[]>(endpoints.dictionaries.cities, {
    onError: (err) => toast.error(t("User.Error", { message: err.message }))
  });
  const { data: countries = [] } = useApiSWR<DictionaryItem[]>(endpoints.dictionaries.countries, {
    onError: (err) => toast.error(t("User.Error", { message: err.message }))
  });
  const { data: counties = [] } = useApiSWR<DictionaryItem[]>(endpoints.dictionaries.counties, {
    onError: (err) => toast.error(t("User.Error", { message: err.message }))
  });
  const { trigger: createConference, isMutating: isCreatingConference } = useApiSWRMutation(
    endpoints.conferences.saveConference,
    mutationFetcher,
    {
      onSuccess: () => {
        toast.success(t("Conference created successfully"));
        onSaveSuccess?.();
        setConferenceData({
          name: "",
          organizerEmail: "",
          startDate: "",
          endDate: "",
          conferenceTypeId: 0,
          categoryId: 0,
          location: {
            locationId: 0,
            name: "",
            address: "",
            longitude: "",
            latitude: "",
            countryId: 0,
            countyId: 0,
            cityId: 0
          },
          speakerList: [{ speakerId: 0, name: "", nationality: "", rating: 0, isMainSpeaker: false }]
        });
      },
      onError: (err) => {
        toast.error(t("User.Error", { message: err.message }));
      }
    }
  );

  const [conferenceData, setConferenceData] = useState({
    name: "",
    organizerEmail: "",
    startDate: "",
    endDate: "",
    conferenceTypeId: 0,
    categoryId: 0,
    location: {
      locationId: 0,
      name: "",
      // code: "",
      address: "",
      longitude: "",
      latitude: "",
      countryId: 0,
      countyId: 0,
      cityId: 0
    },
    speakerList: [
      {
        speakerId: 0,
        name: "",
        nationality: "",
        rating: 0,
        isMainSpeaker: false
      }
    ]
  });

  const handleChangeInput = (field: string, event: { target: { value: string } }) => {
    setConferenceData((prev) => ({
      ...prev,
      [field]: event.target.value
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

  const handleChangeSpeaker = (index: number, field: string, value: string | number | boolean) => {
    setConferenceData((prev) => ({
      ...prev,
      speakerList: prev.speakerList.map((speaker, i) => (i === index ? { ...speaker, [field]: value } : speaker))
    }));
  };

  const addSpeaker = () => {
    setConferenceData((prev) => ({
      ...prev,
      speakerList: [...prev.speakerList, { speakerId: 0, name: "", nationality: "", rating: 0, isMainSpeaker: false }]
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

      const requestData = {
        id: 0,
        name: conferenceData.name,
        organizerEmail: conferenceData.organizerEmail,
        startDate: conferenceData.startDate,
        endDate: conferenceData.endDate,
        conferenceTypeId: conferenceData.conferenceTypeId,
        categoryId: conferenceData.categoryId,
        location: {
          locationId: conferenceData.location.locationId,
          name: conferenceData.location.name,
          // code: conferenceData.location.code,
          countryId: conferenceData.location.countryId,
          countyId: conferenceData.location.countyId,
          cityId: conferenceData.location.cityId,
          address: conferenceData.location.address,
          latitude: parseFloat(conferenceData.location.latitude) || 0,
          longitude: parseFloat(conferenceData.location.longitude) || 0
        },
        speakerList: conferenceData.speakerList.map((speaker) => ({
          speakerId: speaker.speakerId,
          name: speaker.name,
          nationality: speaker.nationality,
          rating: parseFloat(speaker.rating.toString()) || 0,
          isMainSpeaker: speaker.isMainSpeaker
        }))
      };

      await createConference(requestData);
    } catch (error) {
      console.error("Error saving conference:", error);
    }
  };

  return (
    <Grid container padding={"50px"} display={"flex"} justifyContent={"space-between"}>
      <h1>Add a new conference</h1>
      <Box
        sx={{
          position: "fixed",
          left: "73%",
          zIndex: 1300
        }}
      >
        <IconButton size="large" sx={{ background: "darkblue" }} onClick={handleSaveConference} disabled={isCreatingConference}>
          <Save sx={{ color: "white" }} />
        </IconButton>
      </Box>
      <Grid gap={3} flexDirection={"column"} display={"flex"} justifyContent={"center"} sx={{ background: "white" }}>
        <Card sx={{ padding: "20px" }}>
          <h2>Conference information </h2>

          <Grid container gap={2} display={"flex"} justifyContent={"space-around"} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
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
              value={conferenceData.startDate}
              onChange={(e) => handleChangeInput("startDate", e)}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              type="date"
              label="End Date"
              sx={{ minWidth: 250 }}
              name="endDate"
              value={conferenceData.endDate}
              onChange={(e) => handleChangeInput("endDate", e)}
              InputLabelProps={{ shrink: true }}
            />

            <select
              name={"ConferenceType"}
              value={conferenceData.conferenceTypeId}
              onChange={(e) => setConferenceData((prev) => ({ ...prev, conferenceTypeId: parseInt(e.target.value) || 0 }))}
              style={{
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
                width: "34%",
                backgroundColor: "#fff"
              }}
            >
              <option value="">Select type</option>
              {types.map((ct) => (
                <option key={ct.id} value={ct.id}>
                  {ct.name}
                </option>
              ))}
            </select>

            <select
              name={"Category"}
              value={conferenceData.categoryId}
              onChange={(e) => setConferenceData((prev) => ({ ...prev, categoryId: parseInt(e.target.value) || 0 }))}
              style={{
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
                width: "34%",
                backgroundColor: "#fff"
              }}
            >
              <option value="">Select category</option>
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

          <Grid container gap={2} display={"flex"} justifyContent={"space-around"} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
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

            <select
              name={"Country"}
              value={conferenceData.location.countryId}
              onChange={(e) =>
                setConferenceData((prev) => ({
                  ...prev,
                  location: { ...prev.location, countryId: parseInt(e.target.value) || 0 }
                }))
              }
              style={{
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
                width: "34%",
                backgroundColor: "#fff"
              }}
            >
              <option value="">Select country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>

            <select
              name={"County"}
              value={conferenceData.location.countyId}
              onChange={(e) =>
                setConferenceData((prev) => ({
                  ...prev,
                  location: { ...prev.location, countyId: parseInt(e.target.value) || 0 }
                }))
              }
              style={{
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
                width: "34%",
                backgroundColor: "#fff"
              }}
            >
              <option value="">Select county</option>
              {counties.map((county) => (
                <option key={county.id} value={county.id}>
                  {county.name}
                </option>
              ))}
            </select>

            <select
              name={"City"}
              value={conferenceData.location.cityId}
              onChange={(e) =>
                setConferenceData((prev) => ({
                  ...prev,
                  location: { ...prev.location, cityId: parseInt(e.target.value) || 0 }
                }))
              }
              style={{
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
                width: "34%",
                backgroundColor: "#fff"
              }}
            >
              <option value="">Select city</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </Grid>
        </Card>

        <Card sx={{ padding: "20px" }}>
          <h2>Speaker information </h2>

          {conferenceData.speakerList.map((speaker, index) => (
            <Grid key={index} gap={2} mt={2} spacing={2} display={"flex"} justifyContent={"space-between"} flexDirection={"row"}>
              <TextField
                id="name"
                label="Speaker name"
                variant="outlined"
                value={speaker.name}
                onChange={(e) => handleChangeSpeaker(index, "name", e.target.value)}
              />

              <TextField
                id="nationality"
                label="Speaker nationality"
                variant="outlined"
                value={speaker.nationality}
                onChange={(e) => handleChangeSpeaker(index, "nationality", e.target.value)}
              />

              <TextField
                id="rating"
                label="Rating"
                variant="outlined"
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
                <IconButton onClick={() => removeSpeaker(index)}>
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
      </Grid>
    </Grid>
  );
};
export default ConferenceCreate;
