import React from 'react';
import {Button, Form, Card, Spinner, Accordion, Table, Image} from 'react-bootstrap';
import {BrowserRouter, Route, Link, Redirect} from 'react-router-dom';
import Login from '../Login';

class CompanyGet extends React.Component{
    constructor(props){
        super(props)
        this.state = {company: [], users: [], titles: [], polls: [], didGetCompany: false,
                        user: [], didGetUser: false,
                        updatedEstablishmentDate: [], updatedDescription: '', willUpdate: false}
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleUserRemoveClick = this.handleUserRemoveClick.bind(this)
        this.handleTitleRemoveClick = this.handleTitleRemoveClick.bind(this)
        this.handlePollRemoveClick = this.handlePollRemoveClick.bind(this)
        this.handleUpdateClick = this.handleUpdateClick.bind(this)
        this.CompanyInfo = this.CompanyInfo.bind(this)
        this.CompanyInfoUpdate = this.CompanyInfoUpdate.bind(this)
        this.CompanyUsers = this.CompanyUsers.bind(this)
        this.CompanyTitles = this.CompanyTitles.bind(this)
        this.CompanyPolls = this.CompanyPolls.bind(this)
    }

    componentDidMount(){
        let email = localStorage.getItem("Username");
        fetch('http://localhost:8080/users?email=' + email, {
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
            this.setState({user: result.operationObject, didGetUser: true});
            console.log(result);
        })
        .catch(error =>{
            console.log(error);
        });

        const companyName = this.props.match.params.name;

        fetch('http://localhost:8080/companies/' + companyName, {
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
            this.setState({company: result.operationObject, users: result.operationObject.users, 
                            titles: result.operationObject.titles, polls: result.operationObject.polls, didGetCompany: true})
        })
        .catch(error =>{
            console.log(error);
        });
    }

    handleInputChange(event){
        this.setState({[event.target.name]: event.target.value}); 
    }

    handleUserRemoveClick(userId){
        fetch('http://localhost:8080/companies/' + this.state.company.name + '/users/' + userId, {
            method:'DELETE',
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
            console.log(result.operationObject);
        })
        .catch(error =>{
            console.log(error);
        });
    }

    handleTitleRemoveClick(titleId){
        fetch('http://localhost:8080/companies/' + this.state.company.name + '/titles/' + titleId, {
            method:'DELETE',
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
            console.log(result.operationObject);
        })
        .catch(error =>{
            console.log(error);
        });
    }

    handlePollRemoveClick(pollId){

    }

    handleUpdateClick(){
        this.setState({willUpdate: false});

        fetch('http://localhost:8080/companies/' + this.state.company.name, {
            method:'PUT',
            headers:{ 
                'Authorization': localStorage.getItem("Authorization"),
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Access-Control-Allow-Credentials':  true,
                'Access-Control-Allow-Origin':'http://localhost:3000/'
            },
            withCredentials: true,
            credentials: 'same-origin',
            body: JSON.stringify({  description: this.state.updatedDescription,
                                    establishmentDate: this.state.updatedEstablishmentDate
            })        
        })
        .then(response => response.json())
        .then(result =>{
            console.log(result.operationObject);
        })
        .catch(error =>{
            console.log(error);
        });
    }

    CompanyInfo(){
        return(
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                    Info <Button variant="success" className="float-right" onClick={()=>{this.setState({willUpdate: true})}}>Update</Button>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                <Card.Body>
                    <p hidden={this.state.willUpdate}>Establishment Date: {this.state.company.establishmentDate.substring(0,10)}</p>
                    <p hidden={this.state.willUpdate}>Description: {this.state.company.description}</p>
                    <this.CompanyInfoUpdate hidden={!this.state.willUpdate}/>
                </Card.Body>
                </Accordion.Collapse>
            </Card>
        )
    }

    CompanyInfoUpdate(props){
        if(props.hidden){
            return <p></p>;
        }

        return(
            <Form>
                <Form.Group controlId="updatedEstablishmentDate">
                    <Form.Label>Establishment Date</Form.Label>
                    <Form.Control name="updatedEstablishmentDate" type="date" value={this.state.updatedEstablishmentDate} onChange={this.handleInputChange}/>
                </Form.Group>
                <Form.Group controlId="updatedDescription">
                    <Form.Label>Company Description</Form.Label>
                    <Form.Control as="textarea" rows="3" name="updatedDescription"  placeholder={this.state.company.description} value={this.state.updatedDescription} onChange={this.handleInputChange}/>
                </Form.Group>
                <Button block variant="primary" onClick={()=>{this.handleUpdateClick()}}>Update</Button>
            </Form>
        )
    }

    CompanyUsers(props){
        return(
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="1">
                    Users
                    <Link to={"/companies/" + this.state.company.name + "/users"}>
                                <Button hidden={props.hidden} variant="success" className="float-right"><b>+</b></Button>   
                    </Link>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                    <Card.Body>
                    <Table>
                        <thead>
                            <tr>
                                <th>Person</th>
                                <th>Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                    {
                        this.state.users.map(user=>
                            <tr key={user.id}>
                                <td>{user.name} {user.surname}</td>    
                                <td>
                                <Link to={"/users/" + user.id}><Button variant="info" ><b>Info</b></Button></Link>
                                    <Button hidden={props.hidden} variant="danger" onClick={()=>{this.handleUserRemoveClick(user.id)}}><b>-</b></Button>
                                </td>
                            </tr>
                        )
                    }
                        </tbody>
                    </Table>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        )
    }

    CompanyTitles(props){
        return(
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="2">
                    Titles
                    <Link to={"/companies/" + this.state.company.name + "/titles"}>
                        <Button hidden={props.hidden} variant="success" className="float-right"><b>+</b></Button>
                    </Link>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="2">
                <Card.Body>
                    <Table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Operation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.titles.map(title=>
                                    <tr key={title.id}> 
                                        <td>{title.title}</td>
                                        <td><Button block variant="danger" onClick={()=>{this.handleTitleRemoveClick(title.id)}}>-</Button></td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                {
                    
                }
                </Card.Body>
                </Accordion.Collapse>
            </Card>
        )
    }

    CompanyPolls(props){
        return(
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="3">
                    Polls
                    <Link to={"/companies/" + this.state.company.name + "/polls"}>
                        <Button hidden={props.hidden} variant="success" className="float-right"><b>+</b></Button>
                    </Link>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="3">
                <Table>
                    <thead>
                        <tr>
                            <th>Poll Title</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Owner ID</th>
                            <th>Operation</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                    {
                        this.state.polls.map(poll =>
                            
                            <tr key={poll.id}>
                                <td>{poll.title}</td>
                                <td>{poll.startDate.substring(0,10)}</td>
                                <td>{poll.endDate.substring(0,10)}</td>
                                <td>{poll.ownerId}</td>
                                <td>
                                <Link to={"/companies/" + this.props.match.params.name + "/polls/" + poll.id} key={poll.id}>
                                    <Button block variant="success">Vote</Button>
                                </Link>
                                </td>
                            </tr>
                        )
                    }
                    </tbody>
                </Table>
                </Accordion.Collapse>
            </Card>
        )
    }

    render(){
        let roles = localStorage.getItem("Roles");
        if(!roles){ return <Redirect to={"/login"} component={Login} />}
        var isCompanyAdmin = false;
        var isPollOwner = false;
        var isSystemAdmin = false;

        if(roles){
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
            if(roles.includes("ROLE_SYSTEM_ADMIN")){
                isSystemAdmin = true;
              } else{
                isSystemAdmin = false;
              } 
        }

        if(!this.state.didGetUser || !this.state.didGetCompany){
            return(
                <div style={{width:50, margin:0, margin:"auto"}}><Spinner animation="grow" variant="white"><Image src={require('../votit_logo_small.png')} rounded fluid /></Spinner></div>
            )
        } else{
            if(this.state.company.name.localeCompare(this.state.user.companyName) !== 0 && !isSystemAdmin){
                this.props.history.push("/");
                window.location.reload();
            }
        }
        
        return(
            <div style={{width:500, margin:0, margin:"auto"}}>
                <Image src={require('../logo1.jpeg')} rounded fluid />
                {
                    this.state.didGetCompany
                    ?   <div>
                            <h1>{this.state.company.name}</h1>
                            <Accordion defaultActiveKey="0">
                                <this.CompanyInfo/>
                                <this.CompanyUsers hidden={!isCompanyAdmin}/>
                                <this.CompanyTitles hidden={!isCompanyAdmin}/>
                                <this.CompanyPolls hidden={!isPollOwner}/>
                            </Accordion>
                        </div>
                    : <div style={{width:50, margin:0, margin:"auto"}}><Spinner animation="grow" variant="white"><Image src={require('../votit_logo_small.png')} rounded fluid /></Spinner></div>
                }
            </div>
        )
    }
}

export default CompanyGet;