import React, { useState } from 'react';
import firebase from '../../firebase';
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';

const Messages = ({ currentChannel, currentUser }) => {
    const [messagesRef, setMsgRef] = useState(firebase.database().ref('messages'))

    return (
        <React.Fragment>
            <MessagesHeader />

            <Segment>
                <Comment.Group className="messages">{/* Messages */}</Comment.Group>
            </Segment>

            <MessageForm
                messagesRef={messagesRef}
                currentUser={currentUser}
                currentChannel={currentChannel}
            />
        </React.Fragment>
    );
}

export default Messages;
