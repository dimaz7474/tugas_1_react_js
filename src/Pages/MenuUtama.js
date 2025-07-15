import React, { Component } from "react";
import ListMenuUtama from "../components/ListMenuUtama";
import images from "../components/images";
import ListMakanan from "../components/ListMakanan";

class MenuUtama extends Component {
  render() {
    const menuList = [
      { nama: "Mie Goreng Spesial", gambar: images["Mie Goreng Spesial"] },
      { nama: "Mie Nyemek Pedas", gambar: images["Mie Nyemek Pedas"] },
      { nama: "Mie Kuah Ayam", gambar: images["Mie Kuah Ayam"] },
      { nama: "Mie Kari Telur", gambar: images["Mie Kari Telur"] },
      { nama: "Mie Goreng Jawa", gambar: images["Mie Goreng Jawa"] },
    ];

    return (
      <div style={{ padding: "20px" }}>
        {/* Gambar utama */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <ListMenuUtama gambar={images["DK"]} />
          <img
           // src={images["DK"]}
           // alt="Mrs. DK"
            style={{ width: "75px", height: "auto", borderRadius: "50%" }}
          />
        </div>

        <h3>Daftar Makanan Yang Kami Sediakan :</h3>

        {/* List Makanan */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
            marginTop: "20px"
          }}
        >
          {menuList.map((item, index) => (
            <div
              key={index}
              style={{
                width: "150px",
                textAlign: "center",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "10px"
              }}
            >
              <ListMakanan gambar={item.gambar} />
              <img
                //src={item.gambar}
                //alt={item.nama}
                style={{ width: "100%", maxWidth: "100px", height: "auto" }}
              />
              <p style={{ marginTop: "10px", fontWeight: "bold" }}>{item.nama}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default MenuUtama;
