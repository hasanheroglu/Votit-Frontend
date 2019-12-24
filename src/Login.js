import React from 'react';
import { Form,FormGroup, FormLabel, FormControl, Button, Image, Alert } from 'react-bootstrap';
import * as utils from './Util';
import {votit} from './logo1.jpeg';

class Login extends React.Component{
    constructor(props){
        super(props)
        this.state = {email: '', password: '', status: 'WAITING', loginAttempt: false}
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleLoginClick = this.handleLoginClick.bind(this)
    }

    handleLoginClick(){
        this.setState({loginAttempt: true});

        if(!this.state.email){
            return;
        }

        if(!this.state.password){
            return;
        }

        fetch(utils.hostURL + '/login', {
            method:'POST',
            headers: utils.headers,
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

            <div style={{width: 500, margin: 0, margin: "auto"}}>
            <Image src={require('./logo1.jpeg')} rounded fluid />
            <Form >
                <FormGroup>
                    <FormLabel>Email</FormLabel>
                    <FormControl type="text" name="email" value={this.state.email} onChange={this.handleInputChange} />
                    <Alert variant="danger" hidden={this.state.email || !this.state.loginAttempt} >Email must be filled!</Alert>
                    <FormLabel>Password</FormLabel>
                    <FormControl type="password" name="password" value={this.state.password} onChange={this.handleInputChange} />
                    <Alert variant="danger" hidden={this.state.password || !this.state.loginAttempt} >Password must be filled!</Alert>
                    <Alert variant="danger" hidden={this.state.status !== "FAILED" && !this.state.loginAttempt} >Wrong email or password!</Alert>
                    <br/>
                    <Button block onClick={() => this.handleLoginClick()}>Login</Button>
                </FormGroup>
            </Form>
            </div>
        )
        
    }
}

export default Login;