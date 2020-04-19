import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { checkKeyInObject } from '../../utils';

const UserPanel = ({ currentUser }) => {

    const dropdownOptions = () => [
        {
            key: "user",
            text: (
                <span>
                    Signed in as <strong>{checkKeyInObject(currentUser, 'displayName', 'value', 'user')}</strong>
                </span>
            ),
            disabled: true
        },
        {
            key: "avatar",
            text: <span>Change Avatar</span>
        },
        {
            key: "signout",
            text: <span onClick={handleSignOut}>Sign Out</span>
        }
    ];

    const handleSignOut = async () => {
        try {
            await firebase.auth().signOut();
            console.log('signed out')
        } catch (err) {
            console.log('error signing out')
        }
    }

    return (
        <Grid style={{ background: "#4c3c4c" }}>
            <Grid.Column>
                <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
                    {/* App Header */}
                    <Header inverted floated="left" as="h2">
                        <Icon name="code" />
                        <Header.Content>DevChat</Header.Content>
                    </Header>
                    {/* User Dropdown  */}
                    <Header style={{ padding: "0.25em" }} as="h4" inverted>
                        <Dropdown
                            trigger={<span>
                                <Image src={checkKeyInObject(currentUser, 'photoURL', 'value', null)} spaced="right" avatar alt="avatar" />
                                {checkKeyInObject(currentUser, 'displayName', 'value', 'user')}</span>}
                            options={dropdownOptions()}
                        />
                    </Header>
                </Grid.Row>

            </Grid.Column>
        </Grid>
    );
}

const mapStateToProps = (state) => {
    return {
        //currentUser: state.userReducer.currentUser,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPanel);