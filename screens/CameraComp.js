import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera, Permissions } from 'expo';

export default class CameraPage extends React.Component {
  camera = null;

  state = {
    hasCameraPermission: null
  };

  async componentDidMount() {
    const camera = await Permissions.askAsync(Permissions.CAMERA);
    const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    const hasCameraPermission =
      camera.status === 'granted' && audio.status === 'granted';

    this.setState({ hasCameraPermission });
  }

  render() {
    const { hasCameraPermission } = this.state;
    console.log(
      'TCL: CameraPage -> render -> hasCameraPermission',
      hasCameraPermission
    );

    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>Access to camera has been denied.</Text>;
    }

    return (
      <View>
        <React.Fragment>
          <View>
            <Camera
              ref={camera => (this.camera = camera)}
            />
          </View>

        </React.Fragment>
        <Text>Camera</Text>
        <Camera style={styles.preview} ref={camera => (this.camera = camera)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backGround: {
    width: '100%',
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  }
});
