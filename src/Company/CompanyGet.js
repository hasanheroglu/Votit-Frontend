import React from 'react';
import {Button, Form, Card, Spinner, Accordion, Table} from 'react-bootstrap';
import {Link} from 'react-router-dom';

class CompanyGet extends React.Component{
    constructor(props){
        super(props)
        this.state = {company: [], users: [], titles: [], didGetCompany: false}
        this.handleUserRemoveClick = this.handleUserRemoveClick.bind(this)
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
            this.setState({company: object, users: object.users, titles: object.titles, didGetCompany: true})
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

    render(){
        return(
            <div>
                {
                    this.state.didGetCompany
                    ? <h1>{this.state.company.name}</h1>
                    : <Spinner animation="border" variant="primary"/>
                }
                <Accordion defaultActiveKey="0">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                            Description
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>{this.state.company.description}</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="1">
                            Users
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>
                                <Table striped bordered hover>
                                    <tr>
                                        <th>Name</th>
                                        <th>Surname</th>
                                        <th>Email</th>
                                        <th>Phone Number</th>
                                        <th>Operations</th>
                                    </tr>
                                    {
                                        this.state.users.map(user=>
                                            <tr key={user.id}>
                                                <Link to={"/users/" + user.id}>
                                                    <td>{user.name}</td>
                                                </Link>
                                                <td>{user.surname}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phoneNumber}</td>
                                                <td><Button variant="danger" onClick={()=>{this.handleUserRemoveClick(user.id)}}><b>X</b></Button></td>
                                            </tr>
                                        )
                                    }
                                </Table>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
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
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="3">
                            Polls
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="3">
                            <Card.Body>{this.state.company.description}</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                <Link to={"/companies/" + this.state.company.name + "/users"}>
                    <Button block>Add User</Button>   
                </Link>
                <Link to={"/companies/" + this.state.company.name + "/titles"}>
                    <Button block>Add Title</Button>
                </Link>
                <Link to={"/companies/" + this.state.company.name + "/polls"}>
                    <Button block>Add Poll</Button>
                </Link>
            </div>
        )
    }
}

export default CompanyGet;