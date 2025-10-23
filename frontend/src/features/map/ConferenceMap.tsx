import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Typography, Box } from "@mui/material";
import L from "leaflet";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface ConferenceMapProps {
  latitude: number;
  longitude: number;
  locationName: string;
  address: string;
}

const ConferenceMap: React.FC<ConferenceMapProps> = ({ latitude, longitude, locationName, address }) => {
  const position: [number, number] = [latitude, longitude];
  return (
    <Box sx={{ height: 300, width: "100%", borderRadius: 3, overflow: "hidden" }}>
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position}>
          <Popup>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              {locationName}
            </Typography>
            <Typography variant="body2">{address}</Typography>
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
};

export default ConferenceMap;
