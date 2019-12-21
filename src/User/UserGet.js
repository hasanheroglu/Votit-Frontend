import React from 'react';
import {Button, Form, Card, Spinner, Image} from 'react-bootstrap';
import * as utils from '../Util';

class UserGet extends React.Component{
    constructor(props){
        super(props)
        this.state={user: [], titles: [], roles: [], accessibilityOptions: [], title: '', companyName: '', company: [],  companyTitles: [], possibleRoles: [], didGetUser: false}
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleTitleAddClick = this.handleTitleAddClick.bind(this)
        this.handleTitleRemoveClick = this.handleTitleRemoveClick.bind(this)
        this.UserInfo = this.UserInfo.bind(this)
        this.TitleInfo = this.TitleInfo.bind(this)
        this.RoleInfo = this.RoleInfo.bind(this)
        this.AccessibilityInfo = this.AccessibilityInfo.bind(this)
    }

    componentDidMount(){ 
        const userId = this.props.match.params.id;

        fetch(utils.hostURL + '/users/' + userId, {
            method:'GET',
            headers: utils.headers,
            withCredentials: true,
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(result =>{
            this.setState({user: result.operationObject, title: '', titles: result.operationObject.titles, 
                            roles: result.operationObject.roles, accessibilityOptions: result.operationObject.accessibilityOptions, 
                            companyName: result.operationObject.companyName, didGetUser: true})
            console.log(result);
        })
        .catch(error =>{
            console.log(error);
        });

        fetch(utils.hostURL + '/companies/' + this.state.companyName, {
            method:'GET',
            headers: utils.headers,
            withCredentials: true,
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(result =>{
            console.log(result);
            this.setState({company: result.operationObject, companyTitles: result.operationObject.titles})
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
            console.log(result);
            this.setState({possibleRoles: result.operationObject})
        })
        .catch(error =>{
            console.log(error);
        });
    }

    handleInputChange(event){
        this.setState({[event.target.name]: event.target.value}); 
    }

    handleTitleAddClick(){
        fetch(utils.hostURL + '/users/' + this.state.user.id + '/titles', {
            method:'POST',
            headers: utils.headers,
            withCredentials: true,
            credentials: 'same-origin',
            body: JSON.stringify({title: this.state.title})
        
        
        })
        .then(response => response.json())
        .then(result =>{
            console.log(result);
        })
        .catch(error =>{
            console.log(error);
        });
    }

    handleTitleRemoveClick(title){
        fetch(utils.hostURL + '/users/' + this.state.user.id + '/titles', {
            method:'DELETE',
            headers: utils.headers,
            withCredentials: true,
            credentials: 'same-origin',
            body: JSON.stringify({title: title})
        
        
        })
        .then(response => response.json())
        .then(result =>{
            console.log(result);
        })
        .catch(error =>{
            console.log(error);
        });
    }

    UserInfo(){
        return(
            <Card>
                <Card.Header><b>Info</b></Card.Header>
                <Card.Body>
                    <p>Company: {this.state.user.companyName}</p>
                    <p>Email: {this.state.user.email}</p>
                    <p>Phone Number: {this.state.user.phoneNumber}</p>
               </Card.Body>
            </Card>
        )
    }

    TitleInfo(){
        return(
            <Card>
                <Card.Header><b>Titles</b></Card.Header>
                <Card.Body>
                <select name="title" onChange={this.handleInputChange}>
                    {
                        this.state.companyTitles.map(title=>
                        <option key={title.id} name="title" value={title.title}>{title.title}</option>
                        )
                    }
                </select>
                <br/>
                <br/>
                <Button block onClick={()=>this.handleTitleAddClick()}>Add Title</Button>
                <p>Titles</p>
                {
                    this.state.titles.map(title=>
                    <p key={title.id}><Button block variant="danger" onClick={()=>{this.handleTitleRemoveClick(title.title)}}>{title.title}</Button></p>
                    )
                }
                </Card.Body>
            </Card>            
        )
    }

    RoleInfo(){
        return(
            <Card>
                <Card.Header><b>Roles</b></Card.Header>
                <Card.Body>
                <select name="role" onChange={this.handleInputChange}>
                    {
                        this.state.possibleRoles.map(role=>
                        <option key={role.id} name="role" value={role.role}>{role.role}</option>
                        )
                    }
                </select>
                <p>Roles</p>
                {
                    
                    this.state.roles.map(role=>
                    <p key={role.id}><Button block variant="danger">{role.role}</Button></p>
                    )
                }
                </Card.Body>
            </Card>
        )
    }
    
    AccessibilityInfo(){
        return(
            <Card>
                <Card.Header><b>Accessibility Options</b></Card.Header>
                <Card.Body>
                {
                    this.state.accessibilityOptions.map(accessibilityOption =>
                        <div key={accessibilityOption.id}>
                            <p><b>Accessibility Type: {accessibilityOption.type}</b></p>
                            <p>{accessibilityOption.content}</p>    
                        </div>
                    )
                }
                </Card.Body>
            </Card>
        )
    }
    
    render(){
        return(
            <div style={{width:500, margin:0, margin:"auto"}}>
                <Image src={require('../logo1.jpeg')} rounded fluid />
                {
                    this.state.didGetUser
                    ?   <div>
                            <p><b>{this.state.user.name} {this.state.user.surname}</b></p>
                            <this.UserInfo/>
                            <this.TitleInfo/>
                            <this.RoleInfo/>
                            <this.AccessibilityInfo/>
                        </div>
                    : <div style={{width:50, margin:0, margin:"auto"}}><Spinner animation="grow" variant="white"><Image src={require('../votit_logo_small.png')} rounded fluid /></Spinner></div>
                }
            </div>
        )
    }
}

export default UserGet;