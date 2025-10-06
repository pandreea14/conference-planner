import { Add, Delete, Save } from "@mui/icons-material";
import { Box, Card, Checkbox, Grid, IconButton, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { DictionaryItem } from "types";
import { useApiSWR } from "units/swr";
import { endpoints, toast } from "utils";

const ConferenceCreate: React.FC = () => {
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
        <IconButton size="large" sx={{ background: "darkblue" }}>
          <Save sx={{ color: "white" }} />
        </IconButton>
      </Box>
      <Grid gap={3} flexDirection={"column"} display={"flex"} justifyContent={"center"} sx={{ background: "white" }}>
        <Card sx={{ padding: "20px" }}>
          <h2>Conference information </h2>

          <Grid container gap={2} display={"flex"} justifyContent={"space-around"} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <TextField id="name" label="Conference name" variant="outlined" />

            <TextField id="email" label="Organizer Email" variant="outlined" />

            <TextField
              type="date"
              label="Start Date"
              sx={{ minWidth: 250 }}
              name="startDate"
              //   value={formatDate(state?.dateStart)}
              //   onChange={handleChangeStartDate}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              type="date"
              label="End Date"
              sx={{ minWidth: 250 }}
              name="endDate"
              //   value={formatDate(state?.dateEnd)}
              //   onChange={handleChangeEndDate}
              InputLabelProps={{ shrink: true }}
            />

            <select
              name={"ConferenceType"}
              //   value={state?.conferenceType}
              //   onChange={handleChangeConferenceType}
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
                <option key={ct.id} value={ct.name}>
                  {ct.name}
                </option>
              ))}
            </select>

            <select
              name={"Category"}
              //   value={state?.conferenceType}
              //   onChange={handleChangeConferenceType}
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
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </Grid>
        </Card>

        <Card sx={{ padding: "20px" }}>
          <h2>Location information </h2>

          <Grid container gap={2} display={"flex"} justifyContent={"space-around"} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <TextField id="location" label="Conference location name" variant="outlined" />

            <TextField id="address" label="Location address" variant="outlined" />
            <TextField id="longitude" label="Longitude" variant="outlined" />
            <TextField id="latitude" label="Latitude" variant="outlined" />

            <select
              name={"Country"}
              //   value={state?.conferenceType}
              //   onChange={handleChangeConferenceType}
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
                <option key={country.id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>

            <select
              name={"County"}
              //   value={state?.conferenceType}
              //   onChange={handleChangeConferenceType}
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
                <option key={county.id} value={county.name}>
                  {county.name}
                </option>
              ))}
            </select>

            <select
              name={"City"}
              //   value={state?.conferenceType}
              //   onChange={handleChangeConferenceType}
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
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </Grid>
        </Card>

        <Card sx={{ padding: "20px" }}>
          <h2>Speaker information </h2>

          <Grid gap={2} spacing={2} display={"flex"} justifyContent={"space-between"} flexDirection={"row"}>
            <TextField id="name" label="Speaker name" variant="outlined" />

            <TextField id="nationality" label="Speaker nationality" variant="outlined" />

            <TextField id="rating" label="Rating" variant="outlined" />

            <Grid display={"flex"} justifyContent={"space-between"} flexDirection={"row"}>
              <label htmlFor="mainSpeaker">Is Main Speaker</label>
              <Checkbox id="mainSpeaker" />
              <IconButton>
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
          <IconButton size="medium" sx={{ background: "darkblue" }}>
            <Add sx={{ color: "white" }} />
          </IconButton>
        </Card>
      </Grid>
    </Grid>
  );
};
export default ConferenceCreate;
