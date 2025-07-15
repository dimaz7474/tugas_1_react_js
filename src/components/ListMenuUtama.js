import React, { Component } from "react";

class ListMenuUtama extends Component {
  render() {
    return (
      <div>
        <h1>
          <center> Selamat Datang Di Mrs. DK </center>
        </h1>
        <center>
          <img src={this.props.gambar} alt="Mie Mrs. DK" width="200" height="auto" />
        </center>
      </div>
    );
  }
}

export default ListMenuUtama;
