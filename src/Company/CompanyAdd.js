import React from 'react';
import {Button, Form, Card, Alert, Spinner, Table, Nav, Image} from 'react-bootstrap';
import {BrowserRouter, Route, Link, Redirect} from 'react-router-dom';
import Login from '../Login';
import * as utils from '../Util';

class CompanyAdd extends React.Component{
    constructor(props){
        super(props)
        this.state = {companyName: '', companyDescription: '',  establishmentDate: '', companies: [], 
                        addAttempt: false,
                        didGetCompany: false,
                        didUpdate: false
                    }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleAddClick = this.handleAddClick.bind(this)
        this.CompanyForm = this.CompanyForm.bind(this)
        this.CompanyTable = this.CompanyTable.bind(this)
    }

    componentDidMount(){
        fetch(utils.hostURL + '/companies', {
            method:'GET',
            headers: utils.headers,
            withCredentials: true,
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(result =>{
            this.setState({companies: result.operationObject, didGetCompany: true})
        })
        .catch(error =>{
            console.log(error);
        });
    }

    componentDidUpdate(){
        if(this.state.didUpdate){
            return;
        }

        fetch(utils.hostURL + '/companies', {
            method:'GET',
            headers:utils.headers,
            withCredentials: true,
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(result =>{
            this.setState({companies: result.operationObject, didGetCompany: true, didUpdate: true})
        })
        .catch(error =>{
            console.log(error);
        });
    }

    handleAddClick(){
        if(!this.state.companyName || !this.state.establishmentDate){
            this.setState({addAttempt: true});
            return;
        }

        fetch(utils.hostURL + '/companies', {
            method:'POST',
            headers: utils.headers,
            withCredentials: true,
            credentials: 'same-origin',
            body: JSON.stringify({name: this.state.companyName, 
                                    description: this.state.companyDescription,
                                    establishmentDate: this.state.establishmentDate})
        
        
        })
        .then(response => response.json())
        .then(result =>{
            console.log(result.operationObject);
            this.setState({didUpdate: false});
        })
        .catch(error =>{
            console.log(error);
        });
    }

    handleRemoveClick(companyName){
        //ask for validation!!!

        fetch(utils.hostURL + '/companies/' + companyName, {
            method:'DELETE',
            headers: utils.headers,
            withCredentials: true,
            credentials: 'same-origin'       
        })
        .then(response => response.json())
        .then(result =>{
            console.log(result.operationObject);
            this.setState({didUpdate: false});
        })
        .catch(error =>{
            console.log(error);
        });
    }

    handleInputChange(event){
        this.setState({[event.target.name]: event.target.value}); 
    }

    CompanyForm(){
        return(
            <div>
                <Form>
                <Form.Group controlId="companyName">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control name="companyName" type="text" placeholder="Company Name" value={this.state.companyName} onChange={this.handleInputChange}/>
                    <Alert hidden={this.state.companyName || !this.state.addAttempt} variant="danger">Company name cannot be empty!</Alert>
                </Form.Group>
                <Form.Group controlId="establishmentDate">
                    <Form.Label>Establishment Date</Form.Label>
                    <Form.Control name="establishmentDate" type="date" value={this.state.establishmentDate} onChange={this.handleInputChange}/>
                    <Alert hidden={this.state.establishmentDate || !this.state.addAttempt} variant="danger">Establishment date cannot be empty!</Alert>
                </Form.Group>
                <Form.Group controlId="companyDescription">
                    <Form.Label>Company Description</Form.Label>
                    <Form.Control as="textarea" rows="3" name="companyDescription"  placeholder="Company Description" value={this.state.companyDescription} onChange={this.handleInputChange}/>
                </Form.Group>
                <Button block variant="primary" onClick={()=>{this.handleAddClick()}}>
                    Add
                </Button>
                </Form>
            </div>
        )
    }

    CompanyTable(){
        return(
            <div>
                <h1>Companies</h1>
                <Table>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Operations</th>
                    </tr>
                    {    
                        this.state.companies.map(company => 
                            <tr key={company.id}>
                                <td>{company.id}</td>
                                <td>
                                    <Link to={"/companies/" + company.name}>
                                        {company.name}
                                    </Link>    
                                </td>
                                <td><Button block variant="danger" onClick={()=>{this.handleRemoveClick(company.name)}}>-</Button></td>
                            </tr>
                        )
                    }
                </Table>   
            </div>
        )
    }

    render(){
        if(!localStorage.getItem("Roles")){ return <Redirect to={"/login"} component={Login} />}

        return(
            <div style={{width: 500, margin:0, margin:"auto"}}>
                <Image src={require('../logo1.jpeg')} rounded fluid />
                <this.CompanyForm/>
                <br/>
                {
                    this.state.didGetCompany
                    ? <this.CompanyTable/>
                    : <div style={{width:50, margin:0, margin:"auto"}}><Spinner animation="grow" variant="white"><Image src={require('../votit_logo_small.png')} rounded fluid /></Spinner></div>
                }
            </div>         
        )
    }
}

export default CompanyAdd;