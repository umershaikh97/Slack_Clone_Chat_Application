import React, { useState } from 'react';
import firebase from '../../firebase';
import { Segment, Button, Input } from 'semantic-ui-react';
import FileModal from './FileModal';

const MessageForm = ({ messagesRef, currentChannel, currentUser }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isOpenModal, toggleModal] = useState(false);

  const sendMessage = async () => {
    if (message) {
      try {
        setLoading(true);
        await messagesRef.child(currentChannel.id).push().set(createMessage())
        setMessage('');
        setErrors([]);
      } catch (error) {
        console.log('error sending message', error);
        setErrors([...errors, error]);
      }
      setLoading(false)
    }
    else {
      setErrors([...errors, { message: 'Add a message' }])
    }
  }

  const createMessage = () => {
    const msg = {
      content: message,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
      }
    }
    return msg;
  }

  return (
    <Segment className="message__form">
      <Input
        fluid
        name="message"
        value={message}
        style={{ marginBottom: "0.7em" }}
        label={<Button icon={"add"} />}
        labelPosition="left"
        placeholder="Write your message"
        className={errors.some(error => error.includes('message')) ? 'error' : ''}
        onChange={(e) => { setMessage(e.target.value) }}
      />
      <Button.Group icon widths="2">
        <Button
          color="orange"
          content="Add Reply"
          labelPosition="left"
          icon="edit"
          disabled={isLoading}
          onClick={sendMessage}
        />
        <Button
          color="teal"
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
          onClick={() => { toggleModal(true) }}
        />
        <FileModal isOpenModal={isOpenModal} closeModal={() => { toggleModal(false) }} />
      </Button.Group>
    </Segment>
  );
}

export default MessageForm;
