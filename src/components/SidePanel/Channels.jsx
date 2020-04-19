import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import { checkKeyInObject, checkArrayLength } from '../../utils';
import { setCurrentChannel } from '../../store/actions/channelActions';

const Channels = ({ currentUser, setCurrentChannel }) => {
    const [channels, setChannels] = useState([]);
    const [isModalOpen, toggleModal] = useState(false);
    const [channelDetails, setChannelDetails] = useState("");
    const [channelName, setChannelName] = useState("");
    const [isFirstLoad, setFirstLoad] = useState(true);
    const [activeChannel, setActiveChannel] = useState('')

    useEffect(() => {
        addListenerForCreateChannel();
        return () => {
            removeListenerForCreateChannel();
        }
    }, [])

    useEffect(() => {
        setFirstChannel();
    }, [channels])

    const removeListenerForCreateChannel = async () => {
        try {
            const channelRef = await firebase.database().ref('channels');
            await channelRef.off();
        } catch (error) {
            console.log('Error while removing listener', error)
        }
    }

    const addListenerForCreateChannel = async () => {
        let loadedChannels = [];
        try {
            const channelRef = await firebase.database().ref('channels');
            await channelRef.on('child_added', snap => {
                loadedChannels.push(snap.val());
                setChannels([...loadedChannels]);
            })
        } catch (error) {
            console.log('Error while loading channel list', error)
        }
    }

    const setFirstChannel = () => {
        if (isFirstLoad && checkArrayLength(channels)) {
            setCurrentChannel(channels[0]);
            setActiveChannel(channels[0])
            setFirstLoad(false);
        }
    }

    const displayChannels = () =>
        checkArrayLength(channels) &&
        channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={channel.id === activeChannel.id}
            >
                # {channel.name}
            </Menu.Item>
        ));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (channelName && channelDetails) {
            addChannel();
        }
    }

    const changeChannel = (channel) => {
        updateActiveChannel(channel);
        setCurrentChannel(channel);
    }

    const updateActiveChannel = (channel) => {
        setActiveChannel(channel);
        setCurrentChannel(channel);
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
                {displayChannels()}
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

const mapStateToProps = (state) => {
    return {
        currentUser: state.userReducer.currentUser,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCurrentChannel: (...args) => { dispatch(setCurrentChannel(...args)) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Channels);
