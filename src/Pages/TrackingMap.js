import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader, Polyline } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultPengantar = {
  lat: -6.4553553,
  lng: 107.0379105,
};

const TrackingMap = () => {
  const [map, setMap] = useState(null);
  const [pengantar, setPengantar] = useState(defaultPengantar);
  const [alamatTujuan, setAlamatTujuan] = useState('');
  const [tujuan, setTujuan] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // Inisialisasi Autocomplete
  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'id' },
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (!place.geometry || !place.geometry.location) {
          alert('Alamat tidak ditemukan dari autocomplete.');
          return;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const formatted = place.formatted_address;

        setAlamatTujuan(formatted);
        setTujuan({ lat, lng });
        setIsTracking(false);
        setTimeout(() => {
          if (map) map.panTo({ lat, lng });
        }, 100);
      });
    }
  }, [isLoaded]);

  // Simulasi pergerakan kurir setelah klik "Mulai Pengantaran"
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      setPengantar((prev) => ({
        ...prev,
        lng: prev.lng + 0.0005, // bergerak ke kanan
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isTracking]);

  // Fungsi geocode manual jika autocomplete tidak digunakan
  const handleGeocode = () => {
    if (!alamatTujuan.trim()) {
      alert('Mohon isi alamat terlebih dahulu.');
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: alamatTujuan }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const loc = results[0].geometry.location;
        const coords = {
          lat: loc.lat(),
          lng: loc.lng(),
        };
        setTujuan(coords);
        setIsTracking(false);
        setTimeout(() => {
          if (map) map.panTo(coords);
        }, 100);
      } else {
        alert('Gagal menemukan alamat: ' + status);
      }
    });
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser tidak mendukung geolokasi.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setTujuan({ lat, lng });
        setAlamatTujuan(''); // bisa reverse geocode jika ingin
        setIsTracking(false);
        setTimeout(() => {
          if (map) map.panTo({ lat, lng });
        }, 100);
      },
      (error) => {
        alert('Gagal mendeteksi lokasi: ' + error.message);
      }
    );
  };

  if (loadError) return <div>Gagal memuat Google Maps</div>;

  return isLoaded ? (
    <div style={{ padding: '20px' }}>
      <h2>Tracking Pengiriman</h2>

      <div style={{ marginBottom: '10px' }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Masukkan alamat tujuan"
          value={alamatTujuan}
          onChange={(e) => setAlamatTujuan(e.target.value)}
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <button onClick={handleGeocode}>Cari di Peta</button>
        <button onClick={handleDetectLocation} style={{ marginLeft: '5px' }}>
          Gunakan Lokasi Saya
        </button>
        <button
          onClick={() => setIsTracking(true)}
          style={{ marginLeft: '10px', backgroundColor: 'green', color: 'white', padding: '6px 12px' }}
          disabled={!tujuan}
        >
          Mulai Pengantaran
        </button>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={pengantar}
        zoom={14}
        onLoad={(mapInstance) => setMap(mapInstance)}
      >
        {/* Marker Kurir */}
        <Marker
          position={pengantar}
          label="Kurir"
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          }}
        />

        {/* Marker Tujuan */}
        {tujuan && tujuan.lat && tujuan.lng && (
          <Marker
            position={tujuan}
            label="Tujuan"
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
            }}
          />
        )}

        {/* Jalur Polyline */}
        {tujuan && (
          <Polyline
            path={[pengantar, tujuan]}
            options={{
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        )}
      </GoogleMap>
    </div>
  ) : (
    <p>Memuat peta...</p>
  );
};

export default TrackingMap;
