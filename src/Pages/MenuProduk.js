import React, { useState } from "react";
import MenuList from "../components/MenuList";
import CatatanForm from "../components/CatatanForm";
import FormAlamat from "../components/AlamatPengirimanForm";
import WhatsAppButton from "../components/WhatsAppButton";
import images from "../components/images";

const menuData = [
  {
    nama: "Mie Goreng Spesial",
    kategori: "goreng",
    harga: 15000,
    image: images["Mie Goreng Spesial"]
  },
  {
    nama: "Mie Nyemek Pedas",
    kategori: "kuah",
    harga: 16000,
    image: images["Mie Nyemek Pedas"]
  },
  {
    nama: "Mie Kuah Ayam",
    kategori: "kuah",
    harga: 14000,
    image: images["Mie Kuah Ayam"]
  },
  {
    nama: "Mie Kari Telur",
    kategori: "kuah",
    harga: 17000,
    image: images["Mie Kari Telur"]
  },
  {
    nama: "Mie Goreng Jawa",
    kategori: "goreng",
    harga: 15000,
    image: images["Mie Goreng Jawa"]
  }
];

const MenuProduk = () => {
  const [pesanan, setPesanan] = useState({});
  const [catatan, setCatatan] = useState("");
  const [alamat, setAlamat] = useState("");
  const [lokasi, setLokasi] = useState({ lat: -6.2, lng: 106.8 });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKategori, setFilterKategori] = useState("semua");

  const handleJumlahChange = (nama, jumlah) => {
    setPesanan((prev) => ({
      ...prev,
      [nama]: {
        ...prev[nama],
        jumlah: parseInt(jumlah) || 0
      }
    }));
  };

  const handleLevelChange = (nama, level) => {
    setPesanan((prev) => ({
      ...prev,
      [nama]: {
        ...prev[nama],
        level
      }
    }));
  };

  const handleStreetFoodFilter = (tipe) => {
    switch (tipe) {
      case "pedas":
        setSearchTerm("pedas");
        break;
      case "telur":
        setSearchTerm("telur");
        break;
      default:
        setSearchTerm("");
    }
  };

  let filteredMenu = menuData.filter((item) => {
    const cocokKategori =
      filterKategori === "semua" || item.kategori === filterKategori;
    const cocokSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
    return cocokKategori && cocokSearch;
  });

  return (
    <div style={{
      padding: "1rem",
      maxWidth: "800px",
      margin: "auto",
      fontFamily: "sans-serif"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Menu Produk</h2>

      {/* Filter dan Pencarian */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "15px"
      }}>
        <select value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)} style={{ flex: "1" }}>
          <option value="semua">Semua Kategori</option>
          <option value="goreng">Mie Goreng</option>
          <option value="kuah">Mie Kuah</option>
        </select>

        <input
          type="text"
          placeholder="Cari menu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: "2" }}
        />
      </div>

      {/* Filter Cepat */}
      <div style={{
        marginBottom: "20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        justifyContent: "center"
      }}>
        <button onClick={() => handleStreetFoodFilter("pedas")}>🔥 Pedas</button>
        <button onClick={() => handleStreetFoodFilter("telur")}>🥚 Pakai Telur</button>
        <button onClick={() => handleStreetFoodFilter("")}>🔄 Reset</button>
      </div>

      {/* Daftar Menu */}
      <MenuList
        menuData={filteredMenu}
        pesanan={pesanan}
        onJumlahChange={handleJumlahChange}
        onLevelChange={handleLevelChange}
      />

      <CatatanForm catatan={catatan} onChange={setCatatan} />

      <FormAlamat
        alamat={alamat}
        setAlamat={setAlamat}
        lokasi={lokasi}
        setLokasi={setLokasi}
      />

      <h3 style={{ marginTop: "2rem" }}>Checkout</h3>

      <WhatsAppButton
        pesanan={pesanan}
        catatan={catatan}
        alamat={alamat}
        lokasi={lokasi}
        menuData={menuData}
      />
    </div>
  );
};

export default MenuProduk;
