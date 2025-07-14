import React from "react";

const WhatsAppButton = ({ pesanan, catatan, menuData }) => {
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

    const totalAll = items.reduce((sum, item) => sum + item.total, 0);
    let pesan = `Halo, saya ingin memesan:\n\n`;

    items.forEach((item, i) => {
      pesan += `${i + 1}. ${item.nama}\n`;
      pesan += `   🔢 Jumlah: ${item.jumlah}\n`;
      pesan += `   🌶️ Level: ${item.level}\n`;
      pesan += `   💵 Harga: Rp${item.harga} x ${item.jumlah} = Rp${item.total}\n\n`;
    });

    pesan += `💰 *Total Keseluruhan: Rp${totalAll.toLocaleString()}*\n`;
    if (catatan.trim()) pesan += `\n📝 *Catatan:* ${catatan.trim()}\n`;
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
