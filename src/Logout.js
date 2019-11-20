import React from 'react'
import Login from './Login';
import {Redirect} from 'react-router-dom';

class Logout extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        const username = localStorage.getItem("Username")
        localStorage.clear()
        return(
            <div>
                <p>Logging out...</p>
                <p>See you next time {username}</p>
                <Redirect to={"/login"} component={Login} />
            </div>
        )
    }

}

export default Logout;