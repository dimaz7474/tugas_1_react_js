import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: -6.4553553,
  lng: 107.0379105,
};

const FormAlamat = ({ alamat, setAlamat, lokasi, setLokasi }) => {
  const [map, setMap] = useState(null);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  // Inisialisasi Autocomplete
  useEffect(() => {
    if (isLoaded && inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode"],
        componentRestrictions: { country: "id" },
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (!place.geometry || !place.geometry.location) {
          alert("Alamat tidak ditemukan dari autocomplete.");
          return;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const formatted = place.formatted_address;

        setAlamat(formatted);
        setLokasi({ lat, lng });
        if (map) map.panTo({ lat, lng });
      });
    }
  }, [isLoaded]);

  // Cari alamat dari input manual
  const handleGeocode = () => {
    if (!alamat || alamat.trim() === "") {
      alert("Mohon isi alamat terlebih dahulu.");
      return;
    }

    if (!window.google || !window.google.maps) {
      alert("Google Maps belum siap. Silakan tunggu.");
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: alamat, region: "ID" }, (results, status) => {
      if (status === "OK" && results[0]) {
        const loc = results[0].geometry.location;
        const newLoc = { lat: loc.lat(), lng: loc.lng() };
        setLokasi(newLoc);
        if (map) map.panTo(newLoc);
      } else {
        alert("Alamat tidak ditemukan: " + status);
      }
    });
  };

  // Gunakan lokasi saat ini
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung geolokasi.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLokasi({ lat, lng });

        // Dapatkan alamat dari koordinat (reverse geocoding)
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results[0]) {
            setAlamat(results[0].formatted_address);
          } else {
            alert("Gagal mendapatkan alamat dari lokasi.");
          }
        });

        if (map) map.panTo({ lat, lng });
      },
      (error) => {
        alert("Gagal mendeteksi lokasi: " + error.message);
      }
    );
  };

  // Saat marker digeser
  const handleMarkerDragEnd = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setLokasi({ lat, lng });

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setAlamat(results[0].formatted_address);
      }
    });
  };

  if (loadError) {
    return <div>Gagal memuat Google Maps API.</div>;
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <label><strong>Alamat Pengiriman</strong></label><br />
      <input
        ref={inputRef}
        type="text"
        value={alamat}
        onChange={(e) => setAlamat(e.target.value)}
        placeholder="Masukkan alamat lengkap..."
        style={{ width: "100%", padding: "10px", marginTop: "5px" }}
      />

      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <button onClick={handleGeocode}>Cari di Peta</button>
        <button onClick={handleDetectLocation}>Gunakan Lokasi Saya</button>
      </div>

      {isLoaded && (
        <div style={{ marginTop: "20px" }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={lokasi || defaultCenter}
            zoom={15}
            onLoad={(mapInstance) => setMap(mapInstance)}
          >
            <Marker
              position={lokasi || defaultCenter}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
            />
          </GoogleMap>

          <div style={{ marginTop: "10px" }}>
            <small>
              <strong>Lat:</strong> {lokasi?.lat.toFixed(6)} | <strong>Lng:</strong> {lokasi?.lng.toFixed(6)}
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormAlamat;
