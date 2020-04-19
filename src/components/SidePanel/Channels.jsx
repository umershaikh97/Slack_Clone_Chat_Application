import React, { useState } from 'react';
import firebase from '../../firebase';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import { checkKeyInObject } from '../../utils';

const Channels = ({ currentUser }) => {
    const [channels, setChannels] = useState([]);
    const [isModalOpen, toggleModal] = useState(false);
    const [channelDetails, setChannelDetails] = useState("");
    const [channelName, setChannelName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (channelName && channelDetails) {
            addChannel();
        }
    }

    const addChannel = async () => {
        try {
            const channelRef = await firebase.database().ref('channels');
            const key = await channelRef.push().key; // create a new document and then returns its unique key

            const newChannel = {
                id: key,
                name: channelName,
                details: channelDetails,
                createdBy: {
                    name: checkKeyInObject(currentUser, 'displayName', 'value', ''),
                    avatar: checkKeyInObject(currentUser, 'photoURL', 'value', ''),
                }
            }

            await channelRef.child(key).update(newChannel);
            toggleModal(false)

        } catch (error) {
            console.log('error creating a channel', error)
        }
    }

    return (
        <React.Fragment>
            <Menu.Menu style={{ paddingBottom: "2em" }}>
                <Menu.Item>
                    <span>
                        <Icon name="exchange" /> CHANNELS
            </span>{" "}
            ({channels.length}) <Icon name="add" style={{ cursor: 'pointer' }} onClick={() => { toggleModal(true) }} />
                </Menu.Item>
                {/* Channels */}
            </Menu.Menu>

            {/* Add Channel Modal */}
            <Modal basic open={isModalOpen} onClose={() => { toggleModal(false) }}>
                <Modal.Header>Add a Channel</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <Input
                                fluid
                                label="Name of Channel"
                                name="channelName"
                                onChange={(e) => { setChannelName(e.target.value) }}
                            />
                        </Form.Field>

                        <Form.Field>
                            <Input
                                fluid
                                label="About the Channel"
                                name="channelDetails"
                                onChange={(e) => { setChannelDetails(e.target.value) }}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <Button color="green" inverted onClick={handleSubmit}>
                        <Icon name="checkmark" /> Add
            </Button>
                    <Button color="red" inverted onClick={() => { toggleModal(false) }}>
                        <Icon name="remove" /> Cancel
            </Button>
                </Modal.Actions>
            </Modal>
        </React.Fragment>
    );

}

export default Channels;
