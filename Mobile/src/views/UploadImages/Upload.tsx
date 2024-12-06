import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import { Button } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';

export default function Upload() {
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [showButtonSubmit, setShowButtonSubmit] = useState(false);
    const [showButtonCancelSubmit, setShowButtonCancelSubmit] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [confidence, setConfidence] = useState<number | null>(null);
    const [showButtonUpload, setShowButtonUpload] = useState(true);

    const uploadImages = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permission to access camera roll is required!");
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!pickerResult.cancelled) {
            setPhotoUri(pickerResult.assets[0].uri);
            setShowButtonSubmit(true);
            setShowButtonCancelSubmit(true);
        }

        setShowButtonUpload(false);
    };

    return (
        <View style={styles.container}>
            {showButtonUpload && (
                <View style={styles.buttonContainer}>
                    <Button onPress={uploadImages} containerStyle={{ borderRadius: 10, marginTop: -300 }}>
                        Uploads
                    </Button>
                </View>
            )}
            {photoUri && (
                <>
                    <Image source={{ uri: photoUri }} style={styles.imagePreview} />
                    {showButtonSubmit && showButtonCancelSubmit && (
                        <View style={styles.buttonContainer}>
                            <Button containerStyle={{ borderRadius: 10, marginTop: 20 }}>
                                Submit
                            </Button>
                            <Button containerStyle={{ borderRadius: 10, marginTop: 20, marginLeft: 10 }}>
                                Cancel
                            </Button>
                            <Button containerStyle={{ borderRadius: 10, marginLeft: 10, marginTop: 20 }}>
                                Repeat
                            </Button>
                        </View>
                    )}
                    {resultImage && (
                        <Text style={styles.resultText}>{resultImage} {(confidence ? `: ${confidence}%` : '')}</Text>
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        width: 300,
        height: 400,
        borderRadius: 20,
        overflow: 'hidden',
    },
    buttonContainer: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        justifyContent: 'space-around',
    },
    button: {
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    imagePreview: {
        width: 500,
        height: '60%',
        resizeMode: 'contain',
        marginTop: 10,
        borderRadius: 40,
    },
    resultText: {
        fontSize: 20,
        marginTop: 20,
        color: '#000',
    },
    captureButton: {
        padding: 10,
        borderWidth: 2,
        borderColor: 'gray',
        borderRadius: 40,
        backgroundColor: 'white',
        marginBottom: 10,
        width: 150,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 70,
        margin: 16,
    },
    icon: {
        width: 40,
        height: 40,
    },
});
