import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import MainPage from './MainPage';
import CompanyAdd from './Company/CompanyAdd';

const AppRouter = () =>(
    <BrowserRouter>
        <Route exact path="/*" component={MainPage} />
        <Route exact path="/companies" component={CompanyAdd} />
    </BrowserRouter>
);

export default AppRouter;