import "leaflet/dist/leaflet.css";
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, GeoJSON } from "react-leaflet";
import { Icon } from "leaflet";
import LAGUNA from './../../../Data/LAGUNA.json';
import type { GeoJsonObject } from 'geojson';

// Make sure LAGUNA is typed correctly
const lagunaGeoJson: GeoJsonObject = LAGUNA as GeoJsonObject;

export default function Dashboard() {
  // Define the type for markers
  type MarkerType = {
    id: string;
    geocode: [number, number]; // explicitly a tuple with two elements
    popUp: string;
  };

  // State to hold the markers, starting with an empty array
  const [markers, setMarkers] = useState<MarkerType[]>([]);

  // Custom icon for the markers
  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/149/149059.png",
    iconSize: [38, 38]
  });

  // Function to generate a unique ID for each marker
  const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

  // Component to handle map clicks
  function AddMarkerOnClick() {
    useMapEvents({
      click: (e) => {
        if (markers.length < 2) {
          const newMarker: MarkerType = {
            id: generateId(),
            geocode: [e.latlng.lat, e.latlng.lng],
            popUp: `New marker at ${e.latlng.lat.toFixed(2)}, ${e.latlng.lng.toFixed(2)}`
          };
          setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
        }
      }
    });
    return null;
  }

  // Function to handle the deletion of a marker
  const deleteMarker = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setMarkers((prevMarkers) => prevMarkers.filter(marker => marker.id !== id));
  };

  // Define a style function for the GeoJSON layer
  const geoJsonStyle = {
    color: '#3388ff', // border color
    weight: 2,       // border width
    opacity: 0,      // border transparency
    fillColor: '#3388ff', // fill color
    fillOpacity: 0   // fill transparency
  };

  return (
    <div className="page-content dashboardMain">
      <MapContainer className="map" center={[14.1407, 121.4692]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <GeoJSON data={lagunaGeoJson} style={() => geoJsonStyle} />

        {markers.map((marker: MarkerType) => (
          <Marker key={marker.id} position={marker.geocode} icon={customIcon}>
            <Popup>
              {marker.popUp}
              <br />
              <button onClick={(e) => deleteMarker(marker.id, e)}>Delete</button>
            </Popup>
          </Marker>
        ))}

        <AddMarkerOnClick />
      </MapContainer>
    </div>
  );
}
