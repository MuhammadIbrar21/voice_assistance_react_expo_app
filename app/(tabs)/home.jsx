import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Alert, Linking } from 'react-native';
import * as Contacts from 'expo-contacts';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice';

export default function Home() {
    const [recognizedText, setRecognizedText] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactNumber, setContactNumber] = useState('');

    useEffect(() => {
        requestPermissions();
    }, []);

    const requestPermissions = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant access to contacts.');
        }

        const { status: audioStatus } = await Audio.requestPermissionsAsync();
        if (audioStatus !== 'granted') {
            Alert.alert('Permission needed', 'Please grant access to microphone.');
        }

        // Start voice recognition setup after permissions are granted
        // setupVoiceRecognition();
    };

    const setupVoiceRecognition = async () => {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
            if (Voice) {
                await Voice.start('en-US');
                Audio.onSpeechResults = onSpeechResults;
                Audio.onSpeechError = onSpeechError;
            }
        } catch (error) {
            console.error('Voice recognition setup error: ', error);
        }
    };

    const onSpeechResults = (event) => {
        const recognized = event?.value?.[0] || '';
        setRecognizedText(recognized);
        searchContact(recognized);
    };

    const onSpeechError = (event) => {
        console.error('Voice recognition error: ', event.error);
    };

    const searchContact = async (searchQuery) => {
        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });

        const contact = data.find((contact) =>
            contact.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (contact) {
            setContactName(contact.name);
            setContactNumber(contact.phoneNumbers[0].number);
        } else {
            Speech.speak(`Could not find a contact with that name.`);
        }
    };

    const makeCall = async () => {
        try {
            Speech.speak(`Calling ${contactName}`);
            // Replace 'tel:' with 'telprompt:' for iOS to directly make the call without prompting
            await Linking.openURL(`tel:${contactNumber}`);
        } catch (error) {
            console.error('An error occurred while making the call', error);
            Alert.alert('Error', 'Failed to make the call.');
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Recognized Text: {recognizedText}</Text>
            <TextInput
                style={{ borderWidth: 1, padding: 10, margin: 10 }}
                placeholder="Search contact..."
                value={contactName}
                onChangeText={(text) => setContactName(text)}
            />
            <Button title="Search Contact" onPress={() => searchContact(contactName)} />
            <Button title="Make Call" onPress={makeCall} />
        </View>
    );
}






// import React, { useEffect, useState } from 'react'
// import { Button, Alert, View, Linking } from 'react-native'
// import * as Contacts from 'expo-contacts';
// import * as Speech from 'expo-speech';
// import * as Permissions from 'expo-permissions'

// const Home = () => {

//     const [contacts, setContacts] = useState([]);
//     const [spokenContactName, setSpokenContactName] = useState('');

//     useEffect(() => {
//         (async () => {
//             const { status } = await Contacts.requestPermissionsAsync();
//             if (status === 'granted') {
//                 const { data } = await Contacts.getContactsAsync({
//                     fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
//                 });
//                 setContacts(data);
//             } else {
//                 Alert.alert('Permission denied', 'You need to grant permission to access contacts.');
//             }
//         })();
//     }, []);

//     const handleCall = () => {
//         const contact = findContactByName(spokenContactName);
//         if (contact) {
//             const phoneNumber = contact.phoneNumbers[0].number;
//             makeCall(phoneNumber);
//         } else {
//             Alert.alert('Contact not found', `No contact found with the name '${spokenContactName}'.`);
//         }
//     };

//     const findContactByName = (name) => {
//         return contacts.find(contact => contact.name.toLowerCase() === name.toLowerCase());
//     };

//     const makeCall = async (phoneNumber) => {
//         try {
//             await Speech.speak(`Calling ${spokenContactName}`);
//             // Replace 'tel:' with 'telprompt:' for iOS to directly make the call without prompting
//             await Linking.openURL(`tel:${phoneNumber}`);
//         } catch (error) {
//             console.error('An error occurred while making the call', error);
//             Alert.alert('Error', 'Failed to make the call.');
//         }
//     };

//     const handleSpeechRecognition = async () => {
//         try {
//             const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
//             if (status === 'granted') {
//                 const { transcription, isFinal } = await Speech.recognizeSpeechAsync({
//                     language: 'en-US',
//                 });
//                 if (isFinal) {
//                     setSpokenContactName(transcription);
//                 }
//             } else {
//                 Alert.alert('Permission denied', 'You need to grant permission to access speech recognition.');
//             }
//         } catch (error) {
//             console.error('An error occurred while recognizing speech', error);
//             Alert.alert('Error', 'Failed to recognize speech.');
//         }
//     };


//     return (
//         <View>
//             <Button title="Speak Contact Name" onPress={handleSpeechRecognition} />
//             <Button title="Make Call" onPress={handleCall} />
//         </View>
//     )
// }

// export default Home
