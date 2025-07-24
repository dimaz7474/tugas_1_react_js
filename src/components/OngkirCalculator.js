// components/OngkirCalculator.js

export const lokasiToko = {
  lat: -6.4553553,  // Citra Indah Bukit Gladiola
  lng: 107.0379105,
};

/**
 * Hitung ongkos kirim berdasarkan jarak dari toko ke tujuan menggunakan Google Distance Matrix API.
 * Tarif dasar: Rp2500 untuk 3 km pertama, lalu Rp1000 per km tambahan.
 *
 * @param {object} tujuan - Objek lokasi tujuan {lat, lng}
 * @returns {Promise<number>} - Ongkos kirim dalam rupiah
 */
export const hitungOngkir = (tujuan) => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps) {
      return reject("Google Maps belum siap");
    }

    const service = new window.google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [lokasiToko],
        destinations: [tujuan],
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (response, status) => {
        if (status === "OK") {
          try {
            const element = response.rows[0].elements[0];
            if (element.status !== "OK") {
              return reject("Gagal mendapatkan jarak: " + element.status);
            }

            const jarakMeter = element.distance.value;
            const ongkir = calculateOngkirByDistance(jarakMeter);
            resolve(ongkir);
          } catch (err) {
            reject("Error parsing response jarak");
          }
        } else {
          reject("Gagal menghitung jarak: " + status);
        }
      }
    );
  });
};

/**
 * Hitung tarif berdasarkan meter.
 * Dasar: Rp2500 untuk 3 km pertama, Rp1000/km tambahan
 */
export const calculateOngkirByDistance = (jarakMeter) => {
  const baseTarif = 1500;  // 0–3 km
  const perKmTarif = 500;

  if (jarakMeter <= 2000) {
    return baseTarif;
  }

  const kmTambahan = Math.ceil((jarakMeter - 2000) / 1000); // Bulat ke atas
  return baseTarif + (kmTambahan * perKmTarif);
};
