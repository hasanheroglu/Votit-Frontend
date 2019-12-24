import React from 'react';
import {Navbar, Form, Nav, FormControl, Button, NavDropdown, Image} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import Login from './Login';
import logo from "./logo1.jpeg";
import * as utils from './Util';


class MainPage extends React.Component{
    constructor(props){
      super(props)
      this.state = {user: [], company: []}
      this.handleLogoutClick = this.handleLogoutClick.bind(this)      
    }

    componentDidMount(){
        fetch(utils.hostURL + '/users?email=' + localStorage.getItem("Username"), {
            method:'GET',
            headers: utils.headers,
            withCredentials: true,
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(result =>{
            this.setState({user: result.operationObject});
            console.log(result);
        })
        .catch(error =>{
            console.log(error);
        });

    }
    handleLogoutClick(){
        const username = localStorage.getItem("Username")
        localStorage.clear()
        this.setState({update: true});
        this.props.history.push("/login");
        window.location.reload();
    }

    render(){  
      utils.setRoles();
        
        return(
          <div>
            <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/" style={{width: 50, height: 50}}><Image src={require('./votit_logo_small.png')} rounded fluid /></Navbar.Brand>
            <Navbar.Toggle aria- controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link hidden={utils.isUser} href="/login">Login</Nav.Link>
                <Nav.Link hidden={!utils.isSystemAdmin} href="/companies">Companies</Nav.Link>
                <Nav.Link hidden={!utils.isUser} href={"/companies/" + this.state.user.companyName + "/polls"}>My Polls</Nav.Link>
                <Nav.Link hidden={!utils.isCompanyAdmin} href={"/companies/" + this.state.user.companyName}   >{this.state.user.companyName}</Nav.Link>
                <Nav.Link hidden={!utils.isUser} href={"/users/" + this.state.user.id}>{this.state.user.name + " " + this.state.user.surname}</Nav.Link>
                <Nav.Link hidden={!utils.isUser} onClick={() => {this.handleLogoutClick()}}>Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
            </Navbar>
          </div>
            
        )
    }
}

export default MainPage;