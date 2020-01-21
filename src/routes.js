import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Home from './components/Home/Home'
import EditSettings from './components/EditSettings/EditSettings'

export default (
    <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <Route path='/settings/edit' component={EditSettings} />
    </Switch>
)