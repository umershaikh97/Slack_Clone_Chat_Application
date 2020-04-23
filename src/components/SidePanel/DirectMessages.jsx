import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import { Menu, Icon } from 'semantic-ui-react';
import { checkArrayLength } from '../../utils';

const DirectMessages = ({ currentUser, _users }) => {
    const [state, setState] = useState({
        users: [],
        usersRef: firebase.database().ref("users"),
        connectedRef: firebase.database().ref(".info/connected"),
        presenceRef: firebase.database().ref("presence")
    });

    useEffect(() => {
        if (currentUser) {
            addListeners(currentUser.uid)
        }
    }, [currentUser])

    const addListeners = (currentUserUid) => {
        let loadedUsers = [];
        state.usersRef.on("child_added", snap => {
            if (currentUserUid !== snap.key) {
                let user = snap.val();
                user["uid"] = snap.key;
                user["status"] = "offline";
                loadedUsers.push(user);
                setState({ ...state, users: loadedUsers });
            }
        });

        state.connectedRef.on("value", snap => {
            if (snap.val() === true) {
                const ref = state.presenceRef.child(currentUserUid);
                ref.set(true);
                ref.onDisconnect().remove(err => {
                    if (err !== null) {
                        console.error(err);
                    }
                });
            }
        });

        state.presenceRef.on("child_added", snap => {
            if (currentUserUid !== snap.key) {
                addStatusToUser(snap.key);
            }
        });

        state.presenceRef.on("child_removed", snap => {
            if (currentUserUid !== snap.key) {
                addStatusToUser(snap.key, false);
            }
        });
    };

    const addStatusToUser = (userId, connected = true) => {
        const updatedUsers = state.users.reduce((acc, user) => {
            if (user.uid === userId) {
                user["status"] = `${connected ? "online" : "offline"}`;
            }
            return acc.concat(user);
        }, []);
        setState({ ...state, users: updatedUsers });
    };

    const isUserOnline = user => user.status === "online";
    return (
        <Menu.Menu className="menu">
            <Menu.Item>
                <span>
                    <Icon name="mail" /> DIRECT MESSAGES
          </span>{" "}
          ({state.users.length})
        </Menu.Item>
            {state.users.map(user => (
                <Menu.Item
                    key={user.uid}
                    onClick={() => console.log(user)}
                    style={{ opacity: 0.7, fontStyle: "italic" }}
                >
                    <Icon
                        name="circle"
                        color={isUserOnline(user) ? "green" : "red"}
                    />
            @ {user.name}
                </Menu.Item>
            ))}
        </Menu.Menu>
    );
}

export default DirectMessages;