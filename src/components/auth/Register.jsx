import React, { useState } from 'react';
import firebase from '../../firebase';
import {
    Grid,
    Form,
    Segment,
    Button,
    Header,
    Message,
    Icon
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const isFormValid = () => {
        let errors = [];
        let error;
        if (isFormEmpty()) {
            error = { message: 'Fill in all fields' };
            setErrors([...errors, error]);
            return false;
        }
        else if (!isPasswordValid()) {
            error = { message: 'Password is invalid' };
            setErrors([...errors, error]);
            return false;
        }
        else {
            return true;
        }
    }

    const displayErrors = (errors) => errors.map((error, i) => <p key={i}>{error.message}</p>)

    const isFormEmpty = () => {
        return !username.length || !email.length || !password.length || !passwordConfirmation;
    }

    const isPasswordValid = () => {
        if (password.length < 6 || passwordConfirmation.length < 6) {
            return false;
        }
        else if (password !== passwordConfirmation) {
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormValid()) {
            setErrors([])
            setLoading(true);
            console.log(username, email, password, passwordConfirmation);
            try {
                let createdUser = await firebase.auth().createUserWithEmailAndPassword(email, password);
                console.log(createdUser)
                setLoading(true);
            } catch (error) {
                setErrors([...errors, error])
                setLoading(false);
            }
        }
    }

    const handleInputError = (inputName) => {
        return errors.some(error =>
            error.message.toLowerCase().includes(inputName)) ? 'error' : '';
    }

    return (
        <div>
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" icon color="orange" textAlign="center">
                        <Icon name="puzzle piece" color="orange" />
                            Register for DevChat
                    </Header>
                    <Form size="large" onSubmit={handleSubmit}>
                        <Segment stacked>
                            <Form.Input
                                fluid
                                name="username"
                                icon="user"
                                iconPosition="left"
                                placeholder="Username"
                                onChange={(e) => { setUsername(e.target.value) }}
                                value={username}
                                type="text"
                                className={handleInputError('username')}
                            />
                            <Form.Input
                                fluid
                                name="email"
                                icon="mail"
                                iconPosition="left"
                                placeholder="Email Address"
                                onChange={(e) => { setEmail(e.target.value) }}
                                value={email}
                                type="email"
                                className={handleInputError('email')}
                            />
                            <Form.Input
                                fluid
                                name="password"
                                icon="lock"
                                iconPosition="left"
                                placeholder="Password"
                                onChange={(e) => { setPassword(e.target.value) }}
                                value={password}
                                type="password"
                                className={handleInputError('password')}
                            />
                            <Form.Input
                                fluid
                                name="passwordConfirmation"
                                icon="repeat"
                                iconPosition="left"
                                placeholder="Password Confirmation"
                                onChange={(e) => { setPasswordConfirmation(e.target.value) }}
                                value={passwordConfirmation}
                                type="password"
                                className={handleInputError('password')}
                            />
                            <Button disabled={loading} className={loading ? 'loading' : ''} color="orange" fluid size="large">
                                Submit
                            </Button>
                        </Segment>
                    </Form>
                    {
                        errors.length > 0 && (
                            <Message error>
                                <h3>Error</h3>
                                {displayErrors(errors)}
                            </Message>
                        )
                    }
                    <Message>
                        Already a user? <Link to="/login">Login</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        </div>
    )
}

export default Register;
