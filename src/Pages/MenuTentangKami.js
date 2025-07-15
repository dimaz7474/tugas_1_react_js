import React, { Component } from "react";

class MenuTentangKami extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tentang: "Aneka Mie Mrs. DK menyajikan berbagai masakan Mie khas Indonesia dengan cita rasa autentik."
    };
  }

  render() {
    return (
      <div>
        <center>
          <p>Tentang Kami </p> 
          {this.state.tentang}
        </center>
      </div>
    );
  }
}

export default MenuTentangKami;

// Penjelasan:
// this.state = { tentang: "..." } digunakan untuk menyimpan data dalam state lokal komponen.

// this.state.tentang dipanggil di bagian render() untuk ditampilkan ke pengguna.
