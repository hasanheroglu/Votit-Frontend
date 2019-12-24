import React from 'react';
import {Button, Table, Card, Spinner, Image, Form} from 'react-bootstrap';
import * as utils from '../Util';

class UserGet extends React.Component{
    constructor(props){
        super(props)
        this.state={user: [], titles: [], roles: [], accessibilityOptions: [], title: [], role: "sa", companyName: '', company: [],  
                    companyTitles: [], possibleRoles: [], didGetUser: false, didGetCompany: false,
                    didUpdate: false}
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleTitleAddClick = this.handleTitleAddClick.bind(this)
        this.handleTitleRemoveClick = this.handleTitleRemoveClick.bind(this)
        this.handleRoleAddClick = this.handleRoleAddClick.bind(this)
        this.handleRoleRemoveClick = this.handleRoleRemoveClick.bind(this)
        this.getCompany = this.getCompany.bind(this)
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

    componentDidUpdate(){
        if(this.state.didUpdate){
            return;
        } 

        const userId = this.props.match.params.id;

        fetch(utils.hostURL + '/users/' + userId, {
            method:'GET',
            headers: utils.headers,
            withCredentials: true,
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(result =>{
            this.setState({titles: result.operationObject.titles, roles: result.operationObject.roles, didUpdate: true})
            console.log(result);
        })
        .catch(error =>{
            console.log(error);
        });
    }

    getCompany(){
        fetch(utils.hostURL + '/companies/' + this.state.companyName, {
            method:'GET',
            headers: utils.headers,
            withCredentials: true,
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(result =>{
            console.log(result);
            this.setState({company: result.operationObject, companyTitles: result.operationObject.titles, didGetCompany: true})
        })
        .catch(error =>{
            console.log(error);
        });
    }

    handleInputChange(event){
        this.setState({[event.target.name]: event.target.value}); 
    }

    handleTitleAddClick(){
        fetch(utils.hostURL + '/users/' + this.state.user.id + '/titles?titleId=' + JSON.parse(this.state.title).id, {
            method:'POST',
            headers: utils.headers,
            withCredentials: true,
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(result =>{
            this.setState({didUpdate: false});
            console.log(result);
        })
        .catch(error =>{
            console.log(error);
        });
    }

    handleTitleRemoveClick(title){
        fetch(utils.hostURL + '/users/' + this.state.user.id + '/titles/' + title.id, {
            method:'DELETE',
            headers: utils.headers,
            withCredentials: true,
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(result =>{
            this.setState({didUpdate: false});
            console.log(result);
        })
        .catch(error =>{
            console.log(error);
        });
    }

    handleRoleAddClick(role){
        fetch(utils.hostURL + '/users/' + this.state.user.id + '/roles?role=' + role, {
            method:'POST',
            headers: utils.headers,
            withCredentials: true,
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(result =>{
            this.setState({didUpdate: false});
            console.log(result);
        })
        .catch(error =>{
            console.log(error);
        });
    }

    handleRoleRemoveClick(role){
        fetch(utils.hostURL + '/users/' + this.state.user.id + '/roles?role=' + role, {
            method:'DELETE',
            headers: utils.headers,
            withCredentials: true,
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(result =>{
            this.setState({didUpdate: false});
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

    TitleInfo(props){
        if(props.hidden){
            return(
                <Card>
                    <Card.Header><b>Titles</b></Card.Header>
                    <Card.Body>
                        <p>Company has no titles.</p>
                    </Card.Body>
                </Card>
            ) 
        }

        return(
            <Card>
                <Card.Header><b>Titles</b></Card.Header>
                <Card.Body>
                <div hidden={!utils.isCompanyAdmin}>
                <Form.Control as="select" name="title" onChange={this.handleInputChange}>
                    <option value="" disabled selected>Select title</option>
                    { 
                        this.state.companyTitles.map(title=>
                            <option key={title.id} value={JSON.stringify(title)}>{title.title}</option>
                        ) 
                    }
                </Form.Control>
                <br/>
                <Button block onClick={()=>this.handleTitleAddClick(this.state.title)}>Add Title</Button>
                </div>
                <p>Titles</p>
                <Table>
                    <tr>
                        <th>Title</th>
                        <th>Operation</th>
                    </tr>
                    {
                        this.state.titles.map(title=>
                            <tr key={title.id}>
                                <td>{title.title}</td>
                                <td><Button hidden={!utils.isCompanyAdmin} block variant="danger" onClick={()=>{this.handleTitleRemoveClick(title)}}>-</Button></td>
                            </tr>
                        )
                    }
                </Table>
                
                </Card.Body>
            </Card>            
        )
    }

    RoleInfo(){
        return(
            <Card>
                <Card.Header><b>Roles</b></Card.Header>
                <Card.Body>
                <div hidden={!utils.isCompanyAdmin}>
                <Form.Control as="select" name="role" onChange={this.handleInputChange}>
                    <option value="" selected disabled>Select the role</option>
                    {
                        this.state.possibleRoles.map(role=>
                        <option key={role.id} hidden={(!utils.isSystemAdmin && role.role === "ROLE_SYSTEM_ADMIN") || role.role === "ROLE_USER"} value={role.role}>{role.role}</option>
                        )
                    }
                </Form.Control>
                <br/>
                <Button block onClick={()=>this.handleRoleAddClick(this.state.role)}>Add Role</Button>
                </div>
                <p>Roles</p>
                <Table>
                    <tr>
                        <th>Role</th>
                        <th>Operation</th>
                    </tr>
                    {
                        this.state.roles.map(role=>
                            <tr key={role.id} hidden={role.role === "ROLE_USER"}>
                                <td>{role.role}</td>
                                <td><Button hidden={!utils.isCompanyAdmin && !utils.isSystemAdmin} onClick={()=>this.handleRoleRemoveClick(role.role)} block variant="danger">-</Button></td>
                            </tr>
                        )
                    }
                </Table>
                
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
        if(!this.state.companyName){
            return <div style={{width:50, margin:0, margin:"auto"}}><Spinner animation="grow" variant="white"><Image src={require('../votit_logo_small.png')} rounded fluid /></Spinner></div>;
        } else if(!this.state.didGetCompany){
            this.getCompany();
        }
        return(
            <div style={{width:500, margin:0, margin:"auto"}}>
                <Image src={require('../logo1.jpeg')} rounded fluid />
                {
                    this.state.didGetUser && this.state.didGetCompany
                    ?   <div>
                            <p><b>{this.state.user.name} {this.state.user.surname}</b></p>
                            <this.UserInfo/>
                            <this.TitleInfo hidden={!this.state.companyTitles}/>
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