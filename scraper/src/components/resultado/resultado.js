import React, { Component } from "react";

export default class resultado extends Component {
  state = { data: [], mPrecio: {} };

  componentDidMount() {
    this.loopData = this.loopData.bind(this);
    this.setState({ data: this.props.res });
  }

  loopData() {
    let elementos = [];
    console.log(this.state.data)
    for (var i = 0; i < this.state.data.length; i++) {
      elementos.push(
        <tr key={i + 1}>
          <td>{this.state.data[i].nombre}</td>
          <td>{this.state.data[i].precio}</td>
          <td>{this.state.data[i].tienda}</td>
          <td>
            <a href={this.state.data[i].url}>IR</a>
          </td>
        </tr>
      );
    }
    return elementos;
  }
  render() {
    return (
      <div>
        <h5 style={{color:'gray'}}>MEJOR PRECIO:</h5>
        <table
          className="table"
        >
          <thead className="thead-dark">
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Tienda</th>
              <th></th>
            </tr>
          </thead>
          <tbody>

          <tr>
          <td>{this.props.mPrecio.nombre}</td>
          <td>{this.props.mPrecio.precio}</td>
          <td>{this.props.mPrecio.tienda}</td>
          <td>
            <a href={this.props.mPrecio.url}>IR</a>
          </td>
        </tr>

          </tbody>
        </table>
        <br/>
        <h5 style={{color:'gray'}}>BUSQUEDAS:</h5>
        <table
          className="table"
          
        >
          <thead className="thead-dark">
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Tienda</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{this.loopData()}</tbody>
        </table>
        </div>
      
    );
  }
}
