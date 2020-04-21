import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import { Segment, Button, Input } from 'semantic-ui-react';
import FileModal from './FileModal';
import { uuid } from 'uuidv4';
import { checkKeyInObject } from '../../utils';

const MessageForm = ({ messagesRef, currentChannel, currentUser }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isOpenModal, toggleModal] = useState(false);
  const [uploadTask, setUploadTask] = useState(null);
  const [uploadState, setUploadState] = useState('');
  const [percentageUploaded, setPercentageUploaded] = useState(0);


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

  const uploadFile = (file, metadeta) => {
    const filePath = `chat/public/${uuid()}.jpg`;
    const storageRef = firebase.storage().ref();
    setUploadState('uploading');
    setUploadTask(storageRef.child(filePath).put(file, metadeta));
  }

  useEffect(() => {
    try {
      if (uploadTask) {
        uploadTask.on('state_changed', snap => {
          const percentageUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          setPercentageUploaded(percentageUploaded)
        })
        let pathToUpload = checkKeyInObject(currentChannel, 'id', 'value', null);
        if (uploadTask && uploadTask.snapshot) {
          uploadTask.snapshot.messagesRef.getDownloadURL().then(downloadURL => {
            sendFileMessage(downloadURL, messagesRef, pathToUpload)
            // .catch(error => {
            //   console.error(error);
            //   setErrors([...errors, error])
            //   setUploadState('error')
            //   setUploadTask(null)
            // })
          })

        }
      }
    } catch (error) {
      console.error(error);
      setErrors([...errors, error])
      setUploadState('error')
      setUploadTask(null)
    }
  }, [uploadTask])


  const sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref.child(pathToUpload).push().set(createMessage(fileUrl))
      .then(() => {
        setUploadState('done')
      })
      .catch(err => {
        console.log(err);
        setErrors([...errors, err])
      })
  }

  // useEffect(() => {
  //   let pathToUpload = checkKeyInObject(currentChannel, 'id', 'value', null);
  //   if (uploadTask) {
  //     uploadTask.snapshot.messagesRef.getDownloadURL().then(downloadURL => {
  //       sendFileMessage(downloadURL, messagesRef, pathToUpload)
  //         .catch(error => {
  //           console.error(error);
  //           setErrors([...errors, error])
  //           setUploadState('error')
  //           setUploadTask(null)
  //         })
  //     })

  //   }
  // }, [percentageUploaded])

  const createMessage = (fileUrl = null) => {
    const msg = {
      content: message,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
      }
    }
    if (fileUrl !== null) {
      msg['image'] = fileUrl;
    }
    else {
      msg['content'] = message;
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
        //  className={errors.some(error => error.includes('message')) ? 'error' : ''}
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
          disabled={true}
          onClick={() => { toggleModal(true) }}
        />
        <FileModal isOpenModal={isOpenModal} uploadFile={uploadFile} closeModal={() => { toggleModal(false) }} />
      </Button.Group>
    </Segment>
  );
}

export default MessageForm;
