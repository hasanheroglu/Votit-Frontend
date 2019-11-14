import React from 'react';
import {Button, Form, Card, Spinner, Table, Dropdown, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {Link} from 'react-router-dom';

class PollAdd extends React.Component{
    constructor(props){
        super(props)
        this.state = { title: '', option: '', pollType: '', polls: [], options: [], voters: [], voterIdList: [],users: [], maxSelectionCount: 1, update: false}
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleAddClick = this.handleAddClick.bind(this)
        this.handleOptionAddClick = this.handleOptionAddClick.bind(this)
        this.handleOptionRemoveClick = this.handleOptionRemoveClick.bind(this)
        this.handleVoterAddClick = this.handleVoterAddClick.bind(this)
        this.Poll = this.Poll.bind(this)
    }

    x = () => {
        let selectionCounts = [];

        for (let index = 1; index <= this.state.options.length; index++) {
            selectionCounts.push(<option value={index}>{index}</option>);
        }

        return selectionCounts;
    }    

    componentDidMount(){
        const companyName = this.props.match.params.name;

        fetch('http://localhost:8080/companies/' + companyName + '/polls', {
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
            this.setState({polls: object})
            console.log(object)
        })
        .catch(error =>{
            console.log(error);
        });

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
            this.setState({users: object.users})
            console.log(object)
        })
        .catch(error =>{
            console.log(error);
        });
    }

    handleInputChange(event){
        this.setState({[event.target.name]: event.target.value}); 
    }

    handleAddClick(){
        const companyName = this.props.match.params.name;

        for (let index = 0; index < this.state.voters.length; index++) {
            var voterId = this.state.voters[index].id;
            this.state.voterIdList.push(voterId);
        }

        fetch('http://localhost:8080/companies/' + companyName + '/polls', {
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
            body: JSON.stringify({title: this.state.title,
                                  type: this.state.pollType,
                                  options: this.state.options,
                                  voterIdList: this.state.voterIdList,
                                  maxSelectionCount: this.state.maxSelectionCount
                                })
        
        
        })
        .then(response => response.json())
        .then(object =>{
            console.log(object);
            alert("i am inside")
        })
        .catch(error =>{
            console.log(error);
        });
    }

    handleOptionAddClick(){
        this.state.options.push(this.state.option);
        this.setState({update: true});
    }

    handleOptionRemoveClick(option){
        var optionIndex = this.state.options.indexOf(option);
        this.state.options.splice(optionIndex, 1);
        this.setState({update: true});
    }

    handleVoterAddClick(voter){
        this.state.voters.push(voter);
        var userIndex = this.state.users.indexOf(voter);
        this.state.users.splice(userIndex, 1);
        this.setState({update: true});
    }

    handleVoterRemoveClick(user){
        this.state.users.push(user);
        var voterIndex = this.state.voters.indexOf(user);
        this.state.voters.splice(voterIndex, 1);
        this.setState({update: true});
    }

    Poll() {
        return(
            <Form>
                <Form.Group controlId="pollImage">
                    <Form.Label>Poll Image</Form.Label>
                    <Form.Control type="file" name="pollImage" onChange={this.handleInputChange} />
                </Form.Group>
                <Form.Group controlId="pollType">
                    <Form.Label>Poll Type</Form.Label>
                    <Form.Control as="select" name="pollType" onChange={this.handleInputChange}>
                        <option value="" disabled selected>Select your poll type</option>                        
                        <option value="standard">Standard</option>
                        <option value="prioritized">Prioritized</option>
                        <option value="multiple_choice">Multiple Choice</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="title">
                    <Form.Label>Poll Title</Form.Label>
                    <Form.Control name="title" type="text" placeholder="Poll Title" value={this.state.title} onChange={this.handleInputChange}/>
                </Form.Group>
                
                <Form.Group controlId="maxSelectionCount">
                    <Form.Label>Maximum Selection Count</Form.Label>
                    <Form.Control as="select" name="maxSelectionCount" onChange={this.handleInputChange}>
                        <option value="" disabled selected>Select your number of maximum selections</option>
                        {
                             this.x()
                        }
                        
                    </Form.Control>
                </Form.Group>

                {
                    this.state.options.map(option=>
                        <div>
                        <Button block variant="danger" onClick={()=>{this.handleOptionRemoveClick(option)}}><b>{option}</b></Button><br/>
                        </div>
                    )
                }

                <Form.Group controlId="title">
                    <Form.Control name="option" type="text" placeholder="Option" value={this.state.option} onChange={this.handleInputChange}/>
                </Form.Group>
                <Button block variant="primary" onClick={()=>{this.handleOptionAddClick()}}>
                    Add Option
                </Button>                
                
                <Button block variant="primary" type="submit" onClick={()=>{this.handleAddClick()}}>
                    Submit Poll
                </Button>
            </Form>
        )
    }

    render(){
        return(
                
                <div>
                <this.Poll/>
                <p>List of Users</p>
                {
                    this.state.users.map(user =>
                        <p key={user.id}>{user.id} {user.name} {user.surname} <Button variant="success" onClick={()=>{this.handleVoterAddClick(user)}}>Add to Poll</Button></p>
                    )
                }
                <br/>
                <p>Added Users</p>
                {
                    this.state.voters.map(voter =>
                        <p key={voter.id}>{voter.id} {voter.name} {voter.surname} <Button variant="danger" onClick={()=>{this.handleVoterRemoveClick(voter)}}>Remove from Poll</Button></p>
                    )
                }
                {
                    this.state.polls.map(poll => 
                        <Card key={poll.id}>
                            <Card.Header>{poll.title}</Card.Header>
                            <Card.Body>
                                {
                                    poll.options.map(option=>
                                        <p key={option.id}>{option.body} Count: {option.count/poll.entryCount}</p>
                                    )
                                }
                            </Card.Body>
                        </Card>
                    )
                }

                </div>
        )
    }
}

export default PollAdd;