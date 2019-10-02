import React from 'react';
import {Button, Form, Card, Spinner} from 'react-bootstrap';

class CompanyAdd extends React.Component{
    constructor(props){
        super(props)
        this.state = {companyName: '', companies: [], didGetCompany: false}
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleAddClick = this.handleAddClick.bind(this)
    }

    componentDidMount(){
        fetch('http://localhost:8080/companies', {
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
            this.setState({companies: object, didGetCompany: true})
        })
        .catch(error =>{
            console.log(error);
        });
    }

    handleAddClick(){
        fetch('http://localhost:8080/companies', {
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
            body: JSON.stringify({name: this.state.companyName})
        
        
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
            <Form.Group controlId="companyName">
                <Form.Label>Company Name</Form.Label>
                <Form.Control name="companyName" type="text" placeholder="Company Name" value={this.state.companyName} onChange={this.handleInputChange}/>
            </Form.Group>
            <Button block variant="primary" type="submit" onClick={()=>{this.handleAddClick()}}>
                Add
            </Button>
            <br/>
            {
                this.state.didGetCompany
                ? <h1>Companies</h1>
                : <Spinner animation="border" variant="primary"/>
            }
            {
                
                this.state.companies.map(company => 
                    <Card key={company.id}>
                        <Card.Header>{company.name}</Card.Header>
                        <Card.Body>{company.name} is a perfect company!</Card.Body>
                    </Card>
                )
            }
            </Form>
            
        )
    }
}

export default CompanyAdd;