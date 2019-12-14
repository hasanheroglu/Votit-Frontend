import React from 'react';
import {Navbar, Form, Nav, FormControl, Button, NavDropdown, Image} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import Login from './Login';
import logo from "./logo1.jpeg";

class MainPage extends React.Component{
    constructor(props){
      super(props)
      this.state = {user: [], company: []}
      this.handleLogoutClick = this.handleLogoutClick.bind(this)      
    }

    componentDidMount(){
        fetch('http://localhost:8080/users?email=' + localStorage.getItem("Username"), {
            method:'GET',
            headers:{ 
                'Authorization': localStorage.getItem("Authorization"), 
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Access-Control-Allow-Credentials':  true,
                'Access-Control-Allow-Origin':'http://localhost:3000/'
            },
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
        var isSystemAdmin = false;
        var isCompanyAdmin = false;
        var isPollOwner = false;
        var isUser = false;

        let roles = localStorage.getItem("Roles");
        if(roles){
          if(roles.includes("ROLE_SYSTEM_ADMIN")){
            isSystemAdmin = true;
          } else{
            isSystemAdmin = false;
          }
          if(roles.includes("ROLE_COMPANY_ADMIN")){
            isCompanyAdmin = true;
          } else{
            isCompanyAdmin = false;
          }
          if(roles.includes("ROLE_POLL_OWNER")){
            isPollOwner = true;
          } else{
            isPollOwner = false;
          }
          if(roles.includes("ROLE_USER")){
            isUser = true;
          } else{
            isUser = false;
          }
        }
        
        return(
          <div>
            <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/" style={{width: 50, height: 50}}><Image src={require('./votit_logo_small.png')} rounded fluid /></Navbar.Brand>
            <Navbar.Toggle aria- controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link hidden={isUser} href="/login">Login</Nav.Link>
                <Nav.Link hidden={!isSystemAdmin} href="/companies">Companies</Nav.Link>
                <Nav.Link hidden={!isUser} href={"/companies/" + this.state.user.companyName + "/polls"}>My Polls</Nav.Link>
                <Nav.Link hidden={!isUser} href={"/companies/" + this.state.user.companyName}   >{this.state.user.companyName}</Nav.Link>
                <Nav.Link hidden={!isUser} href={"/users/" + this.state.user.id}>{this.state.user.name + " " + this.state.user.surname}</Nav.Link>
                <Nav.Link hidden={!isUser} onClick={() => {this.handleLogoutClick()}}>Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
            </Navbar>
          </div>
            
        )
    }
}

export default MainPage;