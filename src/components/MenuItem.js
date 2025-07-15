import React from "react";

const MenuItem = ({ item, data, onJumlahChange, onLevelChange }) => {
  return (
    <li
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "10px",
        background: "#fff",
        height: "100%"
      }}
    >
      <img
        src={item.image}
        alt={item.nama}
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "8px",
          marginRight: "15px",
          objectFit: "cover"
        }}
      />
      <div style={{ flex: 1 }}>
        <strong>{item.nama}</strong> - Rp{item.harga.toLocaleString()}
        <br />
        <input
          type="number"
          min="0"
          placeholder="Jumlah"
          value={data.jumlah || ""}
          onChange={(e) => onJumlahChange(item.nama, e.target.value)}
          style={{ marginTop: "8px", width: "100%" }}
        />
        <select
          value={data.level || ""}
          onChange={(e) => onLevelChange(item.nama, e.target.value)}
          style={{ marginTop: "8px", width: "100%" }}
        >
          <option value="">Level pedas</option>
          <option value="Tidak Pedas">Tidak Pedas</option>
          <option value="Sedang">Sedang</option>
          <option value="Pedas">Pedas</option>
          <option value="Super Pedas">Super Pedas</option>
        </select>
      </div>
    </li>
  );
};

export default MenuItem;
