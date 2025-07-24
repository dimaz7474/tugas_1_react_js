import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: -6.4553553, // citra indah
  lng: 107.0379105,
};

const FormAlamat = ({ alamat, setAlamat, lokasi, setLokasi }) => {
  const [map, setMap] = useState(null);
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  const handleGeocode = () => {
    if (!alamat || alamat.trim() === "") {
      alert("Mohon isi alamat terlebih dahulu.");
      return;
    }

    if (!window.google || !window.google.maps) {
      alert("Google Maps belum siap. Silakan tunggu beberapa detik.");
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: alamat }, (results, status) => {
      if (status === "OK" && results[0]) {
        const loc = results[0].geometry.location;
        const newLoc = { lat: loc.lat(), lng: loc.lng() };
        setLokasi(newLoc);
        if (map) map.panTo(newLoc);
      } else {
        alert("Alamat tidak ditemukan: " + status);
        console.error("Geocode error:", results, status);
      }
    });
  };

  if (loadError) {
    return <div>Gagal memuat Google Maps API. Pastikan API key benar.</div>;
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <label><strong>Alamat Pengiriman</strong></label><br />
      <input
        type="text"
        value={alamat}
        onChange={(e) => setAlamat(e.target.value)}
        placeholder="Masukkan Nama dan alamat lengkap..."
        style={{ width: "100%", padding: "10px", marginTop: "5px" }}
      />
      <button onClick={handleGeocode} style={{ marginTop: "10px" }}>
        Cari di Peta
      </button>

      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={lokasi || defaultCenter}
          zoom={15}
          onLoad={(mapInstance) => setMap(mapInstance)}
        >
          <Marker position={lokasi || defaultCenter} />
        </GoogleMap>
      )}
    </div>
  );
};

export default FormAlamat;
