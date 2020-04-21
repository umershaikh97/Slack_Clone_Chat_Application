import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import { checkArrayLength } from '../../utils';
import Message from './Message';

const Messages = ({ currentChannel, currentUser }) => {
    const [messagesRef, setMsgRef] = useState(firebase.database().ref('messages'))
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(true);

    useEffect(() => {
        if (currentChannel && currentUser) {
            addListener(currentChannel.id);
        }
        return () => {
        }
    }, [])

    const addListener = (channelId) => {
        addMessageListener(channelId);
    }

    const addMessageListener = async (channelId) => {
        let loadedMessages = [];
        try {
            await messagesRef.child(channelId).on('child_added', snap => {
                loadedMessages.push(snap.val());
                setMessages([...loadedMessages])
            })
        } catch (error) {
            console.log('error loading messages', error)
        }
        setMessagesLoading(false);
    }

    return (
        <React.Fragment>
            <MessagesHeader />

            <Segment>
                <Comment.Group className="messages">{
                    checkArrayLength(messages) && messages.map(_message => {
                        return <Message
                            key={_message.timestamp}
                            message={_message}
                            user={currentUser}
                        />
                    })
                }</Comment.Group>
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
