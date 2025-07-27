import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: -6.455085624068794,
  lng: 107.04061439882972,
};

const TrackingMap = () => {
  const [alamat, setAlamat] = useState("");
  const [lokasi, setLokasi] = useState(null);
  const [kurir, setKurir] = useState(defaultCenter);
  const [map, setMap] = useState(null);
  const [route, setRoute] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [travelMode] = useState("DRIVING"); // bisa diubah ke WALKING, BICYCLING, TRANSIT
  const [antarAktif, setAntarAktif] = useState(false);

  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const animationRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Inisialisasi autocomplete
  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      const google = window.google;
      if (!google || !google.maps.places) return;

      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode"],
        componentRestrictions: { country: "id" },
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (!place.geometry || !place.geometry.location) {
          alert("Alamat tidak ditemukan.");
          return;
        }

        const tujuan = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        setAlamat(place.formatted_address);
        setLokasi(tujuan);
        if (map) map.panTo(tujuan);
      });
    }
  }, [isLoaded]);

  const getRoute = (origin, destination) => {
    const google = window.google;
    if (!google || !google.maps) return;

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode[travelMode],
      },
      (result, status) => {
        if (status === "OK" && result) {
          setRoute(result);
          const leg = result.routes[0].legs[0];
          setDistance(leg.distance.text);
          setDuration(leg.duration.text);
          animateKurir(origin, destination);
        } else {
          alert("Gagal mendapatkan rute: " + status);
        }
      }
    );
  };

  const animateKurir = (from, to) => {
    let progress = 0;
    const steps = 100;

    cancelAnimationFrame(animationRef.current);

    const step = () => {
      progress += 1;
      const lat = from.lat + (to.lat - from.lat) * (progress / steps);
      const lng = from.lng + (to.lng - from.lng) * (progress / steps);
      setKurir({ lat, lng });

      if (progress < steps) {
        animationRef.current = requestAnimationFrame(step);
      }
    };

    step();
  };

  const handleCariPeta = () => {
    if (!alamat.trim()) {
      alert("Mohon isi alamat terlebih dahulu.");
      return;
    }

    const google = window.google;
    if (!google || !google.maps) {
      alert("Google Maps belum siap.");
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: alamat }, (results, status) => {
      if (status === "OK" && results[0]) {
        const tujuan = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };

        setAlamat(results[0].formatted_address);
        setLokasi(tujuan);
        if (map) map.panTo(tujuan);
      } else {
        alert("Alamat tidak ditemukan: " + status);
      }
    });
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolokasi tidak didukung browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const tujuan = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setLokasi(tujuan);

        const google = window.google;
        if (google?.maps) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: tujuan }, (results, status) => {
            if (status === "OK" && results[0]) {
              setAlamat(results[0].formatted_address);
            }
          });
        }

        if (map) map.panTo(tujuan);
      },
      (err) => {
        alert("Gagal deteksi lokasi: " + err.message);
      }
    );
  };

  const handleMulaiAntar = () => {
    if (!lokasi) {
      alert("Pilih alamat tujuan terlebih dahulu.");
      return;
    }
    setAntarAktif(true);
    getRoute(kurir, lokasi);
  };

  if (loadError) return <div>Gagal memuat Google Maps.</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tracking Pengiriman</h2>
      <input
        ref={inputRef}
        type="text"
        value={alamat}
        onChange={(e) => setAlamat(e.target.value)}
        placeholder="Masukkan alamat tujuan"
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button onClick={handleCariPeta}>Cari di Peta</button>
        <button onClick={handleDetectLocation}>Gunakan Lokasi Saya</button>
        <button onClick={handleMulaiAntar} style={{ background: "#28a745", color: "white" }}>
          Mulai Mengantar
        </button>
      </div>

      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={kurir}
          zoom={14}
          onLoad={(mapInstance) => setMap(mapInstance)}
        >
          <Marker position={kurir} icon={{ url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png" }} />
          {lokasi && <Marker position={lokasi} icon={{ url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png" }} />}
          {route && <DirectionsRenderer directions={route} />}
        </GoogleMap>
      )}

      {/* Estimasi Waktu & Jarak */}
      {antarAktif && distance && duration && (
        <div style={{ marginTop: "10px" }}>
          <strong>Estimasi:</strong> {distance} ({duration})
        </div>
      )}
    </div>
  );
};

export default TrackingMap;
