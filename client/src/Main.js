import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './Pages/login';
import Register from './Pages/register';
import Users from './Pages/user';

const Main = () => (
        <Switch>
            <Route exact path='/' component={Login}/>
            <Route exact path='/register' component={Register}/>
            <Route exact path='/users' component={Users}/>
        </Switch>
)

export default Main;