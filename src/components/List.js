import React from "react";

const List = () => {
  const menuList = [
    "Mie Goreng Spesial",
    "Mie Nyemek Pedas",
    "Mie Kuah Ayam",
    "Mie Kari Telur",
    "Mie Goreng Jawa"
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Daftar Menu Unggulan</h2>
      <ol>
        {menuList.map((menu, index) => (
          <li key={index}>{menu}</li>
        ))}
      </ol>
    </div>
  );
};

export default List;
