import React from 'react';
import {Navbar, Form, Nav, FormControl, Button, NavDropdown} from 'react-bootstrap';


class MainPage extends React.Component{
    render(){
        return(
            <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">VOTIT</Navbar.Brand>
            <Navbar.Toggle aria- controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/companies">Companies</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
            
        )
    }
}

export default MainPage;