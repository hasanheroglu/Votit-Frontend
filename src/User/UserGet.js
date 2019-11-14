import React from 'react';
import {Button, Form, Card, Spinner} from 'react-bootstrap';

class UserGet extends React.Component{
    constructor(props){
        super(props)
        this.state={user: [], titles: [], title: '', companyName: '', company: [],  companyTitles: [], didGetUser: false}
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleTitleAddClick = this.handleTitleAddClick.bind(this)
        this.handleTitleRemoveClick = this.handleTitleRemoveClick.bind(this)
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
            this.setState({user: object, title: '', titles: object.titles, companyName: object.companyName, didGetUser: true})
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


    render(){
        return(
            <div>
                {this.state.user.id} {this.state.user.name} {this.state.user.surname} <br/>
                <select name="title" onChange={this.handleInputChange}>
                    {
                        this.state.companyTitles.map(title=>
                            <option key={title.id} name="title" value={title.title}>{title.title}</option>
                        )
                    }
                </select>
                <Button onClick={()=>this.handleTitleAddClick()}>Add Title</Button>
                <p>Titles</p>
                {
                    this.state.titles.map(title=>
                        <p key={title.id}>{title.title} <Button variant="danger" onClick={()=>{this.handleTitleRemoveClick(title.title)}}><b>X</b></Button></p>
                    )
                }
            </div>
        )
    }
}

export default UserGet;