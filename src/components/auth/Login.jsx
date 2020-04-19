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

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const displayErrors = (errors) => errors.map((error, i) => <p key={i}>{error.message}</p>)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormValid()) {
            setErrors([])
            setLoading(true);
            try {
                let signedInUser = await firebase.auth().signInWithEmailAndPassword(email, password);
                console.log(signedInUser)
            } catch (error) {
                console.log(error)
                setErrors([...errors, error])
            }
            setLoading(false);
        }
    }

    const handleInputError = (inputName) => {
        return errors.some(error =>
            error.message.toLowerCase().includes(inputName)) ? 'error' : '';
    }

    const isFormValid = () => email && password;

    return (
        <div>
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h1" icon color="violet" textAlign="center">
                        <Icon name="code branch" color="violet" />
                            Login to DevChat
                    </Header>
                    <Form size="large" onSubmit={handleSubmit}>
                        <Segment stacked>

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

                            <Button disabled={loading} className={loading ? 'loading' : ''} color="violet" fluid size="large">
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
                        Don't an account? <Link to="/register">Register</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        </div>
    )
}

export default Login;
