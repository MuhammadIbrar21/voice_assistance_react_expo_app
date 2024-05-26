// App.js
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import { WebView } from 'react-native-webview';

const Profile = () => {
    const webviewRef = useRef(null);
    const [callerName, setCallerName] = useState('');

    useEffect(() => {
        // Simulate an incoming call after 5 seconds for demonstration
        setTimeout(() => {
            setCallerName('John Doe');
            announceIncomingCall('John Doe');
        }, 5000);
    }, []);

    const announceIncomingCall = (name) => {
        Speech.speak(`${name} is calling you. Say "yes" to answer or "no" to reject.`);
        setTimeout(() => {
            startListeningForResponse();
        }, 3000); // Give time for announcement before listening
    };

    const startListeningForResponse = () => {
        if (webviewRef.current) {
            webviewRef.current.postMessage('start');
        }
    };

    const handleUserResponse = (response) => {
        if (response.includes('yes')) {
            Speech.speak('Call answered');
            // Logic to answer the call
        } else if (response.includes('no')) {
            Speech.speak('Call rejected');
            // Logic to reject the call
        }
    };

    return (
        <View style={styles.container}>
            <Text>Incoming Call Simulator</Text>
            <Text>Caller: {callerName}</Text>
            <WebView
                ref={webviewRef}
                source={{ uri: 'https://muhammadibrar21.github.io/SpeechToTextIncomingCall/' }} // Adjust the path as necessary for your project
                onMessage={(event) => {
                    const transcript = event.nativeEvent.data.toLowerCase();
                    handleUserResponse(transcript);
                }}
                style={{ height: 0, width: 0 }} // Hide the WebView
            />
            <Button title="Simulate Incoming Call" onPress={() => announceIncomingCall('Jane Doe')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Profile;
