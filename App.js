import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import { useState, useRef } from 'react';
import {Entypo} from '@expo/vector-icons';
import * as sharing from 'expo-sharing';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Image, Button } from 'react-native';

export default function App() {

  const [modo, setModo ] = useState('back');
  const [permissao, setPermissao] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [foto, setFoto] = useState(null);

  function trocarCamera() {
    setModo(modo === 'back' ? 'front' : 'back');
  }

  if (!permissao) {
    return <View/>
  }


  if(!permissao.granted) {
    return (
      <View style={styles.container}>
        <Text>Precisamos de sua permissão para tirar foto.</Text>
        <Button onPress={setPermissao} title="Permitir" />
      </View>
    );
  }

  return(
    <View>
      <CameraView style={{height: 300, width: 300}} ref={cameraRef} type={modo}>
        <View>

          <TouchableOpacity onPress={trocarCamera}>
            <Entypo name="cycle" size={24} color="black" />
            <Text>Trocar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={async () => {
            if(cameraRef.current) {
              const foto = await cameraRef.current.takePictureAsync();
              setFoto(foto.uri);
            }}}>

              <Entypo name="camera" size={24} color="black" />
              <Text>Tirar foto</Text>

            </TouchableOpacity>
        </View>
      </CameraView>
      {foto && <Image source={{uri: foto}} style={{height: 300, width: 300}} />}
    </View>
  );


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: StatusBar.currentHeight,
  },
});
