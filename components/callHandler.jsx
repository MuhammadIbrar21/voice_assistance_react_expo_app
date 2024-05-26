// CallHandler.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Speech from 'expo-speech';

const CallHandler = () => {
    const [callerName, setCallerName] = useState('');
    const [isListening, setIsListening] = useState(false);
    const webviewRef = useRef(null);

    useEffect(() => {
        if (callerName) {
            announceIncomingCall(callerName);
        }
    }, [callerName]);

    const announceIncomingCall = (name) => {
        Speech.speak(`${name} is calling you. Say "yes" to answer or "no" to reject.`);
        setTimeout(() => {
            startListeningForResponse();
        }, 3000); // Give time for announcement before listening
    };

    const startListeningForResponse = () => {
        setIsListening(true);
        if (webviewRef.current) {
            webviewRef.current.postMessage('start');
        }
    };

    const handleUserResponse = (response) => {
        setIsListening(false);
        if (response.includes('yes')) {
            Speech.speak('Call answered');
            // Logic to answer the call
        } else if (response.includes('no')) {
            Speech.speak('Call rejected');
            // Logic to reject the call
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <WebView
                ref={webviewRef}
                source={{ uri: 'https://muhammadibrar21.github.io/SpeechToTextIncomingCall/' }}
                onMessage={(event) => {
                    const transcript = event.nativeEvent.data.toLowerCase();
                    handleUserResponse(transcript);
                }}
                style={{ height: 0, width: 0 }} // Hide the WebView
            />
            <Text>{isListening ? 'Listening...' : 'Not listening'}</Text>
            <Text>Caller: {callerName}</Text>
            <Button title="Test Call" onPress={() => announceIncomingCall('John Doe')} />
        </View>
    );
};

export default CallHandler;
