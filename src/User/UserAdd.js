import React from 'react';
import {Button, Form, Image} from 'react-bootstrap';
import * as utils from '../Util';

class UserAdd extends React.Component{
    constructor(props){
        super(props)
        this.state = {userName: '', userSurname: '', userBirthdate: '', userPhoneNumber: '', userEmail: '', 
                        userPassword: '', userPasswordConfirmation: '', 
                        role: '', title: '',
                        selectedRoles: [], availableRoles: [], 
                        selectedTitles: [], availableTitles: [],                        
                        updated: false
                    }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleAddClick = this.handleAddClick.bind(this)
        this.UserForm = this.UserForm.bind(this)
        this.StandardInfo = this.StandardInfo.bind(this)
        this.RoleMenu = this.RoleMenu.bind(this)
        this.TitleMenu = this.TitleMenu.bind(this)
        this.handleAddRoleClick = this.handleAddRoleClick.bind(this)
        this.handleRemoveRoleClick = this.handleRemoveRoleClick.bind(this)
        this.handleAddTitleClick = this.handleAddTitleClick.bind(this)
        this.handleRemoveTitleClick = this.handleRemoveTitleClick.bind(this)
        this.handleCheckboxInput = this.handleCheckboxInput.bind(this)
    }

    componentDidMount(){
        const companyName = this.props.match.params.name;

        fetch(utils.hostURL + '/companies/' + companyName + '/titles', {
            method:'GET',
            headers: utils.headers,
            withCredentials: true,
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(result =>{
            if(result.wasSuccessful)
                this.setState({availableTitles: result.operationObject});
            console.log(result);
        })
        .catch(error =>{
            console.log(error);
        });

        fetch(utils.hostURL + '/roles', {
            method:'GET',
            headers: utils.headers,
            withCredentials: true,
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(result =>{
            this.setState({availableRoles: result.operationObject});
            console.log(result);
        })
        .catch(error =>{
            console.log(error);
        });
    }

    handleAddClick(){
        const companyName = this.props.match.params.name;

        fetch(utils.hostURL + '/companies/' + companyName + '/users', {
            method:'POST',
            headers: utils.headers,
            withCredentials: true,
            credentials: 'same-origin',
            body: JSON.stringify({name: this.state.userName,
                                surname: this.state.userSurname,
                                birthDate: this.state.userBirthdate,
                                phoneNumber: this.state.userPhoneNumber,
                                email: this.state.userEmail,
                                password: this.state.userPassword,
                                roles: this.state.selectedRoles,
                                titles: this.state.selectedTitles
                            })
        
        
        })
        .then(response => response.json())
        .then(result =>{
            console.log(result);
            alert("User Added!");
        })
        .catch(error =>{
            console.log(error);
            alert("Cannot add user!");
        });
    }

    handleAddRoleClick(selectedRole){
        let roleIndex = this.state.availableRoles.findIndex(x => x.id === JSON.parse(selectedRole).id);

        if(roleIndex == -1) {return;}

        this.state.availableRoles.splice(roleIndex, 1);
        this.state.selectedRoles.push(JSON.parse(selectedRole));
        this.setState({update: true, role: ''});
    }

    handleRemoveRoleClick(removedRole){
        let roleIndex = this.state.selectedRoles.indexOf(removedRole);

        if(roleIndex == -1) {return;}

        this.state.selectedRoles.splice(roleIndex, 1);
        this.state.availableRoles.push(removedRole);
        this.setState({update: true, role: ''});
    }

    handleAddTitleClick(selectedTitle){
        let titleIndex = this.state.availableTitles.findIndex(x => x.id === JSON.parse(selectedTitle).id);

        if(titleIndex == -1) {return;}

        this.state.availableTitles.splice(titleIndex, 1);
        this.state.selectedTitles.push(JSON.parse(selectedTitle));
        this.setState({update: true, title: ''});
    }

    handleRemoveTitleClick(removedTitle){
        let titleIndex = this.state.selectedTitles.indexOf(removedTitle);

        if(titleIndex == -1) {return;}

        this.state.selectedTitles.splice(titleIndex, 1);
        this.state.availableTitles.push(removedTitle);
        this.setState({update: true, title: ''});
    }

    handleInputChange(event){
        this.setState({[event.target.name]: event.target.value}); 
    }

    handleCheckboxInput(event){
        this.setState({[event.target.name]: event.target.checked}); 
    }

    UserForm(){
        return(
            <Form>
                <this.StandardInfo/>
                <this.RoleMenu/>
                <this.TitleMenu/>
                <Button block variant="primary" type="submit" onClick={()=>{this.handleAddClick()}}>
                    Add
                </Button>
            </Form>
        )
    }

    StandardInfo(){
        return(
            <div>
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
            </div>
        )
    }

    RoleMenu(){
        return(
            <div>
                <p><b>Roles</b></p>
                <Form.Group controlId="role">
                        <Form.Label>Role</Form.Label>
                        <Form.Control as="select" name="role" onChange={this.handleInputChange}>
                            <option value="" selected>Select the role</option>                        
                            {
                                this.state.availableRoles.map(role =>
                                    <option key={role.id} value={JSON.stringify(role)}>{role.role}</option>
                                )
                            }   
                        </Form.Control>
                        <br/>
                        <Button block variant="primary" onClick={()=> {this.handleAddRoleClick(this.state.role)}}>Add role</Button>
                </Form.Group>

                <div inline>
                    {
                        this.state.selectedRoles.map(role =>
    <Button variant="danger" key={role.id} onClick={() => {this.handleRemoveRoleClick(role)}}>{role.role}</Button>
                        )
                    }
                </div>
                <br/>
            </div>
        )
    }

    TitleMenu(){
        return(
            <div>
                <p><b>Titles</b></p>
                <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control as="select" name="title" onChange={this.handleInputChange}>
                            <option value="" selected>Select the title</option>                        
                            {
                                this.state.availableTitles.map(title =>
                                    <option key={title.id} value={JSON.stringify(title)}>{title.title}</option>
                                )
                            }   
                        </Form.Control>
                        <br/>
                        <Button block variant="primary" onClick={()=> {this.handleAddTitleClick(this.state.title)}}>Add title</Button>
                </Form.Group>

                <div inline>
                    {
                        this.state.selectedTitles.map(title =>
    <Button variant="danger" key={title.id} onClick={() => {this.handleRemoveTitleClick(title)}}>{title.title}</Button>
                        )
                    }
                </div>
                <br/>
            </div>
        )
    }

    render(){
        return(
            <div style={{width: 500, margin:0, margin:"auto"}}>
                <Image src={require('../logo1.jpeg')} rounded fluid />
                <this.UserForm/>
            </div>
        )
    }
}

export default UserAdd;