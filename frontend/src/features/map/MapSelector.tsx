// import { useState } from "react";
// import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

// const MapSelector: React.FC<{ onLocationSelect: boolean }> = ({ onLocationSelect }) => {
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   const handleMapClick = (e) => {
//     const { latLng } = e.detail;
//     const lat = latLng.lat();
//     const lng = latLng.lng();
//     setSelectedLocation({ lat, lng });
//     onLocationSelect({ lat, lng });
//   };

//   return (
//     <APIProvider apiKey="YOUR_API_KEY">
//       <Map
//         style={{ height: "400px", width: "100%" }}
//         defaultCenter={{ lat: 45.75, lng: 21.23 }}
//         defaultZoom={6}
//         onClick={handleMapClick}
//       >
//         {selectedLocation && <Marker position={selectedLocation} />}
//       </Map>
//     </APIProvider>
//   );
// };

// export default MapSelector;
