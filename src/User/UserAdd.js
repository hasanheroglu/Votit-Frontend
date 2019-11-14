import React from 'react';
import {Button, Form, Card, Spinner} from 'react-bootstrap';

class UserAdd extends React.Component{
    constructor(props){
        super(props)
        this.state = {userName: '', userSurname: '', userBirthdate: '', userPhoneNumber: '', userEmail: '', 
                        userPassword: '', userPasswordConfirmation: ''}
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleAddClick = this.handleAddClick.bind(this)
    }

    handleAddClick(){
        const companyName = this.props.match.params.name;

        fetch('http://localhost:8080/companies/' + companyName + '/users', {
            method:'POST',
            headers:{ 
                'Authorization': localStorage.getItem("Authorization"),
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Access-Control-Allow-Credentials':  true,
                'Access-Control-Allow-Origin':'http://localhost:3000/'
            },
            withCredentials: true,
            credentials: 'same-origin',
            body: JSON.stringify({name: this.state.userName,
                                surname: this.state.userSurname,
                                birthDate: this.state.userBirthdate,
                                phoneNumber: this.state.userPhoneNumber,
                                email: this.state.userEmail,
                                password: this.state.userPassword   
                            })
        
        
        })
        .then(response => response.json())
        .then(object =>{
            alert("i am inside")
            console.log(object);
        })
        .catch(error =>{
            console.log(error);
        });
    }

    handleInputChange(event){
        this.setState({[event.target.name]: event.target.value}); 
    }

    render(){
        return(
            <Form>
            <Form.Group controlId="userName">
                <Form.Label>Name</Form.Label>
                <Form.Control name="userName" type="text" placeholder="Name" value={this.state.userName} onChange={this.handleInputChange}/>
            </Form.Group>
            <Form.Group controlId="userSurname">
                <Form.Label>Surname</Form.Label>
                <Form.Control name="userSurname" type="text" placeholder="Surname" value={this.state.userSurname} onChange={this.handleInputChange}/>
            </Form.Group>
            <Form.Group controlId="userBirthdate">
                <Form.Label>Birthdate</Form.Label>
                <Form.Control name="userBirthdate" type="date" value={this.state.userBirthdate} onChange={this.handleInputChange}/>
            </Form.Group>
            <Form.Group controlId="userPhoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control name="userPhoneNumber" type="number" value={this.state.userPhoneNumber} onChange={this.handleInputChange}/>
            </Form.Group>
            <Form.Group controlId="userEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control name="userEmail" type="email" value={this.state.userEmail} onChange={this.handleInputChange}/>
            </Form.Group>
            <Form.Group controlId="userPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control name="userPassword" type="password" value={this.state.userPassword} onChange={this.handleInputChange}/>
            </Form.Group>
            <Form.Group controlId="userPasswordConfirmation">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control name="userPasswordConfirmation" type="password" value={this.state.userPasswordConfirmation} onChange={this.handleInputChange}/>
            </Form.Group>
            <Button block variant="primary" type="submit" onClick={()=>{this.handleAddClick()}}>
                Add
            </Button>
            </Form>
        )
    }
}

export default UserAdd;