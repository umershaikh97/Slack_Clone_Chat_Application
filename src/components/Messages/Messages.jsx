import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import { checkArrayLength, checkKeyInObject } from '../../utils';
import Message from './Message';

const Messages = ({ currentChannel, currentUser }) => {
    const [messagesRef, setMsgRef] = useState(firebase.database().ref('messages'))
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(true);
    const [showProgressBar, toggleProgressBar] = useState(false);
    const [uniqueUsersCount, setUniqueUsersCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (currentChannel && currentUser) {
            addListener(currentChannel.id);
        }
        return () => {
        }
    }, [])

    useEffect(() => {
        if (checkArrayLength(messages)) {
            const filteredMessages = messages.filter(message => (message.content.toLowerCase().includes(searchTerm)))
            setSearchResults([...filteredMessages])
        }
    }, [searchTerm])

    const addListener = (channelId) => {
        addMessageListener(channelId);
    }

    const addMessageListener = async (channelId) => {
        let loadedMessages = [];
        try {
            await messagesRef.child(channelId).on('child_added', snap => {
                loadedMessages.push(snap.val());
                setMessages([...loadedMessages])
                countUniqueUsers(loadedMessages)
            })
        } catch (error) {
            console.log('error loading messages', error)
        }
        setMessagesLoading(false);
    }

    const countUniqueUsers = (loadedMessages) => {
        if (checkArrayLength(loadedMessages)) {
            let usernames = loadedMessages.map(message => checkKeyInObject(message, 'user.name', 'value', ''))
            let uniqueUserNames = [...new Set(usernames)];
            setUniqueUsersCount(uniqueUserNames.length)
        }
    }

    const isProgressBarVisible = (percentage) => {
        if (percentage > 0) {
            toggleProgressBar(true);
        }
    };

    const displayMessage = (_messages) => {
        if (checkArrayLength(_messages)) {
            _messages.map(_message => {
                return <Message
                    key={_message.timestamp}
                    message={_message}
                    user={currentUser}
                />
            })
        }
    }

    return (
        <React.Fragment>
            <MessagesHeader
                channelName={checkKeyInObject(currentChannel, 'name') ? `#${currentChannel.name}` : ''}
                uniqueUsersCount={uniqueUsersCount}
                handleSearchChange={(e) => { setSearchTerm(e.target.value) }}
            />
            <Segment>
                <Comment.Group className={showProgressBar ? 'messages__process' : 'messages'}>{
                    searchTerm ? displayMessage(searchResults) : displayMessage(messages)
                }</Comment.Group>
            </Segment>

            <MessageForm
                messagesRef={messagesRef}
                currentUser={currentUser}
                currentChannel={currentChannel}
                isProgressBarVisible={isProgressBarVisible}
            />
        </React.Fragment>
    );
}

export default Messages;
