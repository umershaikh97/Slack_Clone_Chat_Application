import React, { useState } from "react";
import mime from 'mime-types';
import { Modal, Input, Button, Icon } from "semantic-ui-react";

const FileModal = ({ isOpenModal, closeModal, uploadFile }) => {
    const [file, setFile] = useState(null);
    const authorized = ['image/jpeg', 'image/png'];

    const addFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file)
        }
    }

    const sendFile = (e) => {
        if (file !== null && isAuthorized(file.name)) {
            const metadeta = { contentType: mime.lookup(file.name) }
            uploadFile(file, metadeta)
        }
    }

    const isAuthorized = filename => authorized.includes(mime.lookup(filename))

    return (
        <Modal basic open={isOpenModal} onClose={closeModal}>
            <Modal.Header>Select an Image File</Modal.Header>
            <Modal.Content>
                <Input onChange={addFile} fluid label="File types: jpg, png" name="file" type="file" />
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={sendFile} color="green" inverted>
                    <Icon name="checkmark" /> Send
          </Button>
                <Button color="red" inverted onClick={closeModal}>
                    <Icon name="remove" /> Cancel
          </Button>
            </Modal.Actions>
        </Modal>
    );
}

export default FileModal;
