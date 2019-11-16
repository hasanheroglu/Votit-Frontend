import React from 'react';
import {Button, Form, Card, Spinner} from 'react-bootstrap';
import {Link} from 'react-router-dom';

class PollGet extends React.Component{
    constructor(props){
        super(props)
        this.state = {poll : [], options: [], voters: [], optionIds: [], votePoints: [], selectionLimit: 0, update: false}
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleVoteClick = this.handleVoteClick.bind(this)
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
        .then(object =>{
            this.setState({poll: object, options: object.options, voters: object.users})
            console.log(object)
            alert("Poll have beeen set!")
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
        .then(object =>{
            this.setState({poll: object, options: object.options, update:false})
            console.log(object)
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

    handleCheckboxInput(event){
        if(event.target.checked){
            if(this.state.selectionLimit >= this.state.poll.maxSelectionCount){
                event.target.checked = false;
                return;
            }

            this.state.optionIds.push(event.target.value);
            this.setState({selectionLimit: this.state.selectionLimit + 1});
        } else{
            var index = this.state.optionIds.indexOf(event.target.value);
            this.state.optionIds.splice(index, 1);
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
                                  votePoints: this.state.votePoints})
        
        
        })
        .then(response => response.json())
        .then(object =>{
            console.log(object);
            this.setState({update: true})
        })
        .catch(error =>{
            console.log(error);
        });

    }

    ShowPoll(props){
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
            <Card>
                <Card.Header>PopQ: {this.state.poll.title}</Card.Header>
                <Card.Body>
                <this.ShowPoll type={this.state.poll.type}/>
                <p>Total entry count: {this.state.poll.entryCount}</p>
                <Button variant="primary" onClick={()=>{this.handleVoteClick()}}>Submit</Button>
                </Card.Body>
            </Card>
        )
    }
}

export default PollGet;