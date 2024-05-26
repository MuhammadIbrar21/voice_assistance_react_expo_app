import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Text, Linking, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Speech from 'expo-speech';
import * as Contacts from 'expo-contacts';

const Create = () => {
    const [recognizedCommand, setRecognizedCommand] = useState('');
    const webviewRef = useRef(null);

    useEffect(() => {
        handleVoiceCommand(recognizedCommand);
    }, [recognizedCommand]);

    const handleVoiceCommand = async (command) => {
        if (command) {
            const lowerCaseCommand = command.toLowerCase();
            if (lowerCaseCommand.includes('call')) {
                const name = lowerCaseCommand.replace('call', '').trim();
                await makePhoneCall(name);
            }
        }
    };

    const makePhoneCall = async (name) => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
            });

            if (data.length > 0) {
                const contact = data.find(
                    (contact) => contact.name.toLowerCase().includes(name.toLowerCase())
                );

                if (contact && contact.phoneNumbers && contact.phoneNumbers.length > 0) {
                    const phoneNumber = contact.phoneNumbers[0].number;
                    Speech.speak(`Calling ${contact.name}`);
                    Linking.openURL(`tel:${phoneNumber}`);
                } else {
                    Speech.speak(`${name} not found in contacts`);
                }
            } else {
                Speech.speak('No contacts available');
            }
        } else {
            Alert.alert('Permission denied');
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <WebView
                ref={webviewRef}
                source={{ uri: 'https://muhammadibrar21.github.io/SpeechToTextPersonalAPI/' }}
                onMessage={(event) => {
                    setRecognizedCommand(event.nativeEvent.data);
                }}
                style={{ flex: 1 }}
            />
        </View>
    );
};

export default Create;
