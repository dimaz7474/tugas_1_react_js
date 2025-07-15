import React, { useEffect, useState } from "react";
import { hitungOngkir } from "./OngkirCalculator";

const WhatsAppButton = ({ pesanan, catatan, alamat, lokasi, menuData }) => {
  const [ongkir, setOngkir] = useState(0);

  // Hitung ongkir saat lokasi berubah
  useEffect(() => {
    if (lokasi && lokasi.lat && lokasi.lng) {
      hitungOngkir(lokasi)
        .then(setOngkir)
        .catch((err) => {
          console.error(err);
          setOngkir(0);
        });
    }
  }, [lokasi]);

  const handleKirim = () => {
    const items = Object.entries(pesanan)
      .filter(([_, data]) => data.jumlah > 0 && data.level)
      .map(([nama, data]) => {
        const item = menuData.find((m) => m.nama === nama);
        const total = item.harga * data.jumlah;
        return { nama, jumlah: data.jumlah, level: data.level, harga: item.harga, total };
      });

    if (items.length === 0) {
      alert("Silakan isi pesanan terlebih dahulu.");
      return;
    }

    if (!alamat || alamat.trim() === "") {
      alert("Silakan isi alamat pengiriman.");
      return;
    }

    const totalBelanja = items.reduce((sum, item) => sum + item.total, 0);
    const totalKeseluruhan = totalBelanja + ongkir;

    let pesan = `Halo, saya ingin memesan:\n\n`;

    items.forEach((item, i) => {
      pesan += `${i + 1}. ${item.nama}\n`;
      pesan += `   🔢 Jumlah: ${item.jumlah}\n`;
      pesan += `   🌶️ Level: ${item.level}\n`;
      pesan += `   💵 Harga: Rp${item.harga} x ${item.jumlah} = Rp${item.total.toLocaleString()}\n\n`;
    });

    pesan += `💸 *Ongkos Kirim: Rp${ongkir.toLocaleString()}*\n`;
    pesan += `💰 *Total: Rp${totalKeseluruhan.toLocaleString()}*\n`;
    pesan += `🏠 *Alamat Pengiriman:*\n${alamat.trim()}\n`;

    if (catatan.trim()) {
      pesan += `\n📝 *Catatan:* ${catatan.trim()}\n`;
    }

    pesan += `\nTerima kasih 🙏`;

    const url = `https://wa.me/6281380086961?text=${encodeURIComponent(pesan)}`;
    window.open(url, "_blank");
  };

  return (
    <button onClick={handleKirim} style={{ marginTop: "20px" }}>
      Kirim Pesanan via WhatsApp
    </button>
  );
};

export default WhatsAppButton;
