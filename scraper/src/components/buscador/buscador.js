import React, { Component } from 'react'
import {Form,Button,Row,Col} from 'react-bootstrap'
import {Link, Redirect} from 'react-router-dom'

export default class buscador extends Component {
    constructor(props){
        super(props)
        this.obtenerResultado = this.obtenerResultado.bind(this)
        this.obtenerKeyword = this.obtenerKeyword.bind(this)
        
    }

    state={
        keyword : ""
    }
    obtenerKeyword(e){
        this.setState({keyword: e.target.value})
        
    }

    mejorPrecio(){
        
       }

    async obtenerResultado(){
        /*Consumir API*/
        this.props.setCargando(0)
        let data = []
        let res = await fetch(`http://localhost:3001/buscar?s=${this.state.keyword}`)
        data = await res.json();
        if(data.length > 0){
            /*Mejor Precio*/
            let x = data[0].precio
            let el = data[0];

            for(let i = 0; i<data.length; i++){
            if(x > data[i].precio){
                x = data[i].precio;
                el = data[i]
            }
            }
        
            
            this.props.getData(data,el);
            this.props.setCargando(1)
        }else{
            this.props.setCargando(-2)
        }
        
    }

    render() {

        return (
            <Row md={{ span: 6, offset: 3 }} className="h-50">
                <Row className="d-flex align-self-end"> <h1 style={{color:"gray"}}>¿Qué componente estás buscando?</h1></Row>
                <Row className="w-100 d-flex align-items-center">
                <Col xs={9}>
                    <Form.Control type="search" size="lg" placeholder="Buscar componente" md="auto" onChange = { this.obtenerKeyword } ></Form.Control>                   
                </Col>
                <Col xs={3} style={this.state.keyword?{display:"inline"}: {display:"none"}}>
                
                <Button variant="secondary" onClick={this.obtenerResultado} >
                    <svg xmlns="http://www.w3.org/2000/svg" style={{fill:"white"}} width="24" height="24" viewBox="0 0 24 24"><path d="M23.822 20.88l-6.353-6.354c.93-1.465 1.467-3.2 1.467-5.059.001-5.219-4.247-9.467-9.468-9.467s-9.468 4.248-9.468 9.468c0 5.221 4.247 9.469 9.468 9.469 1.768 0 3.421-.487 4.839-1.333l6.396 6.396 3.119-3.12zm-20.294-11.412c0-3.273 2.665-5.938 5.939-5.938 3.275 0 5.94 2.664 5.94 5.938 0 3.275-2.665 5.939-5.94 5.939-3.274 0-5.939-2.664-5.939-5.939z"/></svg>
                </Button>
                    
                </Col>
                </Row>
            </Row>
            
        )
    }
}
