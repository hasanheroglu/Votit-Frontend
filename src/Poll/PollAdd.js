import React from 'react';
import {Button, Form, Card, Image, Alert, Table} from 'react-bootstrap';
import {Link} from 'react-router-dom';

class PollAdd extends React.Component{
    constructor(props){
        super(props)
        this.state = { title: '', option: '', 
                        pollType: '', polls: [], startDate:'', endDate:'', options: [], maxSelectionCount: 1,
                        titles: [], selectedTitle: 'User', 
                        voters: [], voterIdList: [], users: [], 
                        owner: [],
                        update: false,
                        addAttempt: false,
                    }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleAddClick = this.handleAddClick.bind(this)
        this.handleOptionAddClick = this.handleOptionAddClick.bind(this)
        this.handleOptionRemoveClick = this.handleOptionRemoveClick.bind(this)
        this.handleVoterAddClick = this.handleVoterAddClick.bind(this)
        this.Poll = this.Poll.bind(this)
        this.PollInfo = this.PollInfo.bind(this)
        this.UserList = this.UserList.bind(this)
        this.handleAddAllClick = this.handleAddAllClick.bind(this)
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

        var isSystemAdmin = false;
        var isCompanyAdmin = false;
        var isPollOwner = false;
        var isUser = false;

        let roles = localStorage.getItem("Roles");
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
        .then(result =>{
            if(result.wasSuccessful){
                this.setState({polls: result.operationObject});
            }
            console.log(result);
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
        .then(result =>{
            this.setState({users: result.operationObject.users, titles: result.operationObject.titles});
            console.log(result);
        })
        .catch(error =>{
            console.log(error);
        });

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
            this.setState({owner: result.operationObject, polls: result.operationObject.polls});
            console.log(result);
        })
        .catch(error =>{
            console.log(error);
        });
    }

    componentDidUpdate(){
        if(!this.state.update) {return;}

        const companyName = this.props.match.params.name;

        if(this.state.selectedTitle != "User"){

            fetch('http://localhost:8080/companies/' + companyName + '/' + this.state.selectedTitle + '/users', {
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
                this.setState({users: result.operationObject, update: false});
                console.log(result);
            })
            .catch(error =>{
                console.log(error);
            });
        } else{
            fetch('http://localhost:8080/companies/' + companyName + '/users', {
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
                this.setState({users: result.operationObject, update: false})
                console.log(result);
            })
            .catch(error =>{
                console.log(error);
            });
        }
    }

    handleInputChange(event){
        this.setState({[event.target.name]: event.target.value, update: true}); 
    }

    handleAddClick(){
        
        if(!this.state.pollType || !this.state.title 
            || !this.state.startDate || !this.state.endDate
            || this.state.options.length < 2 || this.state.options.length > 10){
            
            this.setState({addAttempt: true});
            return;
        }

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
                                  startDate: this.state.startDate,
                                  endDate: this.state.endDate,
                                  voterIdList: this.state.voterIdList,
                                  maxSelectionCount: this.state.maxSelectionCount,
                                  ownerId: this.state.owner.id
                                })
        
        
        })
        .then(response => response.json())
        .then(result =>{
            console.log(result);
        })
        .catch(error =>{
            console.log(error);
        });
    }

    handleOptionAddClick(){
        if(this.state.options.length == 10){
            alert("Too many options!");
        }
        this.state.options.push(this.state.option);
        this.setState({update: true});
    }

    handleOptionRemoveClick(option){
        var optionIndex = this.state.options.indexOf(option);
        this.state.options.splice(optionIndex, 1);
        this.setState({update: true});
    }

    handleVoterAddClick(voter){
        if(this.state.voters.some(v => (v.id === voter.id))){
            alert("User already added!")
            return;
        }

        this.state.voters.push(voter);
        this.setState({update: true});
    }

    handleAddAllClick(){
        this.setState({voters: this.state.users});
        this.setState({update: true});
    }

    handleVoterRemoveClick(user){
        var voterIndex = this.state.voters.indexOf(user);
        this.state.voters.splice(voterIndex, 1);
        this.setState({update: true});
    }

    UserList(){
        return(
            <div>
                <h2>Add Voters</h2>

                <Form.Group controlId="selectedTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control as="select" name="selectedTitle" onChange={this.handleInputChange}>
                                <option value="User"  selected>All</option>
                                {
                                    this.state.titles.map(title=>
                                        <option value={title.title}>{title.title}</option>    
                                    )
                                }       
                            </Form.Control>
                </Form.Group>

                <p>List of {this.state.selectedTitle}(s)</p>
                <Table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Surname</th>
                            <th>Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.users.map(user =>
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.surname}</td>
                                    <td><Button block variant="success" onClick={()=>{this.handleVoterAddClick(user)}}>+</Button></td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
                
                <Button block variant="success" onClick={() => {this.handleAddAllClick()}}>Add all</Button>
                <br/>
                <p>Added Users</p>
                <Table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Surname</th>
                            <th>Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.voters.map(voter =>
                                <tr key={voter.id}>
                                    <td>{voter.id}</td>
                                    <td>{voter.name}</td>
                                    <td>{voter.surname}</td>
                                    <td><Button block variant="danger" onClick={()=>{this.handleVoterRemoveClick(voter)}}>-</Button></td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
            </div>
        )
    }

    Poll(props) {
        if(props.hidden){
            return(
                <p></p>
            )
        }
        return(                
            <Form>

                <h2>Poll Info</h2>

                <Form.Group controlId="pollType">
                    <Form.Label>Poll Type</Form.Label>
                    <Form.Control as="select" name="pollType" onChange={this.handleInputChange}>
                        <option value="" disabled selected>Select your poll type</option>                        
                        <option value="standard">Standard</option>
                        <option value="prioritized">Prioritized</option>
                        <option value="multiple_choice">Multiple Choice</option>
                    </Form.Control>
                    <Alert variant="danger" hidden={this.state.pollType || !this.state.addAttempt} >Poll type must be chosen!</Alert>
                </Form.Group>
                <Form.Group controlId="title">
                    <Form.Label>Poll Title</Form.Label>
                    <Form.Control name="title" type="text" placeholder="Poll Title" value={this.state.title} onChange={this.handleInputChange}/>
                    <Alert variant="danger" hidden={this.state.title || !this.state.addAttempt} >Poll title cannot be empty!</Alert>
                </Form.Group>
                <Form.Group controlId="startDate">
                    <Form.Label>Poll Start Date</Form.Label>
                    <Form.Control name="startDate" type="date" value={this.state.startDate} onChange={this.handleInputChange}/>
                    <Alert variant="danger" hidden={this.state.startDate || !this.state.addAttempt} >Poll Start Date must have been set!</Alert>
                </Form.Group>
                <Form.Group controlId="endDate">
                    <Form.Label>Poll End Date</Form.Label>
                    <Form.Control name="endDate" type="date" value={this.state.endDate} onChange={this.handleInputChange}/>
                    <Alert variant="danger" hidden={this.state.endDate || !this.state.addAttempt} >Poll End Date must have been set!</Alert>
                </Form.Group>
                <Form.Group  hidden={!this.state.pollType || !(this.state.pollType === "prioritized" ||this.state.pollType === "multiple_choice")} controlId="maxSelectionCount">
                    <Form.Label>Maximum Selection Count</Form.Label>
                    <Form.Control as="select" name="maxSelectionCount" onChange={this.handleInputChange}>
                        <option value="" disabled selected>Select your number of maximum selections</option>
                        {
                             this.x()
                        }
                        
                    </Form.Control>
                </Form.Group>

                <h2>Options</h2>

                <Form.Group controlId="title">
                    <Form.Control name="option" type="text" placeholder="Option" value={this.state.option} onChange={this.handleInputChange}/>
                </Form.Group>
                <Button block variant="primary" onClick={()=>{this.handleOptionAddClick()}}>
                    Add Option
                </Button>
                <br/>
                {
                    this.state.options.map(option=>
                        <div>
                        <Button block variant="danger" onClick={()=>{this.handleOptionRemoveClick(option)}}><b>{option}</b></Button><br/>
                        </div>
                    )
                }
                <Alert variant="danger" hidden={(this.state.options.length >= 2 && this.state.options.length <= 10) || !this.state.addAttempt} >Poll must have at least 2 at most 10 options!</Alert>

                <br/>
                <this.UserList/>                
                
                <Button block variant="primary" onClick={()=>{this.handleAddClick()}}>
                    Submit Poll
                </Button>
            </Form>
        )
    }

    PollInfo(){
        if(this.state.polls.length === 0){
            return(
                <p>You are not invited to any poll.</p>
            )
        }

        return(
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
        )
    }

    render(){
        var isPollOwner = false;

        let roles = localStorage.getItem("Roles");
        if(roles){
          if(roles.includes("ROLE_POLL_OWNER")){
            isPollOwner = true;
          } else{
            isPollOwner = false;
          }
        }

        return(    
            <div style={{width:500, margin:0, margin:"auto"}}>
                <Image src={require('../logo1.jpeg')} rounded fluid />
                <this.Poll hidden={!isPollOwner}/>
                <br/><h2>Your Polls</h2>
                <this.PollInfo/>
            </div>
        )
    }
}

export default PollAdd;