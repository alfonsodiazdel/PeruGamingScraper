import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Buscador from './components/buscador/buscador'
import { Container, Spinner } from 'react-bootstrap';
import Resultado from './components/resultado/resultado';
import {BrowserRouter as Router, Route} from 'react-router-dom'

export default class App extends React.Component {

  constructor(props){
    super(props)
    this.getData = this.getData.bind(this)
    this.setCargando = this.setCargando.bind(this)
  }
  state = {
    data : [],
    mejorPrecio: {},
    cargando: -1
  }
  setCargando(val){
    this.setState({cargando:val})
  }
  getData(data,mPrecio){
    this.setState({data: data})
    this.setState({mejorPrecio: mPrecio})
  }
  resultado(){
    // eslint-disable-next-line default-case
    switch(this.state.cargando){
      case -2:
        return <div style={{textAlign:'center'}}><h4>No se encontraron datos</h4></div>
      case -1:
        return
      case 0:
        return  (<div style={{textAlign:'center'}}>
        <Spinner animation="grow" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
      </div>)
      case 1:
        return <Resultado res={this.state.data} mPrecio={this.state.mejorPrecio}/>
    }        
    
  }
  render() {
    return (
      <Container>
        <Router>
        <Route exact path={['/']}>
        <Buscador getData={this.getData} setCargando={this.setCargando}></Buscador> 
        {this.resultado()}
        </Route>
        </Router>
      </Container>
    )
  }
}

