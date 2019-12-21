import React from 'react'
import Login from './Login';
import {Redirect} from 'react-router-dom';

class Logout extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        localStorage.clear()
        return(
            <div>
                <p>Logging out...</p>
                <p>See you next time...</p>
                <Redirect to={"/login"} component={Login} />
            </div>
        )
    }

}

export default Logout;