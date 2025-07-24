import React from "react";

const CatatanForm = ({ catatan, onChange }) => {
  return (
    <div style={{ marginTop: "20px" }}>
      <label><strong>Catatan Tambahan</strong></label>
      <br />
      <textarea
        placeholder="Contoh: Nama pembeli - Bungkus terpisah, telur rebus / mata sapi ,tanpa cabe..."
        rows="3"
        style={{ width: "100%", padding: "10px", marginTop: "5px" }}
        value={catatan}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default CatatanForm;
