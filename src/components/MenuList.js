import React from "react";
import MenuItem from "./MenuItem";

const MenuList = ({ menuData, pesanan, onJumlahChange, onLevelChange }) => {
  return (
    <ul
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
        padding: 0,
        listStyle: "none"
      }}
    >
      {menuData.map((item) => (
        <MenuItem
          key={item.nama}
          item={item}
          data={pesanan[item.nama] || {}}
          onJumlahChange={onJumlahChange}
          onLevelChange={onLevelChange}
        />
      ))}
    </ul>
  );
};

export default MenuList;
