import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import MainPage from './MainPage';
import CompanyAdd from './Company/CompanyAdd';
import CompanyGet from './Company/CompanyGet';
import UserAdd from './User/UserAdd';
import UserGet from './User/UserGet';
import TitleAdd from './Title/TitleAdd';
import PollAdd from './Poll/PollAdd';
import PollGet from './Poll/PollGet';


const AppRouter = () =>(
    <BrowserRouter>
        <Route exact path="/*" component={MainPage} />
        <Route exact path="/companies" component={CompanyAdd} />
        <Route exact path="/companies/:name" component={CompanyGet} />
        <Route exact path="/companies/:name/users" component={UserAdd} />
        <Route exact path="/companies/:name/titles" component={TitleAdd} />
        <Route exact path="/users/:id" component={UserGet} />
        <Route exact path="/companies/:name/polls" component={PollAdd} />
        <Route exact path="/companies/:name/polls/:pollId" component={PollGet} />

    </BrowserRouter>
);

export default AppRouter;