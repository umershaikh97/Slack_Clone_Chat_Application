import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import App from './App';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

const AppRoutes = () => {
    return (
        <Router>
            <Switch>
                <Route exact path={'/'} component={App} />
                <Route exact path={'/login'} component={Login} />
                <Route exact path={'/register'} component={Register} />
                <Redirect to={'/'} />
            </Switch>
        </Router>
    )
}

export default AppRoutes;
