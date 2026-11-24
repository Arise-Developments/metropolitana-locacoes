"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { site } from "@/config/site";

// Ícone próprio em HTML/CSS — evita o problema clássico dos PNGs do Leaflet não carregarem em bundlers.
const pin = L.divIcon({
  className: "",
  html: `<div style="width:34px;height:34px;background:#071630;border:3px solid #7cb8f7;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 6px 14px rgba(0,0,0,.3)"></div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -34],
});

export default function StoreMapInner() {
  const { location, address } = site.store;
  const center: [number, number] = [location.lat, location.lng];
  return (
    <MapContainer
      center={center}
      zoom={location.configured ? 15 : 4}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {location.configured && (
        <Marker position={center} icon={pin}>
          <Popup>
            <strong>{site.name}</strong>
            {address && <><br />{address}</>}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
