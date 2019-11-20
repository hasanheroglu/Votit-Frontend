import React from 'react';
import {Button, Form, Card, Spinner} from 'react-bootstrap';

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

        fetch('http://localhost:8080/users/' + userId, {
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
        .then(object =>{
            this.setState({user: object, title: '', titles: object.titles, roles: object.roles, accessibilityOptions: object.accessibilityOptions, companyName: object.companyName, didGetUser: true})
            console.log(object);
        })
        .catch(error =>{
            console.log(error);
        });

        fetch('http://localhost:8080/companies/' + this.state.companyName, {
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
        .then(object =>{
            console.log(object);
            this.setState({company: object[0], companyTitles: object[0].titles})
        })
        .catch(error =>{
            console.log(error);
        });

        fetch('http://localhost:8080/roles', {
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
        .then(object =>{
            console.log(object);
            this.setState({possibleRoles: object})
        })
        .catch(error =>{
            console.log(error);
        });
    }

    handleInputChange(event){
        this.setState({[event.target.name]: event.target.value}); 
    }

    handleTitleAddClick(){
        fetch('http://localhost:8080/users/' + this.state.user.id + '/titles', {
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
            body: JSON.stringify({title: this.state.title})
        
        
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

    handleTitleRemoveClick(title){
        fetch('http://localhost:8080/users/' + this.state.user.id + '/titles', {
            method:'DELETE',
            headers:{ 
                'Authorization': localStorage.getItem("Authorization"),
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Access-Control-Allow-Credentials':  true,
                'Access-Control-Allow-Origin':'http://localhost:3000/'
            },
            withCredentials: true,
            credentials: 'same-origin',
            body: JSON.stringify({title: title})
        
        
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

    UserInfo(){
        return(
            <Card>
                <Card.Header>Info</Card.Header>
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
                <Card.Header>Titles</Card.Header>
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
                <Card.Header>Roles</Card.Header>
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
                <Card.Header>Accessibility Options</Card.Header>
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
            <div>
                <Card>
                    <Card.Header><b>{this.state.user.name} {this.state.user.surname}</b></Card.Header>
                    <Card.Body>
                        <div inline>
                            <this.UserInfo/>
                            <this.TitleInfo/>
                            <this.RoleInfo/>
                            <this.AccessibilityInfo/>
                        </div>
                    </Card.Body>
                </Card>
                
                
            </div>
        )
    }
}

export default UserGet;