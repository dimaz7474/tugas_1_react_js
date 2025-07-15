import React, { Component } from "react";
import ListMenuUtama from "../components/ListMenuUtama"; // pastikan path sesuai lokasi file
import images from "../components/images"; 
import ListMakanan from "../components/ListMakanan"; // sesuaikan path jika file ada di folder berbeda
class MenuUtama extends Component {
  render() {
    return (
      <div>
        <ListMenuUtama gambar={images["DK"]} width="75px" height="auto" />
        <img 
  src={this.props.gambar || images["DK"]} 
  alt="Mrs. DK"
  style={{ width: "30px", height: "auto" }}
/>
       <div>
        <h3>Daftar Makanan Yang Kami Sediakan :</h3>
        <table>
          <tbody>
            <tr>
              <td>
                 <ListMakanan gambar={images["Mie Goreng Spesial"]} width="75px" height="auto" />
        <img 
  src={this.props.gambar || images["Mie Goreng Spesial"]} 
  alt="Mie Goreng Spesial"
  style={{ width: "30px", height: "auto" }}
/><p>Mie Goreng Spesial</p>
              </td>
              <td>
 <ListMakanan gambar={images["Mie Nyemek Pedas"]} width="75px" height="auto" />
        <img 
  src={this.props.gambar || images["Mie Nyemek Pedas"]} 
  alt="Mie Nyemek Pedas"
  style={{ width: "30px", height: "auto" }}
/><p>Mie Nyemek Pedas</p>
</td>
              <td>
                <ListMakanan gambar={images["Mie Kuah Ayam"]} width="75px" height="auto" />
                <img
                  src={this.props.gambar || images["Mie Kuah Ayam"]}
                  alt="Mie Kuah Ayam"
                  style={{ width: "30px", height: "auto" }} 
                /><p>Mie Kuah Ayam</p>
              </td>
              <td>
                <ListMakanan gambar={images["Mie Kari Telur"]} width="75px" height="auto" />
                <img
                  src={this.props.gambar || images["Mie Kari Telur"]}
                  alt="Mie Kari Telur"
                  style={{ width: "30px", height: "auto" }}
                /><p>Mie Kari Telur</p>
              </td>
              <td>
<ListMakanan gambar={images["Mie Goreng Jawa"]} width="75px" height="auto" />
        <img 
  src={this.props.gambar || images["Mie Goreng Jawa"]} 
  alt="Mie Goreng Jawa"
  style={{ width: "30px", height: "auto" }}
/><p>Mie Goreng Jawa</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
    );
  }
}

export default MenuUtama;
