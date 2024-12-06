import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator, ScrollView } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button } from '@rneui/themed';
import { submitImage } from 'src/services/media/submitImage';
import * as ImagePicker from 'expo-image-picker';

type VegetableDesctions = {
  title: string;
  contents: string[];
};

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [vegetableDescriptions, setVegetableDescriptions] = useState<VegetableDesctions[] | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showButtonCapture, setShowButtonCapture] = useState(true);
  const [showButtonSubmit, setShowButtonSubmit] = useState(false);
  const [isButtonCancelCamera, setIsButtonCancelCamera] = useState(false);
  const [showButtonCancelSubmit, setShowButtonCancelSubmit] = useState(false);
  const [initCapureButton, setInitCapureButton] = useState(true);
  const [initUploadButton, setInitUploadButton] = useState(true);
  const [isCamera, setIsCamera] = useState<boolean | null>(null);
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const capturePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7, base64: true });
      setShowButtonCancelSubmit(true);
      setShowButtonSubmit(true);
      setPhotoUri(photo.uri);
      setPhotoFile(photo);
      setShowCamera(false);
      setIsCamera(true);
      setInitCapureButton(false);
    }
  };

  const showCameraView = async () => {
    setInitCapureButton(false);
    setIsButtonCancelCamera(true);
    setShowButtonCapture(false);
    setShowCamera(true);
    setResultImage(null);
    setPhotoUri(null);
    setInitUploadButton(false);
  };

  const disableCameraView = async () => {
    setInitCapureButton(true);
    setIsButtonCancelCamera(false);
    setShowButtonCapture(true);
    setInitUploadButton(true);
  };

  const disableSubmitImage = async () => {
    setResultImage(null);
    setInitCapureButton(true);
    setPhotoUri(null);
    setShowButtonCancelSubmit(false);
    setShowButtonCapture(true);
    setInitUploadButton(true);
  };

  const handleSubmitImage = async () => {
    setLoading(true);
    const formData = new FormData();
    const unixTimestamp = Date.now();
    if (photoFile) {
      formData.append('image', {
        uri: photoUri,
        name: `${unixTimestamp}`,
        type: 'image/jpeg',
      });
    }

    try {
      const response = await submitImage(formData);
      console.log(response.data.description);
      setVegetableDescriptions(response.data.description);
      setShowButtonCapture(true);
      setShowButtonSubmit(false);
      setLoading(false);
      setResultImage(response.data.name);
      setConfidence(response.data.confidence);
    } catch (error) {
      console.error('Failed to submit image:', error);
      setLoading(false);
    }
  };

  const uploadImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
    });

    setInitUploadButton(false);
    setInitCapureButton(false);
    setShowButtonCapture(false);
    setIsCamera(false);

    if (!pickerResult.cancelled) {
      setPhotoUri(pickerResult.assets[0].uri);
      setPhotoFile(pickerResult.assets[0]);
      setShowButtonSubmit(true);
      setShowButtonCancelSubmit(true);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {showCamera && isButtonCancelCamera && (
            <View>
              <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={facing}
              >
              </CameraView>
              <TouchableOpacity onPress={capturePhoto} style={styles.captureButton}>
                <Image
                  source={{ uri: 'https://img.icons8.com/nolan/64/camera.png' }}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={disableCameraView} style={styles.captureButton}>
                <Image
                  source={{ uri: 'https://img.icons8.com/nolan/64/cancel.png' }}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          )}
          {initCapureButton && (
            <View style={styles.buttonContainer}>
              <Button onPress={showCameraView} containerStyle={{ borderRadius: 10, marginTop: 20 }}>
                Capture
              </Button>
            </View>
          )}
          {initUploadButton && (
            <View style={styles.buttonContainer}>
              <Button onPress={uploadImages} containerStyle={{ borderRadius: 10 }}>
                Uploads
              </Button>
            </View>
          )}
          {photoUri && (
            <>
              <Image source={{ uri: photoUri }} style={styles.imagePreview} />
              {showButtonSubmit && showButtonCancelSubmit && (
                <View style={styles.buttonContainer}>
                  <Button onPress={handleSubmitImage} containerStyle={{ borderRadius: 10, marginTop: 20 }}>
                    Submit
                  </Button>
                  <Button onPress={disableSubmitImage} containerStyle={{ borderRadius: 10, marginTop: 20, marginLeft: 10 }}>
                    Cancel
                  </Button>
                  {isCamera && (
                    <Button onPress={showCameraView} containerStyle={{ borderRadius: 10, marginLeft: 10, marginTop: 20 }}>
                      Repeat
                    </Button>
                  )}
                  {!isCamera && (
                    <Button onPress={uploadImages} containerStyle={{ borderRadius: 10, marginLeft: 10, marginTop: 20 }}>
                      Repeat
                    </Button>
                  )}
                </View>
              )}
              {showButtonCapture && (
                <View style={styles.buttonContainer}>
                  {isCamera && (
                    <Button onPress={showCameraView} containerStyle={{ borderRadius: 10, marginTop: 20 }}>
                      Capture
                    </Button>
                  )}
                  {!isCamera && (
                    <Button onPress={uploadImages} containerStyle={{ borderRadius: 10, marginTop: 20 }}>
                      Uploads
                    </Button>
                  )}
                  <Button onPress={disableSubmitImage} containerStyle={{ borderRadius: 10, marginTop: 20, marginLeft: 10 }}>
                    Cancel
                  </Button>
                </View>
              )}
            </>
          )}
          {resultImage && (
            <View>
              <Text style={styles.resultText}>{resultImage} {(confidence ? `: ${confidence * 100}%` : '')}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: '54%',
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
    margin: 16,
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
    textAlign: 'center',
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  }
});
