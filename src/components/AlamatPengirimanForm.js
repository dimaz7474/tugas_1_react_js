// FormAlamat.js
import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px"
};

const defaultCenter = {
  lat: -6.200000,
  lng: 106.816666
};

const FormAlamat = ({ alamat, setAlamat, lokasi, setLokasi }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBRDh37f1Wpt3q7TnUNBOo39CWeuDfTCIo"
  });

  const handleGeocode = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: alamat }, (results, status) => {
      if (status === "OK") {
        const loc = results[0].geometry.location;
        setLokasi({ lat: loc.lat(), lng: loc.lng() });
      } else {
        alert("Alamat tidak ditemukan: " + status);
      }
    });
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <label><strong>Alamat Pengiriman</strong></label><br />
      <input
        type="text"
        value={alamat}
        onChange={(e) => setAlamat(e.target.value)}
        placeholder="Masukkan alamat lengkap..."
        style={{ width: "100%", padding: "10px", marginTop: "5px" }}
      />
      <button onClick={handleGeocode} style={{ marginTop: "10px" }}>
        Cari di Peta
      </button>

      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={lokasi}
          zoom={15}
        >
          <Marker position={lokasi} />
        </GoogleMap>
      )}
    </div>
  );
};

export default FormAlamat;
