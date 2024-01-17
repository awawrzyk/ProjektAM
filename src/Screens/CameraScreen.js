import React, { useState, useEffect, useRef } from "react";
import { View, Button, StyleSheet, Text, Image } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

export default CameraScreen = ({ navigation }) => {
  const [permissionCamera, setPermissionCamera] = useState(null);
  const [permissionGallery, setPermissionGallery] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const camRef = useRef(null);

  useEffect(() => {
    (async () => {
      const statusCamera = await Camera.requestCameraPermissionsAsync();
      setPermissionCamera(statusCamera.status === "granted");

      const statusGallery = await ImagePicker.getMediaLibraryPermissionsAsync();
      setPermissionGallery(statusGallery.status === "granted");
    })();
  }, []);

  const handleImage = async () => {
    if (camRef.current) {
      const photo = await camRef.current.takePictureAsync({saveToPhotos: true});
      setImageUri(photo.uri);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {permissionCamera ? (
        <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} ref={camRef}>
            <View style={styles.cameraContainer}>
                <View style={styles.cameraView}>
                    <Button title="Zrób zdjęcie produktu" onPress={handleImage} />
                </View>
          </View>
        </Camera>
      ) : (
        <Text>Brak uprawień do obsługi kamery. Zmień uprawnienia</Text>
      )}

      {imageUri && (
        <View style={{ flex: 1 }}>
          <Image source={{ uri: imageUri }} style={{ flex: 1 }} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
      },
  cameraView: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 700,
  },
});
