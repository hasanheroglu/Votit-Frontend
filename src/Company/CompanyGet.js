import React from 'react';
import {Button, Form, Card, Spinner, Accordion, Table} from 'react-bootstrap';
import {BrowserRouter, Route, Link, Redirect} from 'react-router-dom';
import Login from '../Login';

class CompanyGet extends React.Component{
    constructor(props){
        super(props)
        this.state = {company: [], users: [], titles: [], polls: [], didGetCompany: false}
        this.handleUserRemoveClick = this.handleUserRemoveClick.bind(this)
        this.CompanyInfo = this.CompanyInfo.bind(this)
        this.CompanyUsers = this.CompanyUsers.bind(this)
        this.CompanyTitles = this.CompanyTitles.bind(this)
        this.CompanyPolls = this.CompanyPolls.bind(this)
    }

    componentDidMount(){
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
        .then(object =>{
            this.setState({company: object, users: object.users, titles: object.titles, polls: object.polls, didGetCompany: true})
        })
        .catch(error =>{
            console.log(error);
        });
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
        .then(object =>{
            alert("User removed!")
        })
        .catch(error =>{
            console.log(error);
        });
    }

    CompanyInfo(){
        return(
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                    Description
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                <Card.Body>{this.state.company.description}</Card.Body>
                </Accordion.Collapse>
            </Card>
        )
    }

    CompanyUsers(){
        return(
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="1">
                    Users
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                    <Card.Body>
                    <Table striped bordered hover>
                            <tr>
                                <th>Person</th>
                                <th>Operations</th>
                            </tr>
                    {
                        this.state.users.map(user=>
                            <tr key={user.id}>
                                <td>{user.name} {user.surname}</td>    
                                <td>
                                <Link to={"/users/" + user.id}><Button variant="info" ><b>Info</b></Button></Link>
                                    <Button variant="danger" onClick={()=>{this.handleUserRemoveClick(user.id)}}><b>X</b></Button>
                                </td>
                            </tr>
                        )
                    }
                    </Table>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        )
    }

    CompanyTitles(){
        return(
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="2">
                    Titles
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="2">
                <Card.Body>
                {
                    this.state.titles.map(title=>
                        <p>
                            {title.title}
                        </p>
                    )
                }
                </Card.Body>
                </Accordion.Collapse>
            </Card>
        )
    }

    CompanyPolls(){
        return(
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="3">
                    Polls
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="3">
                    <Card.Body>
                        {
                            this.state.polls.map(poll=>
                                <Link key={poll.id} to={"/company/" + this.state.company.name + "/polls/" + poll.id}><p>{poll.title}</p></Link>    
                            )
                        }
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        )
    }

    render(){
        let roles = localStorage.getItem("Roles");
        if(!roles){ return <Redirect to={"/login"} component={Login} />}
        var isSystemAdmin = false;
        var isCompanyAdmin = false;
        var isPollOwner = false;
        var isUser = false;

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
                {
                    this.state.didGetCompany
                    ? <h1>{this.state.company.name}</h1>
                    : <Spinner animation="border" variant="primary"/>
                }
                <Accordion defaultActiveKey="0">
                    <this.CompanyInfo/>
                    <this.CompanyUsers/>
                    <this.CompanyTitles/>
                    <this.CompanyPolls/>
                </Accordion>

                <br/>
                <Link to={"/companies/" + this.state.company.name + "/users"}>
                    <Button block>Add User</Button>   
                </Link>
                <br/>
                <Link to={"/companies/" + this.state.company.name + "/titles"}>
                    <Button block>Add Title</Button>
                </Link>
                <br/>
                <Link to={"/companies/" + this.state.company.name + "/polls"}>
                    <Button block>Add Poll</Button>
                </Link>
            </div>
        )
    }
}

export default CompanyGet;