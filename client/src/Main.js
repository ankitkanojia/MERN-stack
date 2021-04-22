import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './Pages/login';
import Register from './Pages/register';
import Users from './Pages/user';

const Main = () => (
        <Switch>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/register' component={Register}/>
            <Route exact path='/' component={Users}/>
        </Switch>
)

export default Main;