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

  async function compartilharFoto(){
    if(!foto){
      alert("Tire uma foto para mostra-lá")
    }
    if(!(await sharing.isAvailableAsync())){
      alert("Não foi possivel compartilhar, tente novamente")
    }
    await sharing.shareAsync(foto);
  }

  if (!permissao) {
    return <View/>
  }


  if(!permissao.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos de sua permissão para tirar foto.</Text>
        <Button onPress={setPermissao} title="Permitir" />
      </View>
    );
  }

  return(
    <View style={styles.container}>

      <CameraView style={styles.camera} ref={cameraRef} facing={modo}>

        <View style={styles.buttonRow}>

          <TouchableOpacity onPress={trocarCamera} style={styles.button}>
            <Entypo name="cycle" size={24} color='white' />
            <Text style={styles.text}>Trocar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={async () => {
            if(cameraRef.current) {
              const foto = await cameraRef.current.takePictureAsync();
              setFoto(foto.uri);
            }}}>

              <Entypo name="camera" size={24} color="white" />
              <Text style={styles.text}>Tirar foto</Text>

            </TouchableOpacity>
        </View>

      </CameraView>

      {foto && (
        <View style={styles.previewContainer}>
          <Image source={{uri: foto}} style={styles.fotoView}/>

          <TouchableOpacity onPress={compartilharFoto} style={styles.shareButton}>
            <Entypo name='compartilhar' color='white' size={24}/>
            <Text style={styles.shareText}>Compartilhar</Text> 
          </TouchableOpacity>
        </View>
      )}
    </View>
  );


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  message:{
    textAlign: 'center',
    paddingBottom: 10
  },
  camera:{
    flex: 1
  },
  buttonRow:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
    marginTop: 5,
    position: 'absolute',
    bottom: 50,
    width: '100%'
  },
  button:{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  text:{
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 5
  },
  shareButton:{
    flexDirection:'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ff6347',
    marginLeft: 10,
    borderRadius: 5
  },
  shareText:{
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 5
  },
  previewContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  fotoView:{
    width:200,
    height: 200
  }
});
