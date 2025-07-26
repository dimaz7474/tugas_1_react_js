import React, { useEffect, useRef, useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: -6.4553553, // Pusat peta default (Citra Indah, Jonggol)
  lng: 107.0379105,
};

const FormAlamat = ({ alamat, setAlamat, lokasi, setLokasi }) => {
  const [map, setMap] = useState(null);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [userCurrentLocation, setUserCurrentLocation] = useState(null); // State untuk lokasi actual pengguna
  const [suggestions, setSuggestions] = useState([]); // State untuk saran toko/tempat dari PlacesService
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Perhatikan: Menggunakan process.env.REACT_APP_Maps_API_KEY sesuai script Anda
  const apiKey = process.env.REACT_APP_Maps_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  // 1. Dapatkan Lokasi Pengguna Saat Ini (di awal loading)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserCurrentLocation(userLoc);
          // Set peta ke lokasi pengguna jika belum ada lokasi default/tersimpan
          if (!lokasi || (!lokasi.lat && !lokasi.lng)) { // Periksa juga jika 'lokasi' null/undefined
            setLokasi(userLoc);
            if (map) map.panTo(userLoc);
          }
        },
        (err) => {
          console.warn("Error getting user location:", err.message);
          // Opsional: berikan feedback ke user bahwa lokasi tidak dapat diambil
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, [map, lokasi, setLokasi]); // Dependensi: map, lokasi, setLokasi

  // 2. Inisialisasi Autocomplete (dengan locationBias dan perbaikan place_changed listener)
  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) { // Pastikan hanya inisialisasi sekali
      // Options untuk Autocomplete
      const autocompleteOptions = {
        // PENTING: Tambahkan 'establishment' untuk mencari nama bisnis/tempat selain alamat
        types: ["geocode", "establishment"],
        componentRestrictions: { country: "id" },
        // locationBias: Prioritaskan hasil di sekitar lokasi pengguna jika tersedia
        // Menggunakan Circle untuk bounds agar lebih akurat
        bounds: userCurrentLocation
          ? new window.google.maps.Circle({
              center: userCurrentLocation,
              radius: 50000, // 50 km radius sekitar pengguna
            }).getBounds()
          : undefined, // Jika userCurrentLocation belum ada, jangan set bounds
        strictBounds: false, // Izinkan hasil di luar bounds jika tidak ada yang cocok di dalam
      };

      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        autocompleteOptions
      );

      autocompleteRef.current.addListener("place_changed", async () => {
        const place = autocompleteRef.current.getPlace();

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> PERBAIKAN UTAMA DI SINI <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        if (!place.geometry || !place.geometry.location) {
          console.warn("Place object incomplete from Autocomplete:", place);
          // Jika geometry tidak ada (mungkin pengguna menekan enter terlalu cepat atau jenis tempat yang tidak memiliki geometry langsung)
          // Coba gunakan informasi lain yang tersedia atau berikan feedback
          if (place.name && place.formatted_address) {
            // Jika ada nama dan alamat terformat, setidaknya isi input
            setAlamat(place.formatted_address);
            alert(`Detail lokasi untuk "${place.name}" tidak dapat dimuat secara otomatis. Silakan klik "Cari Alamat di Peta" atau geser marker secara manual.`);
          } else if (place.name) {
            // Jika hanya ada nama
            setAlamat(place.name);
            alert(`Detail lokasi untuk "${place.name}" tidak dapat dimuat secara otomatis. Coba gunakan fitur "Cari Alamat di Peta".`);
          } else if (place.formatted_address) {
            // Jika hanya ada alamat terformat
            setAlamat(place.formatted_address);
            alert("Detail lokasi tidak lengkap dari autocomplete. Coba cari ulang atau geser marker.");
          } else {
            alert("Alamat tidak ditemukan dari autocomplete. Mohon coba lagi atau masukkan manual.");
          }
          setSuggestions([]); // Hapus saran dari PlacesService jika ada
          return; // Hentikan eksekusi lebih lanjut jika place tidak lengkap
        }
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> AKHIR PERBAIKAN UTAMA <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const formatted = place.formatted_address || place.name; // Pilih yang lebih relevan

        setAlamat(formatted);
        setLokasi({ lat, lng });

        if (map) map.panTo({ lat, lng });
        setSuggestions([]); // Sembunyikan saran toko/tempat setelah memilih dari autocomplete
      });
    }
  }, [isLoaded, userCurrentLocation, map, setAlamat, setLokasi]); // Tambahkan map, setAlamat, setLokasi ke dependensi

  // Geocode dari input alamat manual (Tidak ada perubahan signifikan disini)
  const handleGeocode = () => {
    if (!alamat || alamat.trim() === "") {
      alert("Mohon isi alamat terlebih dahulu.");
      return;
    }

    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      alert("Google Maps API belum siap. Silakan tunggu.");
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

  // Saat marker digeser manual
  const handleMarkerDragEnd = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setLokasi({ lat, lng });

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setAlamat(results[0].formatted_address);
      }
    });
  }, [setLokasi, setAlamat]);

  // 3. Fungsi untuk mencari toko terdekat menggunakan PlacesService
  const searchNearbyPlaces = useCallback(async (query) => {
    if (!isLoaded || !window.google || !window.google.maps || !window.google.maps.places) {
      console.warn("Google Maps Places API belum siap.");
      return;
    }

    setLoadingSuggestions(true);
    setSuggestions([]); // Clear previous suggestions

    // Menggunakan map instance untuk PlacesService. Jika map belum ada (misal pada load awal), buat elemen dummy.
    // Ini penting agar PlacesService memiliki konteks DOM.
    const service = new window.google.maps.places.PlacesService(map || document.createElement('div'));

    const request = {
      location: userCurrentLocation || defaultCenter, // Cari di sekitar lokasi pengguna atau default
      radius: '50000', // Radius 50 km (maksimal untuk PlacesService.textSearch jika tanpa strictBounds)
      query: query, // Query pencarian, misal "kopi kenangan citra indah"
      // type: ['cafe', 'restaurant', 'store'] // Opsional: batasi jenis tempat (cocokkan dengan kebutuhan Anda)
    };

    service.textSearch(request, (results, status) => {
      setLoadingSuggestions(false);
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        // Filter out results that might not have geometry
        const validResults = results.filter(place => place.geometry && place.geometry.location);

        // Hitung jarak dan sortir
        const sortedResults = validResults.map(place => {
            if (userCurrentLocation && place.geometry && place.geometry.location) {
                const distanceKm = calculateHaversineDistance(userCurrentLocation, {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                });
                return { ...place, distance: distanceKm };
            }
            return place; // Should not happen if filtered, but for safety
        }).sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));

        setSuggestions(sortedResults.map(place => ({
            name: place.name,
            address: place.formatted_address,
            place_id: place.place_id,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            distance: place.distance ? `${place.distance.toFixed(1)} km` : null
        })));
      } else {
        console.error("Places Service textSearch error:", status);
        setSuggestions([]);
      }
    });
  }, [isLoaded, map, userCurrentLocation]); // Dependensi: isLoaded, map, userCurrentLocation

  // 4. Trigger pencarian saran saat input berubah (dengan debounce)
  useEffect(() => {
    const handler = setTimeout(() => {
      // Hanya panggil searchNearbyPlaces jika input lebih dari 2 karakter dan ada lokasi pengguna
      if (alamat.length > 2 && isLoaded && userCurrentLocation) {
        searchNearbyPlaces(alamat);
      } else {
        setSuggestions([]); // Hapus saran jika input terlalu pendek atau lokasi belum terdeteksi
      }
    }, 500); // Debounce 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [alamat, isLoaded, userCurrentLocation, searchNearbyPlaces]);

  // Fungsi Haversine Distance
  const calculateHaversineDistance = (coords1, coords2) => {
    const R = 6371; // Radius Bumi dalam kilometer
    const dLat = (coords2.lat - coords1.lat) * Math.PI / 180;
    const dLon = (coords2.lng - coords1.lng) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(coords1.lat * Math.PI / 180) * Math.cos(coords2.lat * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  if (loadError) {
    return <div>Gagal memuat Google Maps API. Pastikan kunci API Anda benar dan aktifkan Places API.</div>;
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <label><strong>Alamat Pengiriman</strong></label><br />
      <input
        ref={inputRef}
        type="text"
        value={alamat}
        onChange={(e) => setAlamat(e.target.value)}
        placeholder="Masukkan alamat lengkap atau cari toko terdekat (mis: kopi kenangan citra indah)"
        style={{ width: "100%", padding: "10px", marginTop: "5px" }}
      />
      {/* Tampilkan loading dan saran dari PlacesService */}
      {loadingSuggestions && <p style={{ color: '#007bff' }}>Mencari saran lokasi...</p>}
      <ul style={{ listStyleType: 'none', padding: 0, border: suggestions.length > 0 ? '1px solid #ddd' : 'none', maxHeight: '200px', overflowY: 'auto' }}>
        {suggestions.map((suggestion, index) => (
          <li
            key={suggestion.place_id || index} // Gunakan place_id sebagai key unik
            style={{
              padding: '10px',
              borderBottom: '1px solid #eee',
              cursor: 'pointer',
              backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
            }}
            onClick={() => {
              setAlamat(suggestion.address || suggestion.name);
              setLokasi({ lat: suggestion.lat, lng: suggestion.lng });
              if (map) map.panTo({ lat: suggestion.lat, lng: suggestion.lng });
              setSuggestions([]); // Sembunyikan saran setelah memilih
            }}
          >
            📍 {suggestion.name} {suggestion.distance && `(${suggestion.distance})`}
            <br />
            <small style={{ color: '#666' }}>{suggestion.address}</small>
          </li>
        ))}
      </ul>

      {/* Tombol ini bisa menjadi fallback jika autocomplete atau saran tidak bekerja optimal */}
      <button onClick={handleGeocode} style={{ marginTop: "10px" }}>
        Cari Alamat di Peta (jika tidak ada saran)
      </button>

      {isLoaded && (
        <div>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={lokasi || userCurrentLocation || defaultCenter} // Prioritas: lokasi dipilih > lokasi pengguna > default
            zoom={lokasi ? 15 : (userCurrentLocation ? 13 : 10)} // Zoom lebih dekat jika ada lokasi spesifik
            onLoad={(mapInstance) => setMap(mapInstance)}
          >
            <Marker
              position={lokasi || userCurrentLocation || defaultCenter}
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