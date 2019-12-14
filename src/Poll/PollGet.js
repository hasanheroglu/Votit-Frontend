import React from 'react';
import {Button, Form, Card, Spinner, Image} from 'react-bootstrap';
import {Link} from 'react-router-dom';

class PollGet extends React.Component{
    constructor(props){
        super(props)
        this.state = {poll : [], options: [], voters: [], optionIds: [], votePoints: [], selectionLimit: 0, update: false, didGetPoll: false,
                        voter: [], didGetVoter: false,
                        updatedEndDate: [], willUpdate: false}
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.handleVoteClick = this.handleVoteClick.bind(this)
        this.handleUpdateClick = this.handleUpdateClick.bind(this)
        this.ShowPoll = this.ShowPoll.bind(this)
        this.StandardPoll = this.StandardPoll.bind(this)
        this.PrioritizedPoll = this.PrioritizedPoll.bind(this)
        this.MultipleChoicePoll = this.MultipleChoicePoll.bind(this)
        this.handleCheckboxInput = this.handleCheckboxInput.bind(this)
        this.handlePrioritizedInput = this.handlePrioritizedInput.bind(this)
    }

    componentDidMount(){
        const companyName = this.props.match.params.name;
        const pollId = this.props.match.params.pollId;

        fetch('http://localhost:8080/companies/' + companyName + '/polls/' + pollId, {
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
            this.setState({poll: result.operationObject, options: result.operationObject.options, voters: result.operationObject.users, didGetPoll: true});
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
            this.setState({voter: result.operationObject, didGetVoter: true});
            console.log(result);
        })
        .catch(error =>{
            console.log(error);
        });
    }

    componentDidUpdate(){
        const companyName = this.props.match.params.name;
        const pollId = this.props.match.params.pollId;

        if(!this.state.update){return;}

        fetch('http://localhost:8080/companies/' + companyName + '/polls/' + pollId, {
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
            this.setState({poll: result.operationObject, options: result.operationObject.options, update:false, didGetPoll: true})
            console.log(result);
        })
        .catch(error =>{
            console.log(error);
        });
    }    

    handleInputChange(event){
        if(this.state.optionIds){
            this.state.optionIds.pop()
            this.state.votePoints.pop();
        }

        this.state.optionIds.push(event.target.value);
        this.state.votePoints.push(1);
    }

    handleDateChange(event){
        this.setState({[event.target.name]: event.target.value, update: true}); 
    }

    handleCheckboxInput(event){
        if(event.target.checked){
            if(this.state.selectionLimit >= this.state.poll.maxSelectionCount){
                event.target.checked = false;
                return;
            }

            this.state.optionIds.push(event.target.value);
            this.state.votePoints.push(1);
            this.setState({selectionLimit: this.state.selectionLimit + 1});
        } else{
            var index = this.state.optionIds.indexOf(event.target.value);
            this.state.optionIds.splice(index, 1);
            this.state.votePoints.splice(index, 1);
            this.setState({selectionLimit: this.state.selectionLimit - 1});
        }

        console.log(this.state.votePoints)
    }

    handlePrioritizedInput(event){
        if(event.target.value == "novote"){
            var index = this.state.optionIds.indexOf(event.target.name);
            this.state.optionIds.splice(index, 1);
            this.state.votePoints.splice(index, 1);
            this.setState({selectionLimit: this.state.selectionLimit - 1});
            return;
        }

        if(this.state.optionIds.indexOf(event.target.name) >= 0){
            if(this.state.votePoints.indexOf(event.target.value) >= 0){
                event.target.value = "novote";
                var index = this.state.optionIds.indexOf(event.target.name);
                this.state.optionIds.splice(index, 1);
                this.state.votePoints.splice(index, 1);
                this.setState({selectionLimit: this.state.selectionLimit - 1});
            } else{
                var index = this.state.optionIds.indexOf(event.target.name);
                this.state.optionIds.splice(index, 1);
                this.state.votePoints.splice(index, 1);
                this.setState({selectionLimit: this.state.selectionLimit - 1});

                this.state.optionIds.push(event.target.name);
                this.state.votePoints.push(event.target.value);
                this.setState({selectionLimit: this.state.selectionLimit + 1});
            }
        } else{
            if(this.state.votePoints.indexOf(event.target.value) >= 0){
                event.target.value = "novote";
            } else{
                this.state.optionIds.push(event.target.name);
                this.state.votePoints.push(event.target.value);
                this.setState({selectionLimit: this.state.selectionLimit + 1});
            }
        }
    }

    handleVoteClick(){
        const companyName = this.props.match.params.name;
        const pollId = this.props.match.params.pollId;
        console.log(this.state.optionIds);

        fetch('http://localhost:8080/companies/' + companyName + '/polls/' + pollId, {
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
            body: JSON.stringify({pollId: pollId, 
                                  optionIds: this.state.optionIds,
                                  votePoints: this.state.votePoints,
                                  voterId: this.state.voter.id 
                                })
        
        
        })
        .then(response => response.json())
        .then(result =>{
            console.log(result);
            this.setState({update: true})
        })
        .catch(error =>{
            console.log(error);
        });
    }

    handleUpdateClick(){
        const companyName = this.props.match.params.name;
        const pollId = this.props.match.params.pollId;
        console.log(this.state.optionIds);

        //check compatibility with start date and previous end date


        fetch('http://localhost:8080/companies/' + companyName + '/polls/' + pollId, {
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
            body: JSON.stringify({endDate: this.state.updatedEndDate})
        })
        .then(response => response.json())
        .then(result =>{
            console.log(result);
            this.setState({update: true, willUpdate: false})
        })
        .catch(error =>{
            console.log(error);
        });
    }

    ShowPoll(props){
        if(props.hidden){
            return <p>Updating the poll...</p>;
        }
        switch(props.type) {
            case 'standard':
                return <this.StandardPoll/>
            case 'prioritized':
                return <this.PrioritizedPoll/>
            case 'multiple_choice':
                return <this.MultipleChoicePoll/>
            default:
              return null;
        }
    }

    StandardPoll(){
        return(
            <Form.Group>
                       {
                            this.state.options.map(option=>
                            <Form.Check
                            key={option.id}
                            type="radio"
                            label={" " + option.body + " %" + (option.count/this.state.poll.entryCount)*100}
                            name="optionIds"
                            value={option.id}
                            onChange={this.handleInputChange}
                            />
                            )
                        }
            </Form.Group>
        )
    }

    x = () => {
        let selectionCounts = [];

        for (let index = 1; index <= this.state.poll.maxSelectionCount; index++) {
            selectionCounts.push(<option value={this.state.poll.maxSelectionCount + 1 - index}>{index}</option>);
        }

        return selectionCounts;
    }

    PrioritizedPoll(){
        return(
            <Form.Group>
            {
                this.state.options.map(option=>
                <div>
                    <Form.Control key={option.id} name={option.id} as="select" onChange={this.handlePrioritizedInput}>
                        <option value="novote" selected>No Vote</option>
                        {this.x()}
                    </Form.Control>
                    <p>{" " + option.body + " %" + (option.count/this.state.poll.entryCount)*100}</p>
                </div>
                )
            }
            </Form.Group>
        )
    }

    MultipleChoicePoll(){
        return(
            <Form.Group>
                       {
                            this.state.options.map(option=>
                            <Form.Check
                            key={option.id}
                            type="checkbox"
                            label={" " + option.body + " %" + (option.count/this.state.poll.entryCount)*100}
                            name="option"
                            value={option.id}
                            onChange={this.handleCheckboxInput}
                            />
                            )
                        }
            </Form.Group>
        )
    }

    render(){
        return(
            <div style={{width:500, margin:0, margin:"auto"}}>
                {
                    this.state.didGetPoll
                    ?   <div>
                            <Card>
                                <Card.Header>
                                    {this.state.poll.title} 
                                    <Button variant="success" hidden={!(this.state.poll.ownerId === this.state.voter.id)} className="float-right" onClick={()=>{this.setState({willUpdate: true})}}>Update</Button>
                                </Card.Header>
                                <Card.Body>
                                <p>Start Date: {this.state.poll.startDate.substring(0,10)}</p>
                                <p hidden={this.state.willUpdate}>End Date: {this.state.poll.endDate.substring(0,10)}</p>
                                <Form hidden={!this.state.willUpdate}>
                                    <Form.Group controlId="endDate">
                                        <Form.Label>End Date:</Form.Label>
                                        <Form.Control name="updatedEndDate" type="date" value={this.state.updatedEndDate} onChange={this.handleDateChange}/>
                                    </Form.Group>
                                    <Button variant="success" onClick={()=>{this.handleUpdateClick()}}>Update</Button>
                                </Form>
                                <this.ShowPoll hidden={this.state.willUpdate} type={this.state.poll.type}/>
                                <Button variant="primary" hidden={this.state.willUpdate} onClick={()=>{this.handleVoteClick()}}>Submit</Button>
                                </Card.Body>
                            </Card>
                        </div>
                    : <div style={{width:50, margin:0, margin:"auto"}}><Spinner animation="grow" variant="white"><Image src={require('../votit_logo_small.png')} rounded fluid /></Spinner></div>
                }
            </div>
        )
    }
}

export default PollGet;