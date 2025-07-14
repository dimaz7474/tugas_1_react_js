import React from "react";
import MenuItem from "./MenuItem";

const MenuList = ({ menuData, pesanan, onJumlahChange, onLevelChange }) => {
  return (
    <ol style={{ listStyle: "none", padding: 0 }}>
      {menuData.map((item) => (
        <MenuItem
          key={item.nama}
          item={item}
          data={pesanan[item.nama] || {}}
          onJumlahChange={onJumlahChange}
          onLevelChange={onLevelChange}
        />
      ))}
    </ol>
  );
};

export default MenuList;
