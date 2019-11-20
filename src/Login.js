import React from 'react';
import {Redirect} from 'react-router-dom';
import { Form,FormGroup, FormLabel, FormControl, Button } from 'react-bootstrap';

class Login extends React.Component{
    constructor(props){
        super(props)
        this.state = {email: '', password: '', status: 'WAITING'}
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleLoginClick = this.handleLoginClick.bind(this)
    }

    handleLoginClick(){
        if(!this.state.email){
            alert("Username should not be empty!")
            return;
        }

        if(!this.state.password){
            alert("Password should not be empty!")
        }

        fetch('http://localhost:8080/login', {
            method:'POST',
            headers:{ 
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Access-Control-Allow-Credentials':  'true',
                'Access-Control-Allow-Origin':'http://localhost:3000/'
            },
            withCredentials: true,
            credentials: 'same-origin',
            body: JSON.stringify({email: this.state.email,password: this.state.password})
        })
        .then(response => response.json())
        .then(data =>{            
            localStorage.setItem("Username", data.email);
            localStorage.setItem("Authorization", data.token);
            localStorage.setItem("Roles", JSON.stringify(data.roles));
            this.setState({status: 'SUCCESS'});
            this.props.history.push("/");
            window.location.reload();
        })
        .catch(error =>{
            this.setState({status: 'FAILED'});
            console.log(error);
        });
    }

    handleInputChange(event){
        this.setState({[event.target.name]:event.target.value})
    }



    render(){
        return(

            <div>
            <Form >
                <FormGroup>
                    <FormLabel>Username</FormLabel>
                    <FormControl type="text" name="email" value={this.state.email} onChange={this.handleInputChange} />
                    <FormLabel>Password</FormLabel>
                    <FormControl type="password" name="password" value={this.state.password} onChange={this.handleInputChange} />
                    <Button block onClick={() => this.handleLoginClick()}>Login</Button>
                </FormGroup>
        <p>{this.state.email}</p>
        <p>{this.state.password}</p>

            </Form>
            </div>
        )
        
    }
}

export default Login;