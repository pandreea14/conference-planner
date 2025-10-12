// import { ArrowBack } from "@mui/icons-material";
// import { Card, Grid, IconButton } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import type { ConferenceDto } from "types";

// const ConferenceDetails: React.FC<{ conference?: ConferenceDto }> = ({ conference }) => {
//   const navigate = useNavigate();

//   console.log("conference in detail card: ", conference);

//   const handleBack = () => {
//     navigate("/conferences");
//   };
//   return (
//     <>
//       <Grid container>
//         <IconButton onClick={handleBack}>
//           <ArrowBack />
//         </IconButton>

//         <h1>Conference Details</h1>
//       </Grid>
//       <Grid
//         container
//         display={"flex"}
//         justifyContent={"space-around"}
//         rowSpacing={1}
//         columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//         sx={{
//           p: 2,
//           border: "1px solid #e0e0e0",
//           borderRadius: "8px",
//           backgroundColor: "#f9f9f9"
//         }}
//       >
//         <Card>
//           <h2>{conference?.name}</h2>
//         </Card>
//       </Grid>
//     </>
//   );
// };
// export default ConferenceDetails;
