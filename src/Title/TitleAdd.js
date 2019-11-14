import React from 'react';
import {Button, Form, Card, Spinner} from 'react-bootstrap';
import {Link} from 'react-router-dom';

class TitleAdd extends React.Component{
    constructor(props){
        super(props)
        this.state = {title: ''}
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleAddClick = this.handleAddClick.bind(this);
    }

    handleAddClick(){
        const companyName = this.props.match.params.name;

        fetch('http://localhost:8080/companies/' + companyName + '/titles', {
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

    handleInputChange(event){
        this.setState({[event.target.name]: event.target.value}); 
    }

    render(){
        return(
            <Form>
                <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control name="title" type="text" placeholder="Title" value={this.state.title} onChange={this.handleInputChange}/>
                </Form.Group>
                <Button block variant="primary" type="submit" onClick={()=>{this.handleAddClick()}}>
                    Add
                </Button>
            </Form>
        )
    }
}

export default TitleAdd;