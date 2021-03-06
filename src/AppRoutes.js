import React, { useEffect } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from './firebase';
import App from './App';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { setUser, clearUser } from './store/actions/userActions';
import Spinner from './components/Spinner';

const AppRoutes = ({ history, setUser, clearUser, isLoading }) => {

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                setUser(user)
                history.push('/');
            }
            else {
                clearUser();
                history.push('/login');
            }
        })
    }, [])

    return (isLoading ? <Spinner />
        :
        <Switch>
            <Route exact path={'/'} component={App} />
            <Route exact path={'/login'} component={Login} />
            <Route exact path={'/register'} component={Register} />
            <Redirect to={'/'} />
        </Switch>
    )
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.userReducer.currentUser,
        isLoading: state.userReducer.isLoading,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setUser: (...args) => { dispatch(setUser(...args)) },
        clearUser: (...args) => { dispatch(clearUser(...args)) },
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppRoutes));
