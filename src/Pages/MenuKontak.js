import React, { Component } from "react";

class MenuKontak extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alamat: "Jl. Lezat No. 17, Jakarta",
      kontak: "0813-8008-6961"
    };
  }

  render() {
    return (
      <div>
        <center>
          <h3>{this.state.alamat}</h3>
          <h4>Kontak Kami : {this.state.kontak}</h4>
        </center>
      </div>
    );
  }
}

export default MenuKontak;
